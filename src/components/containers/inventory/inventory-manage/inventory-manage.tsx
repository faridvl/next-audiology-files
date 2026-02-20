import React from 'react';
import { Save, Tag, Archive, AlignLeft, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { useInventoryManage } from './use-inventory-manage';

interface InventoryManageContainerProps {
    productId: string;
}

export const InventoryManageContainer: React.FC<InventoryManageContainerProps> = ({ productId }) => {
    const { common } = useNavigation();
    const { form, isLoading, isPending, handleChange, handleUpdate } = useInventoryManage(productId);

    if (isLoading) {
        return (
            <div className="flex justify-center py-32">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pb-20">
            {/* Cabecera de Edición */}
            <div className="flex justify-between items-center mb-8 px-2">
                <button
                    onClick={() => common.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Cancelar</Typography>
                </button>

                <button className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors opacity-50 cursor-not-allowed">
                    <Trash2 size={18} />
                    <Typography variant={TypographyVariant.CAPTION} className="font-bold">Eliminar Artículo</Typography>
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                {/* 1. Identificación */}
                <div className="p-8 md:p-10 border-b border-slate-100 space-y-6">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Tag size={16} />
                        <Typography variant={TypographyVariant.OVERLINE}>Editando Identificación</Typography>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400">Nombre del Artículo</Typography>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400">Modelo / Especificación</Typography>
                            <input
                                type="text"
                                value={form.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium text-slate-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Inventario y Precio */}
                <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-100 bg-slate-50/30">
                    <div className="space-y-2">
                        <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400">Stock Actual</Typography>
                        <input
                            type="number"
                            value={form.stock.current}
                            onChange={(e) => handleChange('stock.current', Number(e.target.value))}
                            className="w-full bg-white border border-slate-100 p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400">Precio (₡)</Typography>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₡</span>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) => handleChange('price', Number(e.target.value))}
                                className="w-full bg-white border border-slate-100 p-4 pl-10 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400">Stock Mínimo</Typography>
                        <input
                            type="number"
                            value={form.stock.min}
                            onChange={(e) => handleChange('stock.min', Number(e.target.value))}
                            className="w-full bg-white border border-slate-100 p-4 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 outline-none"
                        />
                    </div>
                </div>

                {/* 3. Descripción */}
                <div className="p-8 md:p-10 space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <AlignLeft size={16} />
                        <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Descripción</Typography>
                    </div>
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-medium text-slate-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none resize-none"
                    />
                </div>
            </div>

            {/* Acción Final */}
            <div className="mt-10">
                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={handleUpdate}
                    disabled={isPending}
                    className="w-full py-5 rounded-2xl shadow-xl shadow-blue-900/10"
                >
                    {isPending ? <Loader2 className="animate-spin mr-2" /> : <Save size={20} />}
                    <Typography variant={TypographyVariant.BUTTON_TEXT}>
                        {isPending ? 'Guardando Cambios...' : 'Guardar Cambios'}
                    </Typography>
                </Button>
            </div>
        </div>
    );
};