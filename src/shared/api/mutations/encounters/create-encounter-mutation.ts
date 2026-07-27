import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';
import { EncounterResponse } from '@/shared/api/querys/encounters-query';

export interface CreateEncounterPayload {
  patientUuid: string;
  especialidad: string;
  appointmentUuid?: string | null;
}

export function useCreateEncounterMutation() {
  const {
    mutate: executeCreateEncounter,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['createEncounter'],
    mutationFn: (payload: CreateEncounterPayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).post<EncounterResponse>('/encounters', payload),
  });

  return { executeCreateEncounter, isPending, isSuccess, error: !!error, reset };
}
