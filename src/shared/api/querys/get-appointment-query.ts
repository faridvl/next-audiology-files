import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { Appointment } from '@/types/appointments/appointment';
import { useQuery } from '@tanstack/react-query';

const APPOINTMENTS_URL = env.API.MEDICAL_RECORDS_URL;

const AppointmentService = {
  fetchOne: async (uuid: string): Promise<Appointment> =>
    ApiServiceClient(APPOINTMENTS_URL).get<Appointment>(`/appointments/${uuid}`),
};

export const FETCH_APPOINTMENT_KEY = 'fetchAppointment';

export function useAppointmentQuery(uuid: string) {
  return useQuery({
    queryKey: [FETCH_APPOINTMENT_KEY, uuid],
    queryFn: () => AppointmentService.fetchOne(uuid),
    enabled: !!uuid,
    staleTime: 1000 * 60 * 5,
  });
}
