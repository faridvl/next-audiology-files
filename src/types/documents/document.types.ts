export enum DocumentCategory {
  RECEIPT = 'Recibos',
  WARRANTY = 'Garantías',
  EXTERNAL_TEST = 'Pruebas Externas',
  OTHER = 'Otros',
}

export enum DocumentCategoryApiValue {
  RECEIPT = 'RECEIPT',
  WARRANTY = 'WARRANTY',
  EXTERNAL_TEST = 'EXTERNAL_TEST',
  OTHER = 'OTHER',
}

export const DOCUMENT_CATEGORY_API_TO_DISPLAY: Record<DocumentCategoryApiValue, DocumentCategory> = {
  [DocumentCategoryApiValue.RECEIPT]: DocumentCategory.RECEIPT,
  [DocumentCategoryApiValue.WARRANTY]: DocumentCategory.WARRANTY,
  [DocumentCategoryApiValue.EXTERNAL_TEST]: DocumentCategory.EXTERNAL_TEST,
  [DocumentCategoryApiValue.OTHER]: DocumentCategory.OTHER,
};

export const DOCUMENT_CATEGORY_DISPLAY_TO_API: Record<DocumentCategory, DocumentCategoryApiValue> = {
  [DocumentCategory.RECEIPT]: DocumentCategoryApiValue.RECEIPT,
  [DocumentCategory.WARRANTY]: DocumentCategoryApiValue.WARRANTY,
  [DocumentCategory.EXTERNAL_TEST]: DocumentCategoryApiValue.EXTERNAL_TEST,
  [DocumentCategory.OTHER]: DocumentCategoryApiValue.OTHER,
};

export type DocumentFilterType = 'ALL' | DocumentCategory;

export interface DocumentItem {
  id: string;
  patientId: string;
  name: string;
  url: string;
  category: DocumentCategory;
  date: string;
  size: string;
  controlId: string | null;
}

/** Respuesta del API para un documento de paciente */
export interface PatientDocument {
  id: number;
  uuid: string;
  originalName: string;
  category: DocumentCategoryApiValue;
  uploadedAt: string;
  size: number;
  url: string;
}
