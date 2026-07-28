import { useState, useEffect, useMemo } from 'react';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useMedicalControlsQuery } from '@/shared/api/querys/medical-controls-query';
import { useAppointmentByPatientQuery } from '@/shared/api/querys/get-appoinment-by-patient-query';
import { useMaintenanceByPatientQuery } from '@/shared/api/querys/maintenance-query';
import { useEncountersByPatientQuery, EncounterResponse } from '@/shared/api/querys/encounters-query';
import { useStudiesByPatientQuery } from '@/shared/api/querys/studies-query';
import { MaintenanceEntity } from '@/types/maintenance/maintenance.types';
import { ClinicalControl, ControlType } from '@/types/otros/clinical';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { StudyType } from '@/types/studies/study.types';
import { AudiometryThreshold } from '@/types/studies/audiometry.types';
import { parseAudiometryPayload } from '@/shared/utils/audiometry';
import { AppointmentStatus } from '@/types/appointments/appointment';

interface MedicalControlResponse {
  uuid: string;
  createdAt: string;
  header: {
    patientUUID: string;
    encounterUuid: string | null;
    speciality: MedicalSpeciality;
    schemaVersion: number;
    doctorName?: string;
  };
  clinicalData: {
    findings: Record<string, unknown>;
    diagnosis: string;
  };
}

export interface EncounterGroup {
  encounterUuid: string;
  especialidad: string;
  startedAt: string;
  date: string;
  items: ClinicalControl[];
}

interface AppointmentResponse {
  uuid: string;
  status: AppointmentStatus;
  schedule: { date: string; startTime: string; endTime: string };
  notes?: string;
  type?: { name: string };
}

export type RecordTypeFilter = 'ALL' | 'CONTROL' | 'AUDIOGRAM' | 'MAINTENANCE';

