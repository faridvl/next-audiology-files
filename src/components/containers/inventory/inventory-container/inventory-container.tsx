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
        className="bg-white p-6 rounded-[2.5rem] border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 cursor-pointer group relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-neutral-50 rounded-app-md text-neutral-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Package size={22} />
            </div>
            <div className="flex gap-2">
                {/* Ahora la alerta es dinámica según el minStock de la BD */}
                {stock <= minStock && (
                    <div className="flex items-center gap-1.5 bg-danger/10 text-danger px-3 py-1.5 rounded-xl border border-danger/10 animate-pulse">
                        <AlertCircle size={12} />
                        <Typography variant={TypographyVariant.OVERLINE} textColor="text-danger" className="italic font-bold">Stock Bajo</Typography>
                    </div>
                )}
                <button
                    onClick={onManage}
                    className="p-2.5 bg-neutral-50 text-neutral-400 hover:bg-primary-soft hover:text-primary rounded-xl transition-all"
                >
                    <Settings2 size={16} />
                </button>
            </div>
        </div>

        <div className="space-y-1">
            <Typography variant={TypographyVariant.OVERLINE} textColor="text-secondary" className="mb-1">{id}</Typography>
            <Typography variant={TypographyVariant.ACCENT} className="group-hover:text-[#1E3A8A] transition-colors uppercase truncate">
                {brand}
            </Typography>
            <Typography variant={TypographyVariant.HELPER} className="uppercase font-bold tracking-wider truncate opacity-60">
                {model}
            </Typography>
        </div>

        <div className="flex justify-between items-end border-t border-neutral-50 mt-6 pt-5">
            <div>
                <Typography variant={TypographyVariant.OVERLINE} className="mb-1">Existencia</Typography>
                <div className="flex items-baseline gap-1">
                    <Typography variant={TypographyVariant.SUBTITLE} textColor={stock <= minStock ? "text-danger" : "text-neutral-700"}>
                        {stock}
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION}>uds</Typography>
                </div>
            </div>
            <Typography variant={TypographyVariant.HEADER} textColor="text-primary" className="tracking-tighter text-lg">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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