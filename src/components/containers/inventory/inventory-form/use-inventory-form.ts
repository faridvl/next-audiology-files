import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@/hooks/use-navigation';
import {
  ProductApiPayload,
  useCreateProductMutation,
} from '@/shared/api/mutations/inventory/inventory-mutation';
import { useCreateProductUnitsBulkMutation } from '@/shared/api/mutations/inventory/product-unit-mutation';
import { FETCH_PRODUCTS_KEY } from '@/shared/api/querys/inventory/inventory-query';

export type SerialRow = {
  id: number;
  serialNumber: string;
  warrantyUntil: string;
};

type FormState = ProductApiPayload & { initialSerials: SerialRow[] };

const buildInitialForm = (): FormState => ({
  sku: '',
  name: '',
  brand: '',
  model: '',
  description: '',
  price: 0,
  stock: { min: 5 },
  cabysCode: '',
  initialSerials: [],
});

export function useInventoryCreate() {
  const { common } = useNavigation();
  const queryClient = useQueryClient();
  const { executeCreateProduct, isPending: isCreatingProduct } = useCreateProductMutation();
  const { executeCreateUnitsBulk, isPending: isCreatingUnits } = useCreateProductUnitsBulkMutation();

  const [form, setForm] = useState<FormState>(buildInitialForm());
  const [nextSerialId, setNextSerialId] = useState(1);

  const handleChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setForm((previous) => ({
        ...previous,
        [parent]: { ...(previous[parent as keyof FormState] as Record<string, unknown>), [child]: value },
      }));
    } else {
      setForm((previous) => ({ ...previous, [field]: value }));
    }
  };

  const addSerial = () => {
    setForm((previous) => ({
      ...previous,
      initialSerials: [
        ...previous.initialSerials,
        { id: nextSerialId, serialNumber: '', warrantyUntil: '' },
      ],
    }));
    setNextSerialId((n) => n + 1);
  };

  const updateSerial = (id: number, field: keyof Omit<SerialRow, 'id'>, value: string) => {
    setForm((previous) => ({
      ...previous,
      initialSerials: previous.initialSerials.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const removeSerial = (id: number) => {
    setForm((previous) => ({
      ...previous,
      initialSerials: previous.initialSerials.filter((row) => row.id !== id),
    }));
  };

  const handleSave = () => {
    const { initialSerials, ...productPayload } = form;

    executeCreateProduct(productPayload, {
      onSuccess: async (createdProduct) => {
        const productUuid = (createdProduct as { uuid: string }).uuid;
        const validSerials = initialSerials.filter((row) => row.serialNumber.trim().length > 0);

        if (validSerials.length > 0 && productUuid) {
          executeCreateUnitsBulk(
            {
              productUuid,
              payload: {
                units: validSerials.map((row) => ({
                  serialNumber: row.serialNumber.trim(),
                  ...(row.warrantyUntil ? { warrantyUntil: row.warrantyUntil } : {}),
                })),
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [FETCH_PRODUCTS_KEY] });
                toast.success('Producto creado con unidades correctamente.');
                common.back();
              },
              onError: () => {
                queryClient.invalidateQueries({ queryKey: [FETCH_PRODUCTS_KEY] });
                toast.warning('Producto creado, pero algunos seriales no pudieron guardarse.');
                common.back();
              },
            },
          );
        } else {
          queryClient.invalidateQueries({ queryKey: [FETCH_PRODUCTS_KEY] });
          toast.success('Producto creado correctamente.');
          common.back();
        }
      },
      onError: () => {
        toast.error('Error al crear el producto. Verifica los datos e intenta nuevamente.');
      },
    });
  };

  const isPending = isCreatingProduct || isCreatingUnits;
  const canSave = form.name.trim().length > 0 && form.sku.trim().length >= 3;

  return {
    form,
    handleChange,
    handleSave,
    addSerial,
    updateSerial,
    removeSerial,
    isPending,
    canSave,
  };
}
