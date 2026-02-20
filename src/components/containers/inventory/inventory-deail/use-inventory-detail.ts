import { useMemo } from 'react';
import { useProductDetailQuery } from '@/shared/api/querys/inventory/get-product-query';

export function useInventoryDetail(productId: string) {
  const { data: product, isLoading, isError } = useProductDetailQuery(productId);

  const formattedProduct = useMemo(() => {
    if (!product) return null;

    return {
      ...product,
      displayPrice: new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
      }).format(product.price),
      isLowStock: product.stock.current < product.stock.min,
      displayDescription: product.description || 'Sin descripción adicional registrada.',
    };
  }, [product]);

  return {
    product: formattedProduct,
    isLoading,
    isError,
  };
}
