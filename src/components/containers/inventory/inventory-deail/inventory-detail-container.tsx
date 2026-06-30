import React from 'react';
import { Tag, AlignLeft, Edit3, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { useInventoryDetail } from './use-inventory-detail';

interface InventoryDetailContainerProps {
    productId: string;
}

export const InventoryDetailContainer: React.FC<InventoryDetailContainerProps> = ({ productId }) => {
    const { common, inventory } = useNavigation();
    const { product, isLoading, isError } = useInventoryDetail(productId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 opacity-40">
                <Loader2 size={40} className="animate-spin text-primary mb-4" />
                <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Cargando información...</Typography>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="text-center py-20 bg-danger/10 rounded-app-xl border border-danger/20 mx-4">
                <AlertTriangle size={40} className="text-danger mx-auto mb-4" />
                <Typography variant={TypographyVariant.HEADER}>¡Error al cargar!</Typography>
                <Typography variant={TypographyVariant.BODY} className="text-danger mt-2">
                    No pudimos encontrar el artículo solicitado.
                </Typography>
                <Button variant={ButtonVariant.CANCEL} onClick={() => common.back()} className="mt-6">
                    Regresar al Inventario
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pb-20">
            {/* Cabecera de Navegación */}
            <div className="flex justify-between items-center mb-8 px-2">
                <button
                    onClick={() => common.back()}
                    className="flex items-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Volver</Typography>
                </button>
                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={() => inventory.manage(productId)}
                    className="px-6 py-2.5 rounded-app-sm h-auto shadow-lg shadow-primary-dark/10"
                >
                    <Edit3 size={16} className="mr-2" />
                    <span className="text-sm font-medium text-white">Editar Artículo</span>
                </Button>
            </div>

            {/* Ficha de Información */}
            <div className="bg-white border border-neutral-200 rounded-app-xl overflow-hidden shadow-sm">

                {/* Identificación y SKU */}
                <div className="p-8 md:p-10 border-b border-neutral-100 relative">
                    <div className="absolute top-8 right-10">
                        <Typography variant={TypographyVariant.OVERLINE} className="text-primary bg-primary-soft px-3 py-1 rounded-lg font-mono">
                            {product.sku}
                        </Typography>
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-neutral-400">
                        <Tag size={14} />
                        <Typography variant={TypographyVariant.OVERLINE}>Información General</Typography>
                    </div>
                    <Typography variant={TypographyVariant.HEADER} className="text-3xl font-bold text-neutral-900 pr-24 leading-tight">
                        {product.name}
                    </Typography>
                    <Typography variant={TypographyVariant.SUBTITLE} className="text-neutral-500 mt-1 uppercase tracking-wide text-sm font-bold">
                        {product.model || 'Sin Modelo Específico'}
                    </Typography>
                </div>

                {/* Datos de Inventario y Precio */}
                <div className="p-8 md:p-10 grid grid-cols-2 gap-10 bg-neutral-50/30">
                    <div className="space-y-1">
                        <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">Stock Actual en Bodega</Typography>
                        <div className="flex items-baseline gap-2">
                            <Typography variant={TypographyVariant.HEADER} className={product.isLowStock ? 'text-danger' : 'text-neutral-900'}>
                                {product.stock.current}
                            </Typography>
                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-neutral-400 text-xs uppercase">unidades</Typography>
                        </div>
                        {product.isLowStock && (
                            <div className="flex items-center gap-1.5 mt-2">
                                <AlertTriangle size={12} className="text-danger" />
                                <Typography variant={TypographyVariant.CAPTION} className="text-danger font-bold italic">
                                    Bajo el mínimo ({product.stock.min})
                                </Typography>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">Precio de Venta</Typography>
                        <Typography variant={TypographyVariant.HEADER} className="text-primary">
                            {product.displayPrice}
                        </Typography>
                        <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400">
                            IVA No incluido (Basado en CAByS)
                        </Typography>
                    </div>
                </div>

                {/* Descripción y CAByS */}
                <div className="p-8 md:p-10 pt-0">
                    <div className="pt-8 border-t border-neutral-100 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-neutral-400">
                                <AlignLeft size={16} />
                                <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Descripción del Producto</Typography>
                            </div>
                            <Typography variant={TypographyVariant.BODY} className="text-neutral-600 leading-relaxed bg-neutral-50/50 p-6 rounded-app-md border border-neutral-100">
                                {product.displayDescription}
                            </Typography>
                        </div>

                        {product.cabysCode && (
                            <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-app-sm border border-neutral-100">
                                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">Código CAByS</Typography>
                                <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-neutral-600 font-mono">
                                    {product.cabysCode}
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};