import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '../use-api-mutation';

export type UpdateTenantPayload = {
  uuid: string;
  businessName?: string;
  businessType?: string;
  logoUrl?: string | null;
};

export type UpdateTenantResponse = {
  uuid: string;
  businessName: string;
  businessType: string;
  plan: string;
};

const IDENTITY_URL = env.API.IDENTITY_URL;

export function useUpdateTenantMutation() {
  const {
    mutate: executeUpdateTenant,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['updateTenant'],
    mutationFn: ({ uuid, ...payload }: UpdateTenantPayload) =>
      ApiServiceClient(IDENTITY_URL).patch<UpdateTenantResponse>(`/tenants/${uuid}`, payload),
  });

  return {
    executeUpdateTenant,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
