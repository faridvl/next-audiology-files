import { useState, useEffect } from 'react';
import { usePatientsQuery, PatientStatusFilter } from '@/shared/api/querys/patients-query';
import { useNavigation } from '@/hooks/use-navigation';

export function usePatientList() {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PatientStatusFilter>('active');
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = usePatientsQuery(page, limit, debouncedSearch, statusFilter);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilter = (value: PatientStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  return {
    patients: data?.data || [],
    meta: data?.meta,
    searchTerm,
    statusFilter,
    isLoading,
    isError,
    page,
    handleSearch,
    handleStatusFilter,
    handlePageChange: setPage,
    navigateToCreate: () => navigation.patients.create(),
    navigateToDetail: (uuid: string) => navigation.patients.detail(uuid),
    navigateToEdit: (uuid: string) => navigation.patients.edit(uuid),
  };
}
