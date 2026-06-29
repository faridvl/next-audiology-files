import { useApiMutation } from '../use-api-mutation';
import { uploadFile } from '../../upload-service-client';
import { env } from '../../config';

export function useUploadSignatureMutation(userUuid: string) {
  const { mutateAsync, isPending, error } = useApiMutation({
    mutationKey: ['uploadUserSignature', userUuid],
    mutationFn: (file: File) =>
      uploadFile(env.API.IDENTITY_URL, `/upload/users/${userUuid}/signature`, file),
  });

  return { uploadSignature: mutateAsync, isPending, error };
}
