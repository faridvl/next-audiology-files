import { useState } from 'react';

import { useNavigation } from '@/hooks/use-navigation';
import {
  ProductApiPayload,
  useCreateProductMutation,
} from '@/shared/api/mutations/inventory/inventory-mutation';

export function useInventoryCreate() {
  const { common } = useNavigation();
  const { executeCreateProduct, isPending, isSuccess } = useCreateProductMutation();

  const [form, setForm] = useState<ProductApiPayload>({
    sku: '',
    name: '',
    model: '',
    description: '',
    price: 0,
    stock: {
      current: 0,
      min: 5,
    },
    cabysCode: '',
  });

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setForm((prev) => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof ProductApiPayload] as any), [child]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    executeCreateProduct(form, {
      onSuccess: () => {
        common.back();
      },
    });
  };

  return {
    form,
    handleChange,
    handleSave,
    isPending,
    isSuccess,
    canSave: form.name.length > 0 && form.sku.length > 0,
  };
}
