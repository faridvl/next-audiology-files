// src/types/clinical-template/clinical-template.types.ts
// Tipos para plantillas de historia clínica configurable (P3-3)
// TODO(!): P3-3 — Actualmente persistido en localStorage.
// Implementar GET/POST /clinical-templates en API para persistencia real.

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
  id: string;
  name: string; // "Audiología General", "Control ORL", etc.
  speciality: string;
  fields: ClinicalFieldDefinition[];
  createdAt: string;
  tenantUuid: string;
}
