// src/types/clinical-template/clinical-template.types.ts
// Tipos para plantillas de historia clínica configurable (P3-3)

export type ClinicalFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'date'
  | 'select';

export interface ClinicalFieldDefinition {
  id: string;
  label: string;
  fieldType: ClinicalFieldType;
  required: boolean;
  options?: string[]; // solo para type 'select'
  order: number;
}

export interface ClinicalTemplate {
  uuid: string;
  /** @deprecated use uuid — kept for backward compat during migration */
  id?: string;
  name: string; // "Audiología General", "Control ORL", etc.
  speciality: string;
  fields: ClinicalFieldDefinition[];
  createdAt: string;
  tenantUuid: string;
}
