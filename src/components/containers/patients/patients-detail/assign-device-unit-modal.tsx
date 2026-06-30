import React, { useState } from 'react';
import { X, Search, CheckCircle, ChevronRight, Headphones, Barcode, ArrowLeft } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useProductsQuery } from '@/shared/api/querys/inventory/inventory-query';
import { useProductUnitsQuery } from '@/shared/api/querys/inventory/product-units-query';
import { useCreatePatientDeviceMutation } from '@/shared/api/mutations/patients/create-patient-device-mutation';
import { ProductUnitStatus } from '@/types/inventory/product.types';
import { DeviceSide } from '@/types/patients/patient-device.types';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

interface Props {
  patientUuid: string;
  onClose: () => void;
  onSuccess: () => void;
}

enum AssignStep {
  SELECT_PRODUCT = 'SELECT_PRODUCT',
  SELECT_UNIT = 'SELECT_UNIT',
  SELECT_SIDE = 'SELECT_SIDE',
}

const SIDE_LABELS: Record<DeviceSide, string> = {
  OD: 'Oído Derecho',
  OI: 'Oído Izquierdo',
  AMBOS: 'Ambos Oídos',
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const AssignDeviceUnitModal: React.FC<Props> = ({ patientUuid, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery(false);
  const { executeCreateDevice, isPending } = useCreatePatientDeviceMutation(patientUuid);

  const [step, setStep] = useState<AssignStep>(AssignStep.SELECT_PRODUCT);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductUuid, setSelectedProductUuid] = useState<string | null>(null);
  const [selectedUnitUuid, setSelectedUnitUuid] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<DeviceSide>('OD');

  const { data: units = [], isLoading: isLoadingUnits } = useProductUnitsQuery(
    selectedProductUuid ?? '',
    ProductUnitStatus.AVAILABLE,
  );

  const selectedProduct = products.find((p) => p.uuid === selectedProductUuid);
  const selectedUnit = units.find((u) => u.uuid === selectedUnitUuid);

  const lowerSearch = searchTerm.toLowerCase();
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerSearch) ||
      (p.sku ?? '').toLowerCase().includes(lowerSearch) ||
      (p.brand ?? '').toLowerCase().includes(lowerSearch) ||
      (p.model ?? '').toLowerCase().includes(lowerSearch),
  );

  const handleSelectProduct = (productUuid: string) => {
    setSelectedProductUuid(productUuid);
    setSelectedUnitUuid(null);
    setStep(AssignStep.SELECT_UNIT);
  };

  const handleSelectUnit = (unitUuid: string) => {
    setSelectedUnitUuid(unitUuid);
    setStep(AssignStep.SELECT_SIDE);
  };

  const handleConfirm = () => {
    if (!selectedUnit || !selectedProduct) return;

    executeCreateDevice(
      {
        side: selectedSide,
        productUnitUuid: selectedUnit.uuid,
        brand: selectedProduct.brand ?? selectedProduct.name,
        model: selectedProduct.model ?? undefined,
        serialNumber: selectedUnit.serialNumber,
        warrantyUntil: selectedUnit.warrantyUntil ?? undefined,
      },
      {
        onSuccess: () => {
          toast.success('Audífono asignado correctamente.');
          queryClient.invalidateQueries({ queryKey: ['fetchPatientDevices', patientUuid] });
          onSuccess();
          onClose();
        },
        onError: () => {
          toast.error('Error al asignar el audífono. Intenta nuevamente.');
        },
      },
    );
  };

  const stepTitles: Record<AssignStep, string> = {
    [AssignStep.SELECT_PRODUCT]: 'Seleccionar Artículo',
    [AssignStep.SELECT_UNIT]: 'Seleccionar Unidad',
    [AssignStep.SELECT_SIDE]: 'Confirmar Asignación',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/30 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-app-xl shadow-2xl p-8 animate-in zoom-in-95 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {step !== AssignStep.SELECT_PRODUCT && (
              <button
                onClick={() => setStep(step === AssignStep.SELECT_SIDE ? AssignStep.SELECT_UNIT : AssignStep.SELECT_PRODUCT)}
                className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-700"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="p-2 bg-primary-soft rounded-xl">
              <Headphones size={18} className="text-primary" />
            </div>
            <div>
              <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-xs uppercase tracking-widest text-neutral-900 font-black">
                {stepTitles[step]}
              </Typography>
              {/* Indicador de paso */}
              <div className="flex items-center gap-1 mt-1">
                {[AssignStep.SELECT_PRODUCT, AssignStep.SELECT_UNIT, AssignStep.SELECT_SIDE].map((s, index) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all ${
                      s === step ? 'w-4 bg-primary' : index < Object.values(AssignStep).indexOf(step) ? 'w-2 bg-primary/40' : 'w-2 bg-neutral-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Paso 1: Seleccionar producto */}
        {step === AssignStep.SELECT_PRODUCT && (
          <>
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, marca o SKU..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {isLoadingProducts ? (
                <div className="py-8 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Cargando inventario...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest">
                  Sin resultados
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.uuid}
                    onClick={() => handleSelectProduct(product.uuid)}
                    className="w-full flex items-center gap-4 p-4 rounded-app-md border border-neutral-100 hover:border-primary/30 hover:bg-primary-soft/30 bg-white transition-all text-left group"
                  >
                    <div className="flex-1 min-w-0">
                      <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm text-neutral-900 truncate">
                        {product.name}
                      </Typography>
                      <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 uppercase tracking-wide font-bold">
                        {product.brand ? `${product.brand} · ` : ''}{product.sku}{product.model ? ` · ${product.model}` : ''}
                      </Typography>
                    </div>
                    <ChevronRight size={16} className="text-neutral-300 group-hover:text-primary transition-colors shrink-0" />
                  </button>
                ))
              )}
            </div>
          </>
        )}

        {/* Paso 2: Seleccionar unidad */}
        {step === AssignStep.SELECT_UNIT && selectedProduct && (
          <>
            <div className="p-3 bg-primary-soft/40 rounded-app-md flex items-center gap-2">
              <Headphones size={14} className="text-primary" />
              <Typography variant={TypographyVariant.CAPTION} className="text-primary font-bold">
                {selectedProduct.name}{selectedProduct.brand ? ` · ${selectedProduct.brand}` : ''}
              </Typography>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {isLoadingUnits ? (
                <div className="py-8 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Cargando unidades disponibles...
                </div>
              ) : units.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <Barcode size={24} className="text-neutral-200 mx-auto" />
                  <Typography variant={TypographyVariant.HELPER} className="text-neutral-400">
                    No hay unidades disponibles para este artículo.
                  </Typography>
                </div>
              ) : (
                units.map((unit) => {
                  const isSelected = selectedUnitUuid === unit.uuid;
                  return (
                    <button
                      key={unit.uuid}
                      onClick={() => handleSelectUnit(unit.uuid)}
                      className={`w-full flex items-center gap-4 p-4 rounded-app-md border transition-all text-left ${
                        isSelected
                          ? 'border-primary/30 bg-primary-soft'
                          : 'border-neutral-100 hover:border-neutral-200 bg-white'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="font-mono text-sm text-neutral-800">
                          {unit.serialNumber}
                        </Typography>
                        {unit.warrantyUntil && (
                          <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400">
                            Garantía hasta {formatDate(unit.warrantyUntil)}
                          </Typography>
                        )}
                      </div>
                      {isSelected && <CheckCircle size={18} className="text-primary shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Paso 3: Seleccionar oído y confirmar */}
        {step === AssignStep.SELECT_SIDE && selectedProduct && selectedUnit && (
          <>
            {/* Resumen */}
            <div className="p-4 bg-neutral-50 rounded-app-md space-y-2 border border-neutral-100">
              <div className="flex justify-between">
                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">Artículo</Typography>
                <Typography variant={TypographyVariant.CAPTION} className="font-bold text-neutral-700">
                  {selectedProduct.name}
                </Typography>
              </div>
              {selectedProduct.brand && (
                <div className="flex justify-between">
                  <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">Marca</Typography>
                  <Typography variant={TypographyVariant.CAPTION} className="font-bold text-neutral-700">
                    {selectedProduct.brand}
                  </Typography>
                </div>
              )}
              <div className="flex justify-between">
                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">N.° de Serie</Typography>
                <Typography variant={TypographyVariant.CAPTION} className="font-mono font-bold text-neutral-700">
                  {selectedUnit.serialNumber}
                </Typography>
              </div>
              {selectedUnit.warrantyUntil && (
                <div className="flex justify-between">
                  <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">Garantía</Typography>
                  <Typography variant={TypographyVariant.CAPTION} className="font-bold text-neutral-700">
                    {formatDate(selectedUnit.warrantyUntil)}
                  </Typography>
                </div>
              )}
            </div>

            {/* Selector de oído */}
            <div className="space-y-2">
              <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400 ml-1">
                Oído de Asignación
              </Typography>
              <div className="grid grid-cols-3 gap-2">
                {(['OD', 'OI', 'AMBOS'] as DeviceSide[]).map((side) => (
                  <button
                    key={side}
                    onClick={() => setSelectedSide(side)}
                    className={`py-3 rounded-app-sm font-black text-[10px] uppercase tracking-widest transition-all ${
                      selectedSide === side
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-white text-neutral-500 border border-neutral-200 hover:border-primary/30'
                    }`}
                  >
                    {SIDE_LABELS[side]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-neutral-200 text-xs font-black uppercase tracking-widest text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Guardando...' : 'Confirmar Asignación'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
