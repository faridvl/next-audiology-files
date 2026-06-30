import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '../use-api-mutation';

const APPOINTMENTS_URL = env.API.MEDICAL_RECORDS_URL;

export function useDeleteAppointmentMutation() {
  const {
    mutate: executeDeleteAppointment,
    isPending,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['deleteAppointment'],
    mutationFn: (uuid: string) => ApiServiceClient(APPOINTMENTS_URL).delete(`/appointments/${uuid}`),
  });

  return {
    executeDeleteAppointment,
    isPending,
    error: !!error,
    reset,
  };
}
