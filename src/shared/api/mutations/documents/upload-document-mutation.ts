import { useApiMutation } from '../use-api-mutation';
import { env } from '@/shared/api/config';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { PatientDocument, DocumentCategoryApiValue } from '@/types/documents/document.types';

export interface UploadDocumentPayload {
  patientUuid: string;
  file: File;
  category: DocumentCategoryApiValue;
}

async function uploadDocument(payload: UploadDocumentPayload): Promise<PatientDocument> {
  const token = CookiesManager.getAccessToken();
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('category', payload.category);

  const response = await fetch(
    `${env.API.MEDICAL_RECORDS_URL}/patients/${payload.patientUuid}/documents`,
    {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error((errorData as { message?: string }).message || 'Error al subir el documento');
  }

  return response.json() as Promise<PatientDocument>;
}

export function useUploadDocumentMutation() {
  const { mutate: executeUploadDocument, isPending, isSuccess, error, reset } = useApiMutation({
    mutationKey: ['uploadDocument'],
    mutationFn: (payload: UploadDocumentPayload) => uploadDocument(payload),
  });

  return {
    executeUploadDocument,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
