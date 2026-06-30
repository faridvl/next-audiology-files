import React from 'react';
import { Package, AlertCircle, Plus, Search, Settings2, Loader2 } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useInventory } from './use-inventory-container';

// Actualizamos la interfaz del Card para que coincida con la data mapeada
interface ProductCardProps {
    id: string;
    uuid: string;
    brand: string;
    model: string;
    stock: number;
    minStock: number;
    price: string;
    onDetail: () => void;
    onManage: (e: React.MouseEvent) => void;
}

const ProductCard = ({ brand, model, stock, minStock, price, id, onDetail, onManage }: ProductCardProps) => (
    <div
        onClick={onDetail}
        className="bg-white p-4 rounded-app-md border border-neutral-100 shadow-sm hover:shadow-md hover:border-neutral-200 transition-all duration-200 cursor-pointer group"
    >
        <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-neutral-50 rounded-lg text-neutral-400 group-hover:bg-neutral-100 transition-colors">
                <Package size={16} />
            </div>
            <div className="flex gap-1.5 items-center">
                {stock <= minStock && (
                    <div className="flex items-center gap-1 bg-danger/8 text-danger px-2 py-1 rounded-md border border-danger/15">
                        <AlertCircle size={10} />
                        <Typography variant={TypographyVariant.OVERLINE} textColor="text-danger" className="font-semibold text-[10px]">Stock bajo</Typography>
                    </div>
                )}
                <button
                    onClick={onManage}
                    className="p-1.5 text-neutral-300 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-all"
                >
                    <Settings2 size={14} />
                </button>
            </div>
        </div>

        <div className="space-y-0.5 mb-3">
            <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-300 text-[10px]">{id}</Typography>
            <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-800 uppercase truncate text-sm leading-tight">
                {brand}
            </Typography>
            <Typography variant={TypographyVariant.HELPER} className="text-neutral-400 uppercase truncate text-xs tracking-wide">
                {model}
            </Typography>
        </div>

        <div className="flex justify-between items-end border-t border-neutral-50 pt-3">
            <div>
                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-300 text-[10px] mb-0.5">Existencia</Typography>
                <div className="flex items-baseline gap-0.5">
                    <Typography variant={TypographyVariant.BODY_BOLD} textColor={stock <= minStock ? "text-danger" : "text-neutral-700"} className="text-sm font-bold">
                        {stock}
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 text-[10px]">uds</Typography>
                </div>
            </div>
            <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-700 font-semibold text-sm">
                {price}
            </Typography>
        </div>
    </div>
);

export const InventoryContainer: React.FC = () => {
    const { states, setters, methods } = useInventory();
    const { products, lowStockCount, searchTerm, isLoading } = states;

    return (
        <div className="space-y-6 md:space-y-10 p-2">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <Typography variant={TypographyVariant.HEADER}>Stock de Productos</Typography>
                        <Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">
                            {isLoading ? 'Cargando inventario...' :
                                lowStockCount > 0 ? `Tienes ${lowStockCount} artículos con stock crítico` :
                                    'Todos tus artículos están en niveles óptimos'}
                        </Typography>
                    </div>
                    <Button variant={ButtonVariant.PRIMARY} onClick={methods.navigateToCreate} className="py-3 px-4 md:px-8 rounded-app-md shrink-0">
                        <Plus size={20} className="mr-0 md:mr-2" />
                        <span className="hidden md:inline"><Typography variant={TypographyVariant.BUTTON_TEXT}>Nuevo Artículo</Typography></span>
                    </Button>
                </div>

                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por código o nombre..."
                        value={searchTerm}
                        onChange={(e) => setters.setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-100 py-3.5 pl-12 pr-6 rounded-app-md text-sm font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Loader2 size={40} className="animate-spin text-primary mb-4" />
                    <Typography variant={TypographyVariant.OVERLINE}>Sincronizando bodega...</Typography>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((item) => (
                        <ProductCard
                            key={item.uuid}
                            {...item}
                            onDetail={() => methods.navigateToDetail(item.uuid)}
                            onManage={(e) => {
                                e.stopPropagation();
                                methods.navigateToManage(item.uuid);
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-neutral-50 rounded-[3rem] p-20 text-center border border-dashed border-neutral-200">
                    <Typography variant={TypographyVariant.OVERLINE}>
                        {searchTerm ? `No se encontraron resultados para "${searchTerm}"` : 'No hay productos registrados'}
                    </Typography>
                </div>
            )}
        </div>
    );
};