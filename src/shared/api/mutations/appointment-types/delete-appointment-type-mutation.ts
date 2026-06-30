import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '../use-api-mutation';

const BASE_URL = env.API.MEDICAL_RECORDS_URL;

export function useDeleteAppointmentTypeMutation() {
  const {
    mutate: executeDeleteAppointmentType,
    isPending,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['deleteAppointmentType'],
    mutationFn: (uuid: string) => ApiServiceClient(BASE_URL).delete(`/appointment-types/${uuid}`),
  });

  return {
    executeDeleteAppointmentType,
    isPending,
    error: !!error,
    reset,
  };
}
