export interface Patient {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string | null;
  birthDate: string;
  tenantId: number;
  tenantUuid: string;
  createdAt: string;
}
