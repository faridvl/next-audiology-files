import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '../use-api-mutation';
import { CreateMaintenancePayload, MaintenanceEntity } from '@/types/maintenance/maintenance.types';

export function useCreateMaintenanceMutation() {
  const { mutate: executeCreateMaintenance, isPending, isSuccess, error, reset } = useApiMutation({
    mutationKey: ['createMaintenance'],
    mutationFn: (payload: CreateMaintenancePayload) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).post<MaintenanceEntity>('/maintenance', payload),
  });

  return { executeCreateMaintenance, isPending, isSuccess, error: !!error, reset };
}
