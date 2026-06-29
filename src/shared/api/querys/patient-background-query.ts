import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useQuery } from '@tanstack/react-query';
import { PatientBackgroundEntity } from '@/types/patients/patient-background.types';

const URL = env.API.MEDICAL_RECORDS_URL;

export const FETCH_PATIENT_BACKGROUND_KEY = 'fetchPatientBackground';

export function usePatientBackgroundQuery(patientUuid: string) {
  return useQuery({
    queryKey: [FETCH_PATIENT_BACKGROUND_KEY, patientUuid],
    queryFn: () =>
      ApiServiceClient(URL).get<PatientBackgroundEntity>(`/patients/${patientUuid}/background`),
    enabled: !!patientUuid,
  });
}
