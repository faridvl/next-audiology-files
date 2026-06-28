import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';

export function useDeleteUserMutation() {
  const {
    mutate: executeDeleteUser,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['deleteUser'],
    mutationFn: (uuid: string) =>
      ApiServiceClient(env.API.IDENTITY_URL).delete(`/users/${uuid}`),
  });

  return {
    executeDeleteUser,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
