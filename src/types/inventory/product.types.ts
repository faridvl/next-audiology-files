export type ProductStock = {
  current: number;
  min: number;
};

export enum ProductUnitStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  DAMAGED = 'DAMAGED',
  RETIRED = 'RETIRED',
}

export type ProductUnit = {
  uuid: string;
  serialNumber: string;
  status: ProductUnitStatus;
  purchaseDate?: string;
  warrantyUntil?: string;
  photoUrl?: string;
  notes?: string;
  assignedToPatientUuid?: string;
  assignedAt?: string;
  createdAt: string;
};

export type Product = {
  uuid: string;
  tenantUuid: string;
  sku: string;
  name: string;
  brand?: string;
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

export type CreateProductUnitPayload = {
  serialNumber: string;
  purchaseDate?: string;
  warrantyUntil?: string;
  photoUrl?: string;
  notes?: string;
};

export type CreateProductUnitsBulkPayload = {
  units: CreateProductUnitPayload[];
};

export type UpdateProductUnitPayload = {
  status?: ProductUnitStatus.AVAILABLE | ProductUnitStatus.DAMAGED | ProductUnitStatus.RETIRED;
  warrantyUntil?: string;
  photoUrl?: string;
  notes?: string;
};
