import { AppointmentStatus } from './appointment';

export interface AppointmentUI {
  id: string;
  patient: string;
  patientUUID: string;
  phone: string;
  date: Date;
  time: string;
  status: AppointmentStatus;
  statusLabel: string;
  statusColor: string;
  type: string;
  notes?: string;
  monthsSinceLastVisit: number;
  warrantyExpirationDate: string;
}
