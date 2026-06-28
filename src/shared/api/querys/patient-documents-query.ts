import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { PatientDocument } from '@/types/documents/document.types';

const MEDICAL_RECORDS_URL = env.API.MEDICAL_RECORDS_URL;

export const FETCH_PATIENT_DOCUMENTS_KEY = 'fetchPatientDocuments';

export const PatientDocumentsService = {
  fetchByPatientUuid: async (patientUuid: string): Promise<PatientDocument[]> => {
    return await ApiServiceClient(MEDICAL_RECORDS_URL).get<PatientDocument[]>(
      `/patients/${patientUuid}/documents`,
    );
  },
};

export function usePatientDocumentsQuery(patientUuid: string) {
  return useQuery({
    queryKey: [FETCH_PATIENT_DOCUMENTS_KEY, patientUuid],
    queryFn: () => PatientDocumentsService.fetchByPatientUuid(patientUuid),
    enabled: !!patientUuid,
    staleTime: 1000 * 60 * 2,
  });
}
