export interface Patient {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address: string | null;
  birthDate: string;
  tenantId: number;
  tenantUuid: string;
  createdAt: string;
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
