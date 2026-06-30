import React from 'react';
import {
  Save,
  Tag,
  Archive,
  Package,
  AlignLeft,
  Hash,
  ShieldCheck,
  Loader2,
  Plus,
  Trash2,
  Barcode,
  Building2,
} from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { useInventoryCreate } from './use-inventory-form';

export const InventoryCreateContainer: React.FC = () => {
  const { common } = useNavigation();
  const { form, handleChange, handleSave, addSerial, updateSerial, removeSerial, isPending, canSave } =
    useInventoryCreate();

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <Typography variant={TypographyVariant.HEADER}>Nuevo Artículo</Typography>
          <Typography variant={TypographyVariant.HELPER}>Registro de suministros y equipos médicos</Typography>
        </div>
        <Package size={32} className="text-neutral-200" />
      </div>

      <div className="bg-white p-8 md:p-12 rounded-app-xl border border-neutral-100 shadow-sm space-y-10">
        {/* Sección: Identificación y Códigos */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={18} className="text-primary" />
            <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Identificación</Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-neutral-400">
                Nombre del Artículo
              </Typography>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ej: Audífono BTE"
                className="w-full bg-neutral-50 border border-neutral-100 p-4 rounded-app-md text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-1">
                <Building2 size={12} className="text-neutral-400" />
                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">
                  Marca
                </Typography>
              </div>
              <input
                type="text"
                value={form.brand ?? ''}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="Ej: Phonak, Signia, Oticon"
                className="w-full bg-neutral-50 border border-neutral-100 p-4 rounded-app-md text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-neutral-400">
                Modelo / Especificación
              </Typography>
              <input
                type="text"
                value={form.model ?? ''}
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="Ej: Audéo L-R (Plata)"
                className="w-full bg-neutral-50 border border-neutral-100 p-4 rounded-app-md text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-1">
                <Hash size={12} className="text-neutral-400" />
                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">
                  Código Interno (SKU)
                </Typography>
              </div>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                placeholder="Ej: AUD-001"
                className="w-full bg-neutral-50 border border-neutral-100 p-4 rounded-app-md text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2 opacity-60 italic">
              <div className="flex items-center gap-2 ml-1 text-neutral-300">
                <ShieldCheck size={12} />
                <Typography variant={TypographyVariant.OVERLINE}>Código CAByS (Opcional)</Typography>
              </div>
              <input
                type="text"
                value={form.cabysCode ?? ''}
                onChange={(e) => handleChange('cabysCode', e.target.value)}
                placeholder="Para uso futuro..."
                className="w-full bg-neutral-50 border border-neutral-100 p-4 rounded-app-md text-sm focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 ml-1 mb-1 text-neutral-400">
              <AlignLeft size={14} />
              <Typography variant={TypographyVariant.OVERLINE}>Descripción / Notas</Typography>
            </div>
            <textarea
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Notas adicionales..."
              className="w-full bg-neutral-50 border border-neutral-100 p-4 rounded-app-md text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none resize-none"
            />
          </div>
        </section>

        {/* Sección: Inventario y Costos */}
        <section className="space-y-6 pt-8 border-t border-neutral-50">
          <div className="flex items-center gap-2 mb-2">
            <Archive size={18} className="text-primary" />
            <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Inventario y Costos</Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-neutral-400">
                Precio (₡)
              </Typography>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-sm">₡</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-neutral-50 border border-neutral-100 p-4 pl-10 rounded-app-sm text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-neutral-400">
                Stock Mínimo de Alerta
              </Typography>
              <input
                type="number"
                value={form.stock.min}
                onChange={(e) => handleChange('stock.min', Number(e.target.value))}
                placeholder="5"
                className="w-full bg-neutral-50 border border-neutral-100 p-4 rounded-app-sm text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Sección: Unidades iniciales (seriales) */}
        <section className="space-y-5 pt-8 border-t border-neutral-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Barcode size={18} className="text-primary" />
              <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Unidades Iniciales</Typography>
            </div>
            <button
              type="button"
              onClick={addSerial}
              className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              <Plus size={15} />
              <span>Agregar unidad</span>
            </button>
          </div>

          <Typography variant={TypographyVariant.HELPER} className="text-neutral-400 -mt-2">
            Opcional. Registra los números de serie de las unidades que ingresan con este artículo.
          </Typography>

          {form.initialSerials.length === 0 ? (
            <div className="border border-dashed border-neutral-200 rounded-app-md p-6 text-center">
              <Typography variant={TypographyVariant.HELPER} className="text-neutral-300">
                Sin unidades registradas. Puedes agregarlas después desde el detalle del artículo.
              </Typography>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header de tabla */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-3 px-1">
                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">
                  Número de Serie
                </Typography>
                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">
                  Garantía Hasta
                </Typography>
                <span />
              </div>

              {form.initialSerials.map((row) => (
                <div key={row.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
                  <input
                    type="text"
                    value={row.serialNumber}
                    onChange={(e) => updateSerial(row.id, 'serialNumber', e.target.value)}
                    placeholder="Ej: SN-123456"
                    className="bg-neutral-50 border border-neutral-100 p-3 rounded-app-sm text-sm font-mono focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none"
                  />
                  <input
                    type="date"
                    value={row.warrantyUntil}
                    onChange={(e) => updateSerial(row.id, 'warrantyUntil', e.target.value)}
                    className="bg-neutral-50 border border-neutral-100 p-3 rounded-app-sm text-sm focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeSerial(row.id)}
                    className="p-2 text-neutral-300 hover:text-red-400 transition-colors rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Acciones */}
      <div className="flex justify-between items-center mt-8 px-4">
        <Button
          variant={ButtonVariant.CANCEL}
          onClick={() => common.back()}
          className="px-8 border-none bg-transparent hover:bg-neutral-100"
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={handleSave}
          disabled={!canSave || isPending}
          className="px-12 py-4 shadow-xl shadow-primary-dark/10 min-w-[200px]"
        >
          {isPending ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          <Typography variant={TypographyVariant.BUTTON_TEXT}>
            {isPending ? 'Guardando...' : 'Guardar Artículo'}
          </Typography>
        </Button>
      </div>
    </div>
  );
};
