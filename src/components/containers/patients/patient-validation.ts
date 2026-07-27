import * as Yup from 'yup';

export enum DocumentType {
  NATIONAL = 'national',
  DIMEX = 'dimex',
  PASSPORT = 'passport',
}

export enum PatientGender {
  MALE = 'male',
  FEMALE = 'female',
}

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
const CREATE_PHONE_REGEX = /^\d{4}-\d{4}$/;
const EDIT_PHONE_REGEX = /^\+?[\d\s-]{7,20}$/;

export const DOCUMENT_MASKS: Record<DocumentType, { placeholder: string; maxLength: number; pattern: RegExp; hint: string }> = {
  [DocumentType.NATIONAL]: {
    placeholder: '0-0000-0000',
    maxLength: 11,
    pattern: /^\d{1}-\d{4}-\d{4}$/,
    hint: 'Formato: X-XXXX-XXXX',
  },
  [DocumentType.DIMEX]: {
    placeholder: '000000000000',
    maxLength: 12,
    pattern: /^\d{11,12}$/,
    hint: '11 o 12 dígitos',
  },
  [DocumentType.PASSPORT]: {
    placeholder: 'A1234567',
    maxLength: 12,
    pattern: /^[A-Z0-9]{6,12}$/,
    hint: 'Letras y números, 6-12 caracteres',
  },
};

export function formatNationalId(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 1) return digits;
  if (digits.length <= 5) return `${digits[0]}-${digits.slice(1)}`;
  return `${digits[0]}-${digits.slice(1, 5)}-${digits.slice(5)}`;
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

const patientBaseFields = {
  firstName: Yup.string()
    .matches(NAME_REGEX, 'Solo letras y espacios')
    .max(60, 'Máximo 60 caracteres')
    .required('Nombre requerido'),
  lastName: Yup.string()
    .matches(NAME_REGEX, 'Solo letras y espacios')
    .max(60, 'Máximo 60 caracteres')
    .required('Apellido requerido'),
  documentType: Yup.string()
    .oneOf(Object.values(DocumentType))
    .required(),
  documentId: Yup.string()
    .max(20, 'Máximo 20 caracteres')
    .required('Cédula obligatoria'),
  email: Yup.string()
    .email('Ingresa un correo electrónico válido (ej. nombre@dominio.com)'),
  birthDate: Yup.date()
    .max(new Date(), 'La fecha no puede ser futura')
    .required('Fecha de nacimiento requerida'),
  address: Yup.string()
    .max(240, 'Máximo 240 caracteres')
    .required('Dirección requerida'),
  gender: Yup.string()
    .oneOf(Object.values(PatientGender), 'Seleccione un género')
    .required('Género requerido'),
};

export const patientCreateValidationSchema = Yup.object().shape({
  ...patientBaseFields,
  phone: Yup.string()
    .matches(CREATE_PHONE_REGEX, 'Formato: XXXX-XXXX')
    .required('Teléfono requerido'),
});

export const patientEditValidationSchema = Yup.object().shape({
  ...patientBaseFields,
  phone: Yup.string()
    .matches(EDIT_PHONE_REGEX, 'Formato: +XXX XXXX-XXXX, solo dígitos')
    .max(15, 'Máximo 15 caracteres')
    .required('Teléfono requerido'),
});
