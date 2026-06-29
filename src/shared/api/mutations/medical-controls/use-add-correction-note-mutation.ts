import { useQueryClient } from '@tanstack/react-query';
import { ApiServiceClient } from '../../api-service-client';
import { env } from '../../config';
import { useApiMutation } from '../use-api-mutation';

export function useAddCorrectionNoteMutation(controlUuid: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useApiMutation({
    mutationKey: ['addCorrectionNote', controlUuid],
    mutationFn: (correctionNotes: string) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).patch(
        `/medical-controls/${controlUuid}/correction-note`,
        { correctionNotes },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalControl', controlUuid] });
    },
  });

  return { addCorrectionNote: mutateAsync, isPending, error };
}