export function usePatientDetail(
  uuid: string,
  canReadClinicalData = true,
  tenantSpeciality?: MedicalSpeciality,
) {
  // --- ESTADOS ---
  const [page, setPage] = useState(1);
  const [allRecords, setAllRecords] = useState<MedicalControlResponse[]>([]);

  // Filtros de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState<string | 'ALL'>('ALL');
  const [recordTypeFilter, setRecordTypeFilter] = useState<RecordTypeFilter>('ALL');

  // --- QUERIES ---
  const { data: patient, isLoading: isLoadingPatient, isError } = usePatientDetailQuery(uuid);

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isFetching,
  } = useMedicalControlsQuery(uuid, page, 10, canReadClinicalData);

  const { data: appointmentsData } = useAppointmentByPatientQuery(uuid);
  const { data: maintenancesData } = useMaintenanceByPatientQuery(uuid);
  const { data: encountersData } = useEncountersByPatientQuery(uuid, canReadClinicalData);
  const { data: studiesData } = useStudiesByPatientQuery(uuid, canReadClinicalData);

  // --- EFECTO: ACUMULACIÓN ---
  // Este efecto se encarga de "unir" las páginas conforme se cargan
  useEffect(() => {
    if (historyData?.data) {
      setAllRecords((prev) => {
        // Filtrar para evitar duplicados por UUID en caso de re-fetch
        const newRecords = (historyData.data as MedicalControlResponse[]).filter(
          (newRec) => !prev.some((oldRec) => oldRec.uuid === newRec.uuid),
        );
        return [...prev, ...newRecords];
      });
    }
  }, [historyData]);

  // Dos reglas encadenadas:
  // 1. La CLÍNICA acota qué especialidades existen en este negocio — una clínica
  //    de audiología no ofrece un filtro DENTAL aunque un registro viejo lo traiga.
  // 2. El PACIENTE acota, de esas, cuáles tiene su expediente — un filtro que
  //    nunca devuelve nada es ruido, no una opción.
  // Nota: esto es preferencia de VISTA, no control de acceso. El expediente sigue
  // mostrando todos los registros por defecto (NOM-004 5.14).
  const specialityOptions = useMemo((): MedicalSpeciality[] => {
    const present = new Set(allRecords.map((record) => record.header.speciality));
    return Object.values(MedicalSpeciality).filter((speciality) => {
      if (tenantSpeciality && speciality !== tenantSpeciality) return false;
      return present.has(speciality);
    });
  }, [allRecords, tenantSpeciality]);

  // Tipos de registro presentes en el expediente — mismo criterio: un filtro
  // que nunca devuelve nada es ruido, no una opción.
  const availableRecordTypes = useMemo(() => ({
    hasControls: allRecords.length > 0,
    hasAudiograms: (studiesData ?? []).some((study) => study.tipo === StudyType.AUDIOMETRIA_TONAL),
    hasMaintenances: ((maintenancesData ?? []) as MaintenanceEntity[]).length > 0,
  }), [allRecords, studiesData, maintenancesData]);

  // Si la especialidad filtrada deja de estar presente, el usuario quedaría con
  // un filtro activo que ya no aparece como botón y una lista vacía sin causa visible.
  useEffect(() => {
    if (selectedSpec !== 'ALL' && !specialityOptions.includes(selectedSpec as MedicalSpeciality)) {
      setSelectedSpec('ALL');
    }
  }, [specialityOptions, selectedSpec]);

  useEffect(() => {
    const isUnavailable =
      (recordTypeFilter === 'AUDIOGRAM' && !availableRecordTypes.hasAudiograms) ||
      (recordTypeFilter === 'MAINTENANCE' && !availableRecordTypes.hasMaintenances);
    if (isUnavailable) setRecordTypeFilter('ALL');
  }, [availableRecordTypes, recordTypeFilter]);

  // --- LÓGICA DE CLIENTE: FILTRADO, MAPEO Y ORDEN ---
  const mappedHistory = useMemo(() => {
    // 1. Filtrar la lista acumulada de controles (In-Memory). El audiograma ya
    // no vive en MedicalControl.findings — es su propia entidad Study (§2 abajo).
    const filtered = allRecords.filter((item) => {
      const matchesSpec = selectedSpec === 'ALL' || item.header.speciality === selectedSpec;

      const matchesSearch =
        item.clinicalData.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.header.speciality.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRecordType = recordTypeFilter === 'ALL' || recordTypeFilter === 'CONTROL';

      return matchesSpec && matchesSearch && matchesRecordType;
    });

    // 2. Transformar controles al formato que espera la UI (ClinicalControl)
    const controlItems: ClinicalControl[] = filtered.map((item) => ({
      id: item.uuid,
      patientId: item.header.patientUUID,
      date: new Date(item.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      type: item.header.speciality as ControlType,
      note: item.clinicalData.diagnosis,
      specialistName: item.header.doctorName || 'Médico Asignado',
      encounterUuid: item.header.encounterUuid,
    }));

    // 3. Transformar estudios (audiometrías) al mismo formato, si el filtro los incluye
    const studyItems: ClinicalControl[] =
      recordTypeFilter === 'ALL' || recordTypeFilter === 'AUDIOGRAM'
        ? (studiesData ?? [])
            .filter((study) => study.tipo === StudyType.AUDIOMETRIA_TONAL)
            .map((study) => ({
              id: study.uuid,
              patientId: study.patientUuid,
              date: new Date(study.createdAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
              type: 'AUDIOGRAM',
              note: 'Audiometría tonal',
              specialistName: 'Médico Asignado',
              encounterUuid: study.encounterUuid,
            }))
        : [];

    // 4. Transformar mantenimientos al mismo formato, si el filtro los incluye
    const maintenanceItems: ClinicalControl[] =
      recordTypeFilter === 'ALL' || recordTypeFilter === 'MAINTENANCE'
        ? ((maintenancesData ?? []) as MaintenanceEntity[])
            .filter((maintenance: MaintenanceEntity) =>
              maintenance.description.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((maintenance: MaintenanceEntity) => ({
              id: maintenance.uuid,
              patientId: maintenance.patientUuid,
              date: new Date(maintenance.performedAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
              type: 'MAINTENANCE',
              note: maintenance.description,
              specialistName: 'Mantenimiento',
              encounterUuid: maintenance.encounterUuid,
            }))
        : [];

    // 5. Unir y ordenar siempre por fecha (los más nuevos primero)
    return [...controlItems, ...studyItems, ...maintenanceItems].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [allRecords, studiesData, maintenancesData, searchTerm, selectedSpec, recordTypeFilter]);

  // --- AGRUPACIÓN POR ENCUENTRO ---
  // Una entrada por visita, no por registro suelto (DOMAIN_ANALYSIS.md §4.8, §5.2):
  // un audiograma y su consulta del mismo día son el mismo encuentro, no dos filas.
  // Registros previos a la migración de Encounter (encounterUuid null) se muestran
  // sueltos, sin agrupar — no hay encuentro al que asociarlos retroactivamente.
  const groupedHistory = useMemo((): EncounterGroup[] => {
    const encounters: EncounterResponse[] = encountersData ?? [];
    const groups: EncounterGroup[] = [];

    for (const encounter of encounters) {
      const items = mappedHistory.filter((record) => record.encounterUuid === encounter.uuid);
      if (items.length === 0) continue;
      groups.push({
        encounterUuid: encounter.uuid,
        especialidad: encounter.especialidad,
        startedAt: encounter.startedAt,
        date: new Date(encounter.startedAt).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        items,
      });
    }

    const ungroupedItems = mappedHistory.filter((record) => !record.encounterUuid);
    for (const item of ungroupedItems) {
      groups.push({
        encounterUuid: item.id,
        especialidad: item.type,
        startedAt: item.date,
        date: item.date,
        items: [item],
      });
    }

    return groups.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }, [encountersData, mappedHistory]);

  // --- RESUMEN (SUMMARY) ---
  const appointments = appointmentsData?.appointments ?? [];

  const nextAppointmentData = useMemo((): AppointmentResponse | null => {
    const upcoming = (appointments as AppointmentResponse[])
      .filter((appointment) =>
        [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.TENTATIVE].includes(appointment.status)
      )
      .sort((a, b) =>
        new Date(a.schedule.startTime).getTime() - new Date(b.schedule.startTime).getTime()
      );
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    if (!nextAppointmentData) return 'Sin programar';
    return new Date(nextAppointmentData.schedule.startTime).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }, [nextAppointmentData]);

  const warrantyExpiration = useMemo(() => {
    const maintenances: MaintenanceEntity[] = maintenancesData ?? [];
    const withNext = maintenances
      .filter((m) => m.nextMaintenanceAt)
      .sort((a, b) => new Date(a.nextMaintenanceAt!).getTime() - new Date(b.nextMaintenanceAt!).getTime());
    if (withNext.length === 0) return 'Sin programar';
    return new Date(withNext[0].nextMaintenanceAt!).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }, [maintenancesData]);

  // Umbrales tipados del audiograma más reciente. Soporta la forma legacy
  // (solo OD/OI aéreo) además de la tipada — sin migración de datos.
  const latestAudiogramThresholds = useMemo((): AudiometryThreshold[] => {
    const audiometryStudies = (studiesData ?? [])
      .filter((study) => study.tipo === StudyType.AUDIOMETRIA_TONAL)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const latest = audiometryStudies[0];
    if (!latest) return [];
    return parseAudiometryPayload(latest.payload);
  }, [studiesData]);

  const summary = {
    nextAppointment,
    lastAppointment: mappedHistory.length > 0 ? mappedHistory[0].date : 'Sin registros',
    pendingMaintenance: (maintenancesData ?? []) as MaintenanceEntity[],
    warrantyExpiration,
  };

  return {
    // Datos de carga
    patient,
    history: mappedHistory,
    groupedHistory,
    summary,
    latestAudiogramThresholds,
    nextAppointmentData,

    // Estados de carga
    // isLoading es para la carga inicial, isFetching para las páginas subsecuentes
    isLoading: isLoadingPatient || (isLoadingHistory && page === 1),
    isFetching,
    isError,

    // Paginación
    hasMore: historyData?.meta ? page < historyData.meta.totalPages : false,
    loadMore: () => setPage((prev) => prev + 1),

    // Filtros
    searchTerm,
    setSearchTerm,
    selectedSpec,
    setSelectedSpec,
    specialityOptions,
    availableRecordTypes,
    recordTypeFilter,
    setRecordTypeFilter,

    // Permisos
    canEdit: true,
  };
}
