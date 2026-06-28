import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useQuery } from '@tanstack/react-query';

export type AppointmentType = {
  uuid: string;
  name: string;
  duration?: number | null;
  color?: string | null;
  tenantUUID: string;
};

const BASE_URL = env.API.MEDICAL_RECORDS_URL;

export const FETCH_APPOINTMENT_TYPES_KEY = 'fetchAppointmentTypes';

export function useAppointmentTypesQuery() {
  return useQuery({
    queryKey: [FETCH_APPOINTMENT_TYPES_KEY],
    queryFn: () => ApiServiceClient(BASE_URL).get<AppointmentType[]>('/appointment-types'),
  });
}
