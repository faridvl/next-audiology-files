import { ApiServiceClient } from '../../api-service-client';
import { env } from '../../config';
import { useApiMutation } from '../use-api-mutation';
import { RegisterPayload } from '@/types/auth/auth';

export function useRegisterMutation() {
  const {
    mutate: executeRegister,
    isPending,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['registerUser'],
    mutationFn: (values: RegisterPayload) =>
      ApiServiceClient(env.API.IDENTITY_URL).post('/auth/register', values),
  });

  return {
    executeRegister,
    isPending,
    error,
    reset,
  };
}
