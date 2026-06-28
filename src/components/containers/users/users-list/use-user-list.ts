import { useState, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUsersQuery, FETCH_USERS_KEY } from '@/shared/api/querys/user-query';
import { useDeleteUserMutation } from '@/shared/api/mutations/users/delete-user-mutation';
import { toast } from 'sonner';

export const ROLES_FILTER = ['Todos', 'ADMIN', 'DOCTOR', 'STAFF'] as const;
export type RoleFilterType = (typeof ROLES_FILTER)[number];

export function useUsersContainer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRole, setActiveRole] = useState<RoleFilterType>('Todos');
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useUsersQuery(page, limit, searchTerm, activeRole);
  const { executeDeleteUser } = useDeleteUserMutation();

  const columns = useMemo(
    () => [
      { header: 'Usuario', accessor: 'userDisplay', width: '40%' },
      { header: 'Rol / Especialidad', accessor: 'roleDisplay' },
      { header: 'Estado', accessor: 'statusDisplay' },
    ],
    [],
  );

  const handleDeleteUser = useCallback(
    (uuid: string) => {
      if (!window.confirm('¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.')) return;
      executeDeleteUser(uuid, {
        onSuccess: () => {
          toast.success('Usuario eliminado correctamente.');
          queryClient.invalidateQueries({ queryKey: [FETCH_USERS_KEY] });
        },
        onError: () => {
          toast.error('Error al eliminar el usuario.');
        },
      });
    },
    [executeDeleteUser, queryClient],
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
    handleSearch: (value: string) => {
      setSearchTerm(value);
      setPage(1);
    },
    handleRoleChange: (role: RoleFilterType) => {
      setActiveRole(role);
      setPage(1);
    },
    handlePageChange: setPage,
    handleDeleteUser,
    refresh: refetch,
  };
}
