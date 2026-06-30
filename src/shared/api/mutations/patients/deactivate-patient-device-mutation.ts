import { useApiMutation } from '../use-api-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';

export function useDeactivatePatientDeviceMutation(patientUuid: string) {
  const { mutate: executeDeactivateDevice, isPending } = useApiMutation({
    mutationKey: ['deactivatePatientDevice', patientUuid],
    mutationFn: (deviceUuid: string) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).delete(
        `/patients/${patientUuid}/devices/${deviceUuid}`,
      ),
  });

  return { executeDeactivateDevice, isPending };
}
