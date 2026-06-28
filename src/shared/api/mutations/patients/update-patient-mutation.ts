import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { Patient } from '@/types/patients/patient';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';

export interface UpdatePatientPayload {
  uuid: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  email?: string;
  gender?: string;
  bloodType?: string;
  linkedProductUuid?: string | null;
}

export function useUpdatePatientMutation() {
  const {
    mutate: executeUpdatePatient,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['updatePatient'],
    mutationFn: ({ uuid, ...payload }: UpdatePatientPayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).patch<Patient>(`/patients/${uuid}`, payload),
  });

  return {
    executeUpdatePatient,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
