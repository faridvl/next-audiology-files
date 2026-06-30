import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { ProductUnit, ProductUnitStatus } from '@/types/inventory/product.types';

const ProductUnitService = {
  fetchByProduct: async (productUuid: string, status?: ProductUnitStatus): Promise<ProductUnit[]> => {
    const params = status ? `?status=${status}` : '';
    return ApiServiceClient(env.API.MEDICAL_RECORDS_URL).get<ProductUnit[]>(
      `/products/${productUuid}/units${params}`,
    ) as Promise<ProductUnit[]>;
  },
};

export const FETCH_PRODUCT_UNITS_KEY = 'fetchProductUnits';

export function useProductUnitsQuery(productUuid: string, status?: ProductUnitStatus) {
  return useQuery({
    queryKey: [FETCH_PRODUCT_UNITS_KEY, productUuid, status],
    queryFn: () => ProductUnitService.fetchByProduct(productUuid, status),
    enabled: !!productUuid,
  });
}
