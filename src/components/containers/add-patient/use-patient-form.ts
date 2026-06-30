import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useCreatePatientMutation } from '@/shared/api/mutations/patients/create-patients-mutation';
import { CreatePatientPayload } from '@/types/patients/patient';
import { toast } from 'sonner';

export enum DocumentType {
  NATIONAL = 'national',
  DIMEX = 'dimex',
  PASSPORT = 'passport',
}

export type PatientFormValues = {
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentId: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  gender: 'male' | 'female';
};

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;

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

function resolveApiError(error: unknown): { field: 'documentId' | 'email' | null; message: string } {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  if (message.includes('document') || message.includes('cédula') || message.includes('cedula') || message.includes('already exists')) {
    if (message.includes('document') || message.includes('cedula')) {
      return { field: 'documentId', message: 'Esta cédula ya está registrada en el sistema.' };
    }
    if (message.includes('email') || message.includes('correo')) {
      return { field: 'email', message: 'Este correo ya está registrado en el sistema.' };
    }
    return { field: null, message: 'Un paciente con estos datos ya existe.' };
  }
  if (message.includes('email')) {
    return { field: 'email', message: 'Este correo ya está registrado en el sistema.' };
  }
  return { field: null, message: 'Error al registrar el paciente. Verifica los datos e intenta nuevamente.' };
}

export function usePatientForm(onSuccess?: () => void) {
  const router = useRouter();
  const { executeCreatePatient, isPending } = useCreatePatientMutation();

  const initialValues: PatientFormValues = {
    firstName: '',
    lastName: '',
    documentType: DocumentType.NATIONAL,
    documentId: '',
    phone: '',
    email: '',
    birthDate: '',
    address: '',
    gender: 'male',
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(NAME_REGEX, 'Solo letras y espacios')
      .max(60, 'Máximo 60 caracteres')
      .required('Nombre requerido'),
    lastName: Yup.string()
      .matches(NAME_REGEX, 'Solo letras y espacios')
      .max(60, 'Máximo 60 caracteres')
      .required('Apellido requerido'),
    documentType: Yup.string().required(),
    documentId: Yup.string()
      .max(20, 'Máximo 20 caracteres')
      .required('Cédula obligatoria'),
    phone: Yup.string()
      .matches(/^\d{4}-\d{4}$/, 'Formato: XXXX-XXXX')
      .required('Teléfono requerido'),
    email: Yup.string()
      .email('Ingresa un correo electrónico válido (ej. nombre@dominio.com)')
      .required('Correo requerido'),
    birthDate: Yup.date()
      .max(new Date(), 'La fecha no puede ser futura')
      .required('Fecha de nacimiento requerida'),
    address: Yup.string()
      .max(240, 'Máximo 240 caracteres')
      .required('Dirección requerida'),
    gender: Yup.string()
      .oneOf(['male', 'female'], 'Seleccione un género')
      .required('Género requerido'),
  });

  const handleSubmit = async (
    values: PatientFormValues,
    { resetForm, setFieldError }: { resetForm: () => void; setFieldError: (field: string, message: string) => void },
  ) => {
    const payload: CreatePatientPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: `+506 ${values.phone}`,
      birthDate: values.birthDate,
      email: values.email.trim().toLowerCase(),
      documentId: values.documentId,
      gender: values.gender,
      address: values.address.trim(),
    };

    executeCreatePatient(payload, {
      onSuccess: () => {
        resetForm();
        if (onSuccess) {
          onSuccess();
        } else {
          toast.success('Paciente registrado correctamente.');
          router.push('/patients');
        }
      },
      onError: (error) => {
        const { field, message } = resolveApiError(error);
        if (field) {
          setFieldError(field, message);
        } else {
          toast.error(message);
        }
      },
    });
  };

  return { initialValues, validationSchema, handleSubmit, isLoading: isPending };
}
