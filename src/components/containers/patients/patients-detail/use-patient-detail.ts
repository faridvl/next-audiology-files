import { useState, useEffect, useMemo } from 'react';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useMedicalControlsQuery } from '@/shared/api/querys/medical-controls-query';
import { ClinicalControl, ControlType } from '@/types/otros/clinical';

// TODO(!): P3-2-API — El API debe validar esto con un guard de especialidad en el backend
export function usePatientDetail(uuid: string, userSpecialty?: string) {
  // --- ESTADOS ---
  const [page, setPage] = useState(1);
  const [allRecords, setAllRecords] = useState<any[]>([]); // Base de datos local acumulativa

  // Filtros de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState<string | 'ALL'>('ALL');

  // --- QUERIES ---
  const { data: patient, isLoading: isLoadingPatient, isError } = usePatientDetailQuery(uuid);

  // Usamos un limit de 5 o 10 para la paginación
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isFetching,
  } = useMedicalControlsQuery(uuid, page, 10);

  // --- EFECTO: ACUMULACIÓN ---
  // Este efecto se encarga de "unir" las páginas conforme se cargan
  useEffect(() => {
    if (historyData?.data) {
      setAllRecords((prev) => {
        // Filtrar para evitar duplicados por UUID en caso de re-fetch
        const newRecords = historyData.data.filter(
          (newRec: any) => !prev.some((oldRec) => oldRec.uuid === newRec.uuid),
        );
        return [...prev, ...newRecords];
      });
    }
  }, [historyData]);

  // --- LÓGICA DE CLIENTE: FILTRADO, MAPEO Y ORDEN ---
  const mappedHistory = useMemo(() => {
    // 1. Filtrar la lista acumulada (In-Memory)
    const filtered = allRecords.filter((item) => {
      // TODO(!): P3-2-API — Filtro por especialidad del médico logueado (capa UX adicional).
      // La seguridad real debe implementarse en el API con un guard de especialidad.
      const matchesUserSpecialty =
        userSpecialty === undefined || item.header.speciality === userSpecialty;
      const matchesSpec = selectedSpec === 'ALL' || item.header.speciality === selectedSpec;

      const matchesSearch =
        item.clinicalData.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.header.speciality.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesUserSpecialty && matchesSpec && matchesSearch;
    });

    // 2. Transformar al formato que espera la UI (ClinicalControl)
    return (
      filtered
        .map(
          (item): ClinicalControl => ({
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
          }),
        )
        // 3. Ordenar siempre por fecha (los más nuevos primero)
        // Nota: Si createdAt no es suficiente, se puede usar el timestamp original
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }, [allRecords, searchTerm, selectedSpec]);

  // --- RESUMEN (SUMMARY) ---
  const summary = {
    nextAppointment: 'Sin programar',
    lastAppointment: mappedHistory.length > 0 ? mappedHistory[0].date : 'Sin registros',
    pendingMaintenance: [],
    warrantyExpiration: 'Consultar equipo',
  };

  return {
    // Datos de carga
    patient,
    history: mappedHistory,
    summary,

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

    // Permisos
    canEdit: true,
  };
}
