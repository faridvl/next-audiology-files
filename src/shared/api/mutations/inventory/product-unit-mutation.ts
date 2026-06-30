import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useApiMutation } from '../use-api-mutation';
import {
  CreateProductUnitsBulkPayload,
  ProductUnit,
  UpdateProductUnitPayload,
} from '@/types/inventory/product.types';

export function useCreateProductUnitsBulkMutation() {
  const { mutate: executeCreateUnitsBulk, isPending, isSuccess, error, reset } = useApiMutation({
    mutationKey: ['createProductUnitsBulk'],
    mutationFn: ({
      productUuid,
      payload,
    }: {
      productUuid: string;
      payload: CreateProductUnitsBulkPayload;
    }) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).post<ProductUnit[]>(
        `/products/${productUuid}/units/bulk`,
        payload,
      ),
  });

  return { executeCreateUnitsBulk, isPending, isSuccess, error: !!error, reset };
}

export function useUpdateProductUnitMutation() {
  const { mutate: executeUpdateUnit, isPending, isSuccess, error, reset } = useApiMutation({
    mutationKey: ['updateProductUnit'],
    mutationFn: ({
      unitUuid,
      payload,
    }: {
      unitUuid: string;
      payload: UpdateProductUnitPayload;
    }) =>
      ApiServiceClient(env.API.MEDICAL_RECORDS_URL).patch<ProductUnit>(
        `/product-units/${unitUuid}`,
        payload,
      ),
  });

  return { executeUpdateUnit, isPending, isSuccess, error: !!error, reset };
}
