import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useCreatePatientMutation } from '@/shared/api/mutations/patients/create-patients-mutation';
import { CreatePatientPayload } from '@/types/patients/patient';

export type PatientFormValues = {
  firstName: string;
  lastName: string;
  documentId: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  gender: 'male' | 'female' | '';
};

const PHONE_REGEX = /^\+?[\d\s\-]{7,15}$/;
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
const today = new Date().toISOString().split('T')[0];

export function usePatientForm(onSuccess?: () => void) {
  const router = useRouter();
  const { executeCreatePatient, isPending } = useCreatePatientMutation();

  const initialValues: PatientFormValues = {
    firstName: '',
    lastName: '',
    documentId: '',
    phone: '',
    email: '',
    birthDate: '',
    address: '',
    gender: '',
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
    documentId: Yup.string()
      .max(20, 'Máximo 20 caracteres')
      .required('Cédula obligatoria'),
    phone: Yup.string()
      .matches(PHONE_REGEX, 'Formato: +XXX XXXX-XXXX, solo dígitos')
      .max(15, 'Máximo 15 caracteres')
      .required('Teléfono requerido'),
    email: Yup.string()
      .email('Correo inválido')
      .required('Correo requerido'),
    birthDate: Yup.date()
      .max(new Date(), 'La fecha de nacimiento no puede ser futura')
      .required('Fecha de nacimiento requerida'),
    address: Yup.string()
      .max(120, 'Máximo 120 caracteres')
      .required('Dirección requerida'),
    gender: Yup.string()
      .oneOf(['male', 'female'], 'Seleccione un género')
      .required('Género requerido'),
  });

  const handleSubmit = async (values: PatientFormValues, { resetForm }: { resetForm: () => void }) => {
    const payload: CreatePatientPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone,
      birthDate: values.birthDate,
      email: values.email,
      documentId: values.documentId,
      gender: values.gender,
      address: values.address,
    };

    executeCreatePatient(payload, {
      onSuccess: () => {
        resetForm();
        if (onSuccess) onSuccess();
        router.push('/patients');
      },
    });
  };

  return { initialValues, validationSchema, handleSubmit, isLoading: isPending, today };
}
