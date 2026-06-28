import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { Appointment, AppointmentStatus } from '@/types/appointments/appointment';
import { useApiMutation } from '../use-api-mutation';

export type UpdateAppointmentPayload = {
  uuid: string;
  status?: AppointmentStatus;
  date?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
};

const APPOINTMENTS_URL = env.API.MEDICAL_RECORDS_URL;

export function useUpdateAppointmentMutation() {
  const {
    mutate: executeUpdateAppointment,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['updateAppointment'],
    mutationFn: ({ uuid, ...payload }: UpdateAppointmentPayload) =>
      ApiServiceClient(APPOINTMENTS_URL).patch<Appointment>(`/appointments/${uuid}`, payload),
  });

  return {
    executeUpdateAppointment,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
