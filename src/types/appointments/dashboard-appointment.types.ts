import { AppointmentStatus } from './appointment';

export interface DashboardAppointment {
  id: string;
  time: string;
  endTime: string;
  patient: string;
  description: string;
  status: AppointmentStatus;
  statusLabel: string;
  statusColor: string;
}
