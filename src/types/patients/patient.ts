export interface Patient {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address: string | null;
  birthDate: string;
  gender?: string | null;
  bloodType?: string | null;
  documentId?: string | null;
  occupation?: string | null;
  tenantId: number;
  tenantUuid: string;
  createdAt: string;
  linkedProductUuid?: string | null;
  isActive?: boolean;
}

export interface CreatePatientPayload {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  email: string;
  documentId: string;
  gender: string;
  address: string;
}
