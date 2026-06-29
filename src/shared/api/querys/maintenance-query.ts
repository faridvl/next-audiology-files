import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useQuery } from '@tanstack/react-query';
import { MaintenanceEntity } from '@/types/maintenance/maintenance.types';

const URL = env.API.MEDICAL_RECORDS_URL;

export const FETCH_MAINTENANCE_BY_PATIENT_KEY = 'fetchMaintenanceByPatient';
export const FETCH_UPCOMING_MAINTENANCE_KEY = 'fetchUpcomingMaintenance';

export function useMaintenanceByPatientQuery(patientUuid: string) {
  return useQuery({
    queryKey: [FETCH_MAINTENANCE_BY_PATIENT_KEY, patientUuid],
    queryFn: () =>
      ApiServiceClient(URL).get<MaintenanceEntity[]>(`/maintenance/patient/${patientUuid}`),
    enabled: !!patientUuid,
  });
}

export function useUpcomingMaintenanceQuery(month: string) {
  return useQuery({
    queryKey: [FETCH_UPCOMING_MAINTENANCE_KEY, month],
    queryFn: () =>
      ApiServiceClient(URL).get<MaintenanceEntity[]>(`/maintenance/upcoming?month=${month}`),
    enabled: !!month,
  });
}
