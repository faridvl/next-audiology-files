import { useState } from 'react';
import { usePatientsQuery } from '@/shared/api/querys/patients-query';
import { useNavigation } from '@/hooks/use-navigation';

export function usePatientList() {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = usePatientsQuery(page, limit, searchTerm);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  return {
    patients: data?.data || [],
    meta: data?.meta,
    searchTerm,
    isLoading,
    isError,
    page,
    handleSearch,
    handlePageChange: setPage,
    navigateToCreate: () => navigation.patients.create(),
    navigateToDetail: (uuid: string) => navigation.patients.detail(uuid),
    navigateToEdit: (uuid: string) => navigation.patients.edit(uuid),
  };
}
