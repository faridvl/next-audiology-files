import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { ClinicalTemplate, ClinicalFieldDefinition } from '@/types/clinical-template/clinical-template.types';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';

export interface CreateClinicalTemplatePayload {
  name: string;
  speciality: string;
  fields: ClinicalFieldDefinition[];
}

export function useCreateClinicalTemplateMutation() {
  const {
    mutate: executeCreateClinicalTemplate,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['createClinicalTemplate'],
    mutationFn: (payload: CreateClinicalTemplatePayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).post<ClinicalTemplate>(
        '/clinical-templates',
        payload,
      ),
  });

  return {
    executeCreateClinicalTemplate,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
