import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { PatientDevice } from '@/types/patients/patient-device.types';

export const FETCH_PATIENT_DEVICES_KEY = 'fetchPatientDevices';

export function usePatientDevicesQuery(patientUuid: string) {
  return useQuery({
    queryKey: [FETCH_PATIENT_DEVICES_KEY, patientUuid],
    queryFn: () =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).get<PatientDevice[]>(
        `/patients/${patientUuid}/devices`,
      ),
    enabled: !!patientUuid,
  });
}
