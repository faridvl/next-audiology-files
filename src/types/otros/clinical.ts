export { MedicalSpeciality as ControlType } from '@/types/medical-controls/medical-control.types';

export interface ClinicalControl {
  id: string;
  patientId: string;
  specialistName: string;
  type: string;
  date: string;
  note: string;
  encounterUuid: string | null;
  details?: {
    reason: string;
    diagnosis: string;
    treatment: string;
  };
  attachments?: string[];
}
