import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { UserDetail, UpdateUserPayload } from '@/types/users/user.types';
import { useApiMutation } from '../use-api-mutation';

const IDENTITY_URL = env.API.IDENTITY_URL;

export function useUpdateUserMutation() {
  const {
    mutate: executeUpdateUser,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['updateUser'],
    mutationFn: ({ uuid, ...payload }: UpdateUserPayload) =>
      ApiServiceClient(IDENTITY_URL).patch<UserDetail>(`/users/${uuid}`, payload),
  });

  return {
    executeUpdateUser,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
