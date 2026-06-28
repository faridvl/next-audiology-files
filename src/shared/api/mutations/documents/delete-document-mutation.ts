import { useApiMutation } from '../use-api-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';

export interface DeleteDocumentPayload {
  patientUuid: string;
  documentId: string;
}

export function useDeleteDocumentMutation() {
  const { mutate: executeDeleteDocument, isPending, isSuccess, error, reset } = useApiMutation({
    mutationKey: ['deleteDocument'],
    mutationFn: (payload: DeleteDocumentPayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).delete(
        `/patients/${payload.patientUuid}/documents/${payload.documentId}`,
      ),
  });

  return {
    executeDeleteDocument,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
