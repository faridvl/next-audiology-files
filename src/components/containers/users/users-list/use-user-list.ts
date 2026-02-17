import { useState, useMemo } from 'react';
import { useUsersQuery } from '@/shared/api/querys/user-query';

export const ROLES_FILTER = ['Todos', 'ADMIN', 'DOCTOR', 'STAFF'] as const;
export type RoleFilterType = (typeof ROLES_FILTER)[number];

export function useUsersContainer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRole, setActiveRole] = useState<RoleFilterType>('Todos');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useUsersQuery(page, limit, searchTerm, activeRole);

  const columns = useMemo(
    () => [
      { header: 'Usuario', accessor: 'userDisplay', width: '40%' },
      { header: 'Rol / Especialidad', accessor: 'roleDisplay' },
      { header: 'Estado', accessor: 'statusDisplay' },
    ],
    [],
  );

  return {
    users: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError,
    searchTerm,
    activeRole,
    page,
    columns,
    handleSearch: (v: string) => {
      setSearchTerm(v);
      setPage(1);
    },
    handleRoleChange: (r: RoleFilterType) => {
      setActiveRole(r);
      setPage(1);
    },
    handlePageChange: setPage,
    refresh: refetch,
  };
}
