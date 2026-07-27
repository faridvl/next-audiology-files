import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';
import { CreateStudyPayload, Study } from '@/types/studies/study.types';

export function useCreateStudyMutation() {
  const {
    mutate: executeCreateStudy,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['createStudy'],
    mutationFn: (payload: CreateStudyPayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).post<Study>('/studies', payload),
  });

  return {
    executeCreateStudy,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
