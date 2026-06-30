import { useApiMutation } from '../use-api-mutation';
import { uploadFile } from '../../upload-service-client';
import { env } from '../../config';

export function useUploadAvatarMutation(userUuid: string) {
  const { mutateAsync, isPending, error } = useApiMutation({
    mutationKey: ['uploadUserAvatar', userUuid],
    mutationFn: (file: File) =>
      uploadFile(env.API.IDENTITY_URL, `/upload/users/${userUuid}/avatar`, file),
  });

  return { uploadAvatar: mutateAsync, isPending, error };
}
