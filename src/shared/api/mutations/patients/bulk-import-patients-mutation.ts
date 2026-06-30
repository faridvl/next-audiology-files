import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { CreatePatientPayload } from '@/types/patients/patient';
import { BulkImportApiResult } from '@/types/patients/patient-import.types';
import { useApiMutation } from '../use-api-mutation';

export interface BulkImportPatientsPayload {
  patients: CreatePatientPayload[];
}

export function useBulkImportPatientsMutation() {
  const { mutate: executeBulkImport, isPending, isSuccess, error, reset } = useApiMutation({
    mutationKey: ['bulkImportPatients'],
    mutationFn: (payload: BulkImportPatientsPayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).post<BulkImportApiResult>(
        '/patients/bulk',
        payload,
      ),
  });

  return { executeBulkImport, isPending, isSuccess, error: !!error, reset };
}
