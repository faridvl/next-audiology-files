export type ProductStock = {
  current: number;
  min: number;
};

export type Product = {
  uuid: string;
  tenantUuid: string;
  sku: string;
  name: string;
  model?: string;
  description?: string;
  price: number;
  stock: ProductStock;
  cabysCode?: string;
  isActive: boolean;
  createdAt: string;
};

export type CreateProductPayload = Omit<Product, 'uuid' | 'tenantUuid' | 'isActive' | 'createdAt'>;
export type UpdateProductPayload = Partial<CreateProductPayload> & { isActive?: boolean };
