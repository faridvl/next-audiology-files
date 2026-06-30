import { useApiMutation } from '../use-api-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { PatientDevice, CreatePatientDevicePayload } from '@/types/patients/patient-device.types';

export function useCreatePatientDeviceMutation(patientUuid: string) {
  const { mutate: executeCreateDevice, isPending } = useApiMutation({
    mutationKey: ['createPatientDevice', patientUuid],
    mutationFn: (payload: CreatePatientDevicePayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).post<PatientDevice>(
        `/patients/${patientUuid}/devices`,
        payload,
      ),
  });

  return { executeCreateDevice, isPending };
}
