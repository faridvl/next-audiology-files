import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { AppointmentType } from '@/shared/api/querys/appointment-types-query';
import { useApiMutation } from '../use-api-mutation';

export type CreateAppointmentTypePayload = {
  name: string;
  duration?: number | null;
  color?: string | null;
};

const BASE_URL = env.API.MEDICAL_RECORDS_URL;

export function useCreateAppointmentTypeMutation() {
  const { mutate, isPending, isSuccess, error, reset } = useApiMutation({
    mutationKey: ['createAppointmentType'],
    mutationFn: (payload: CreateAppointmentTypePayload) =>
      ApiServiceClient(BASE_URL).post<AppointmentType>('/appointment-types', payload),
  });

  return {
    executeCreate: mutate,
    isPending,
    isSuccess,
    error: !!error,
    reset,
  };
}
