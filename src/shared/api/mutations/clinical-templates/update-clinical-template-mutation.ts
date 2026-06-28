import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { ClinicalTemplate, ClinicalFieldDefinition } from '@/types/clinical-template/clinical-template.types';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';

export interface UpdateClinicalTemplatePayload {
  uuid: string;
  name?: string;
  speciality?: string;
  fields?: ClinicalFieldDefinition[];
}

export function useUpdateClinicalTemplateMutation() {
  const {
    mutate: executeUpdateClinicalTemplate,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['updateClinicalTemplate'],
    mutationFn: ({ uuid, ...payload }: UpdateClinicalTemplatePayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).patch<ClinicalTemplate>(
        `/clinical-templates/${uuid}`,
        payload,
      ),
  });

  return {
    executeUpdateClinicalTemplate,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
