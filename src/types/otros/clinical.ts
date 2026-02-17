export enum ControlType {
  AUDIOLOGY = 'AUDIOLOGY',
  DERMATOLOGY = 'DERMATOLOGY',
  GENERAL = 'GENERAL',
  DENTAL = 'DENTAL',
}

export interface ClinicalControl {
  id: string;
  patientId: string;
  specialistName: string;
  type: ControlType;
  date: string;
  note: string;
  details?: {
    reason: string;
    diagnosis: string;
    treatment: string;
  };
  attachments?: string[];
}
