import { useQueryClient } from '@tanstack/react-query';
import { ApiServiceClient } from '../../api-service-client';
import { env } from '../../config';
import { useApiMutation } from '../use-api-mutation';

export function useDeletePatientMutation() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useApiMutation({
    mutationKey: ['deletePatient'],
    mutationFn: (uuid: string) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).delete(`/patients/${uuid}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  return { deletePatient: mutateAsync, isPending, error };
}
