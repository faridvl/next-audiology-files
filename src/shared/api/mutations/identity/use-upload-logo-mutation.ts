import { useApiMutation } from '../use-api-mutation';
import { uploadFile } from '../../upload-service-client';
import { env } from '../../config';

export function useUploadLogoMutation(tenantUuid: string) {
  const { mutateAsync, isPending, error } = useApiMutation({
    mutationKey: ['uploadTenantLogo', tenantUuid],
    mutationFn: (file: File) =>
      uploadFile(env.API.IDENTITY_URL, `/upload/tenants/${tenantUuid}/logo`, file),
  });

  return { uploadLogo: mutateAsync, isPending, error };
}
