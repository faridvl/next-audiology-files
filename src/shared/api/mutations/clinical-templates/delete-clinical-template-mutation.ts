import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';

export function useDeleteClinicalTemplateMutation() {
  const {
    mutate: executeDeleteClinicalTemplate,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['deleteClinicalTemplate'],
    mutationFn: (uuid: string) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).delete(`/clinical-templates/${uuid}`),
  });

  return {
    executeDeleteClinicalTemplate,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
