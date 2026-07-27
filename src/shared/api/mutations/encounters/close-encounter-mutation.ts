import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';
import { EncounterResponse } from '@/shared/api/querys/encounters-query';

export function useCloseEncounterMutation() {
  const {
    mutate: executeCloseEncounter,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['closeEncounter'],
    mutationFn: (encounterUuid: string) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).patch<EncounterResponse>(`/encounters/${encounterUuid}/close`, {}),
  });

  return { executeCloseEncounter, isPending, isSuccess, error: !!error, reset };
}
