import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { Appointment, AppointmentStatus, CreateAppointmentPayload } from '@/types/appointments/appointment';
import { useApiMutation } from '../use-api-mutation';

export type { CreateAppointmentPayload };

const APPOINTMENTS_URL = env.API.MEDICAL_RECORDS_URL;

export function useCreateAppointmentMutation() {
  const {
    mutate: executeCreateAppointment,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['createAppointment'],
    mutationFn: (payload: CreateAppointmentPayload) =>
      ApiServiceClient(APPOINTMENTS_URL).post<Appointment>('/appointments', payload),
  });

  return {
    executeCreateAppointment,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
