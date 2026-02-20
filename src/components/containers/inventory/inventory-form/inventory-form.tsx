import React from 'react';
import { Save, Tag, Archive, Package, AlignLeft, Hash, ShieldCheck, Loader2 } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { useInventoryCreate } from './use-inventory-form';

export const InventoryCreateContainer: React.FC = () => {
    const { common } = useNavigation();
    const { form, handleChange, handleSave, isPending, canSave } = useInventoryCreate();

    return (
        <div className="max-w-3xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <Typography variant={TypographyVariant.HEADER}>Nuevo Artículo</Typography>
                    <Typography variant={TypographyVariant.HELPER}>Registro de suministros y equipos médicos</Typography>
                </div>
                <Package size={32} className="text-slate-200" />
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
                {/* Sección: Identificación y Códigos */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Tag size={18} className="text-[#1E3A8A]" />
                        <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Identificación</Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400">Nombre del Artículo</Typography>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Ej: Audífono Phonak"
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400">Modelo / Especificación</Typography>
                            <input
                                type="text"
                                value={form.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                placeholder="Ej: Audéo L-R (Plata)"
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 ml-1">
                                <Hash size={12} className="text-slate-400" />
                                <Typography variant={TypographyVariant.OVERLINE} className="text-slate-400">Código Interno (SKU)</Typography>
                            </div>
                            <input
                                type="text"
                                value={form.sku}
                                onChange={(e) => handleChange('sku', e.target.value)}
                                placeholder="Ej: AUD-001"
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2 opacity-60 italic">
                            <div className="flex items-center gap-2 ml-1 text-slate-300">
                                <ShieldCheck size={12} />
                                <Typography variant={TypographyVariant.OVERLINE}>Código CAByS (Opcional)</Typography>
                            </div>
                            <input
                                type="text"
                                value={form.cabysCode}
                                onChange={(e) => handleChange('cabysCode', e.target.value)}
                                placeholder="Para uso futuro..."
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 ml-1 mb-1 text-slate-400">
                            <AlignLeft size={14} />
                            <Typography variant={TypographyVariant.OVERLINE}>Descripción / Notas</Typography>
                        </div>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Notas adicionales..."
                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none resize-none"
                        />
                    </div>
                </section>

                {/* Sección: Inventario y Costos */}
                <section className="space-y-6 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                        <Archive size={18} className="text-[#1E3A8A]" />
                        <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Inventario y Costos</Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-2">
                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400">Cantidad Inicial</Typography>
                            <input
                                type="number"
                                value={form.stock.current}
                                onChange={(e) => handleChange('stock.current', Number(e.target.value))}
                                placeholder="0"
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400">Precio (₡)</Typography>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₡</span>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => handleChange('price', Number(e.target.value))}
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 border border-slate-100 p-4 pl-10 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400">Stock Mínimo</Typography>
                            <input
                                type="number"
                                value={form.stock.min}
                                onChange={(e) => handleChange('stock.min', Number(e.target.value))}
                                placeholder="5"
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none"
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Acciones */}
            <div className="flex justify-between items-center mt-8 px-4">
                <Button
                    variant={ButtonVariant.CANCEL}
                    onClick={() => common.back()}
                    className="px-8 border-none bg-transparent hover:bg-slate-100"
                    disabled={isPending}
                >
                    Cancelar
                </Button>
                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={handleSave}
                    disabled={!canSave || isPending}
                    className="px-12 py-4 shadow-xl shadow-blue-900/10 min-w-[200px]"
                >
                    {isPending ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                    <Typography variant={TypographyVariant.BUTTON_TEXT}>
                        {isPending ? 'Guardando...' : 'Guardar Artículo'}
                    </Typography>
                </Button>
            </div>
        </div>
    );
};