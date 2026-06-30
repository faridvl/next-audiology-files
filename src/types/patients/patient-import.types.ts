import { CreatePatientPayload } from './patient';

export interface PatientImportRow extends CreatePatientPayload {
  /** Fila original en el archivo (1-based, sin contar encabezado) */
  rowIndex: number;
}

export interface PatientImportRowError {
  row: number;
  field: string;
  message: string;
}

export interface PatientImportValidationResult {
  valid: PatientImportRow[];
  errors: PatientImportRowError[];
}

export interface BulkImportApiResult {
  imported: number;
  skipped: number;
  errors: { row: number; reason: string }[];
}

/** Columnas aceptadas en el archivo. Coinciden con los headers de la plantilla. */
export const IMPORT_COLUMN_MAP = {
  Nombre: 'firstName',
  Apellidos: 'lastName',
  Cedula: 'documentId',
  Correo: 'email',
  Telefono: 'phone',
  FechaNacimiento: 'birthDate',
  Direccion: 'address',
  Genero: 'gender',
} as const;

export type ImportColumn = keyof typeof IMPORT_COLUMN_MAP;
