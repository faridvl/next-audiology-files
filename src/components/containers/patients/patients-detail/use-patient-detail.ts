import { useState, useEffect, useMemo } from 'react';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useMedicalControlsQuery } from '@/shared/api/querys/medical-controls-query';
import { useAppointmentByPatientQuery } from '@/shared/api/querys/get-appoinment-by-patient-query';
import { useMaintenanceByPatientQuery } from '@/shared/api/querys/maintenance-query';
import { MaintenanceEntity } from '@/types/maintenance/maintenance.types';
import { ClinicalControl, ControlType } from '@/types/otros/clinical';
import { AudiogramData, MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { AppointmentStatus } from '@/types/appointments/appointment';

interface MedicalControlResponse {
  uuid: string;
  createdAt: string;
  header: {
    patientUUID: string;
    speciality: MedicalSpeciality;
    schemaVersion: number;
    doctorName?: string;
  };
  clinicalData: {
    findings: Record<string, unknown>;
    diagnosis: string;
  };
}

interface AppointmentResponse {
  uuid: string;
  status: AppointmentStatus;
  schedule: { date: string; startTime: string; endTime: string };
  notes?: string;
  type?: { name: string };
}

export type RecordTypeFilter = 'ALL' | 'CONTROL' | 'AUDIOGRAM' | 'MAINTENANCE';

export function usePatientDetail(uuid: string, userSpecialty?: string) {
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
  } = useMedicalControlsQuery(uuid, page, 10);

  const { data: appointmentsData } = useAppointmentByPatientQuery(uuid);
  const { data: maintenancesData } = useMaintenanceByPatientQuery(uuid);

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

  // --- LÓGICA DE CLIENTE: FILTRADO, MAPEO Y ORDEN ---
  const mappedHistory = useMemo(() => {
    // 1. Filtrar la lista acumulada de controles (In-Memory)
    const filtered = allRecords.filter((item) => {
      const matchesUserSpecialty =
        userSpecialty === undefined || item.header.speciality === userSpecialty;
      const matchesSpec = selectedSpec === 'ALL' || item.header.speciality === selectedSpec;

      const matchesSearch =
        item.clinicalData.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.header.speciality.toLowerCase().includes(searchTerm.toLowerCase());

      const hasAudiogram = !!item.clinicalData.findings?.audiogram;
      const matchesRecordType =
        recordTypeFilter === 'ALL' ||
        (recordTypeFilter === 'CONTROL') ||
        (recordTypeFilter === 'AUDIOGRAM' && hasAudiogram);

      return matchesUserSpecialty && matchesSpec && matchesSearch && matchesRecordType;
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
    }));

    // 3. Transformar mantenimientos al mismo formato, si el filtro los incluye
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
            }))
        : [];

    // 4. Unir y ordenar siempre por fecha (los más nuevos primero)
    return [...controlItems, ...maintenanceItems].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [allRecords, maintenancesData, searchTerm, selectedSpec, userSpecialty, recordTypeFilter]);

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

  const latestAudiogram = useMemo((): AudiogramData | null => {
    const audiologyControls = allRecords
      .filter((record) => record.header?.speciality === 'AUDIOLOGY')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const audiogram = audiologyControls[0]?.clinicalData?.findings?.audiogram;
    if (!audiogram) return null;
    return audiogram as AudiogramData;
  }, [allRecords]);

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
    summary,
    latestAudiogram,
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
    recordTypeFilter,
    setRecordTypeFilter,

    // Permisos
    canEdit: true,
  };
}
