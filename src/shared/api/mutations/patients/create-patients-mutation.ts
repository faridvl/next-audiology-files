import { ApiServiceClient } from '../../api-service-client';
import { env } from '../../config';
import { useApiMutation } from '../use-api-mutation';
import { CreatePatientPayload } from '@/types/patients/patient';

export type { CreatePatientPayload };

export function useCreatePatientMutation() {
  const {
    mutate: executeCreatePatient,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['createPatient'],
    mutationFn: (payload: CreatePatientPayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).post('/patients', payload),
  });

  return {
    executeCreatePatient,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
