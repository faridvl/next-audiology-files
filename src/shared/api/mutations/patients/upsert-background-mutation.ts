import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '../use-api-mutation';
import { PatientBackgroundEntity, UpsertPatientBackgroundPayload } from '@/types/patients/patient-background.types';

export function useUpsertPatientBackgroundMutation(patientUuid: string) {
  const { mutate: executeUpsertBackground, isPending, isSuccess, error, reset } = useApiMutation({
    mutationKey: ['upsertPatientBackground', patientUuid],
    mutationFn: (payload: UpsertPatientBackgroundPayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).put<PatientBackgroundEntity>(
        `/patients/${patientUuid}/background`,
        payload,
      ),
  });

  return { executeUpsertBackground, isPending, isSuccess, error: !!error, reset };
}
