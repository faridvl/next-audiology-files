import { useState, useMemo } from 'react';
import { useNavigation } from '@/hooks/use-navigation';
import { useProductsQuery } from '@/shared/api/querys/inventory/inventory-query';

export const useInventory = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Llamada a la API
  const { data: productsData = [], isLoading, isError } = useProductsQuery();

  // 2. Transformamos y filtramos la data
  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    // Mapeamos de 'Product' (API) a 'InventoryItem' (UI)
    return productsData
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.sku.toLowerCase().includes(lowerSearch) ||
          p.model?.toLowerCase().includes(lowerSearch),
      )
      .map((p) => ({
        id: p.sku, // Usamos SKU como ID visual
        uuid: p.uuid, // Guardamos el UUID para las navegaciones
        brand: p.name,
        model: p.model || 'N/A',
        stock: p.stock.current,
        minStock: p.stock.min, // Lo necesitamos para el badge de alerta
        price: new Intl.NumberFormat('es-CR', {
          style: 'currency',
          currency: 'CRC',
        }).format(p.price),
      }));
  }, [searchTerm, productsData]);

  const lowStockCount = useMemo(
    () => productsData.filter((p) => p.stock.current < p.stock.min).length,
    [productsData],
  );

  return {
    states: {
      searchTerm,
      products: filteredProducts,
      lowStockCount,
      isLoading,
      isError,
    },
    setters: {
      setSearchTerm,
    },
    methods: {
      navigateToCreate: () => navigation.inventory.create(),
      // Usamos item.uuid para las rutas internas de la API
      navigateToDetail: (uuid: string) => navigation.inventory.detail(uuid),
      navigateToManage: (uuid: string) => navigation.inventory.manage(uuid),
    },
  };
};
