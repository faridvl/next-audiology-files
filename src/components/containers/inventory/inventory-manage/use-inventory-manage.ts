import { useEffect, useState } from 'react';
import { useNavigation } from '@/hooks/use-navigation';
import { useProductDetailQuery } from '@/shared/api/querys/inventory/get-product-query';
import { useUpdateProductMutation } from '@/shared/api/mutations/inventory/inventory-mutation';

export function useInventoryManage(productId: string) {
  const { common } = useNavigation();
  const { data: product, isLoading } = useProductDetailQuery(productId);
  const { executeUpdateProduct, isPending } = useUpdateProductMutation();

  const [form, setForm] = useState({
    name: '',
    model: '',
    description: '',
    price: 0,
    stock: {
      current: 0,
      min: 0,
    },
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        model: product.model || '',
        description: product.description || '',
        price: product.price,
        stock: {
          current: product.stock.current,
          min: product.stock.min,
        },
      });
    }
  }, [product]);

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setForm((prev) => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof typeof form] as any), [child]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleUpdate = () => {
    executeUpdateProduct(
      { uuid: productId, payload: form },
      {
        onSuccess: () => common.back(),
      },
    );
  };

  return {
    form,
    isLoading,
    isPending,
    handleChange,
    handleUpdate,
  };
}
