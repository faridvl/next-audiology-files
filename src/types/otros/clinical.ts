export enum ControlType {
  AUDIOLOGY = 'Audiología',
  DERMATOLOGY = 'Control de Piel',
  DENTAL = 'Odontología',
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
