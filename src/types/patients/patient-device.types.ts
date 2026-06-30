export type DeviceSide = 'OD' | 'OI' | 'AMBOS';

export interface PatientDevice {
  uuid: string;
  patientUuid: string;
  tenantUuid: string;
  side: DeviceSide;
  productUuid?: string | null;
  brand?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  purchaseDate?: string | null;
  warrantyUntil?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePatientDevicePayload {
  side: DeviceSide;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyUntil?: string;
  notes?: string;
}
