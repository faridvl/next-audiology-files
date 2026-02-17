import { useState } from 'react';
import { useRouter } from 'next/router';
import { routesPrivate } from '@/shared/navigation/routes';
import { usePatientsQuery } from '@/shared/api/querys/patients-query';
import { useNavigation } from '@/hooks/use-navigation';

export function usePatientList() {
  const router = useRouter();
  const nav = useNavigation
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Conexión real a la API
  const { data, isLoading, isError } = usePatientsQuery(page, limit, searchTerm);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); 
  };

  const navigateToCreate = () => {
    router.push(routesPrivate.patients.create);
  };

  const navigateToDetail = (uuid: string) => {
    router.push(`${routesPrivate.patients.index}/${uuid}`);
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
    navigateToCreate,
    navigateToDetail,
  };
}
