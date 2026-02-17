import { useState, useEffect, useMemo } from 'react';
import { useMedicalControlsQuery } from '@/shared/api/querys/medical-controls-query';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';

export function useMedicalHistory(patientId: string) {
  const [page, setPage] = useState(1);
  const [allRecords, setAllRecords] = useState<any[]>([]);

  // Filtros de UI (Cliente)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState<MedicalSpeciality | 'ALL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const { data, isLoading, isFetching } = useMedicalControlsQuery(patientId, page, 10);

  // EFECTO 1: Acumular datos conforme llegan del backend
  useEffect(() => {
    if (data?.data) {
      setAllRecords((prev) => {
        // Evitamos duplicados comparando UUIDs
        const newRecords = data.data.filter(
          (newRec: any) => !prev.some((oldRec) => oldRec.uuid === newRec.uuid),
        );
        return [...prev, ...newRecords];
      });
    }
  }, [data]);

  // LÓGICA DE CLIENTE: Filtrar y Ordenar la lista acumulada
  const displayRecords = useMemo(() => {
    // 1. Filtrar sobre lo que ya tenemos cargado
    let result = allRecords.filter((item) => {
      const matchesSpec = selectedSpec === 'ALL' || item.header.speciality === selectedSpec;
      const matchesSearch = item.clinicalData.diagnosis
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSpec && matchesSearch;
    });

    // 2. Ordenar sobre el resultado filtrado
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [allRecords, searchTerm, selectedSpec, sortOrder]);

  return {
    records: displayRecords,
    isLoading: isLoading && allRecords.length === 0,
    isFetching,
    hasMore: data?.meta ? page < data.meta.totalPages : false,
    searchTerm,
    setSearchTerm,
    selectedSpec,
    setSelectedSpec,
    sortOrder,
    toggleSortOrder: () => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc')),
    loadMore: () => setPage((prev) => prev + 1),
  };
}
