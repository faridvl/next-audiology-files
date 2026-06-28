export enum DocumentCategory {
  RECEIPT = 'Recibos',
  WARRANTY = 'Garantías',
  EXTERNAL_TEST = 'Pruebas Externas',
}

export type DocumentFilterType = 'ALL' | DocumentCategory;

export interface DocumentItem {
  id: string;
  patientId: string;
  name: string;
  category: DocumentCategory;
  date: string;
  size: string;
  controlId: string | null;
}
