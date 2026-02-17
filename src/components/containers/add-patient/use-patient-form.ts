import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useCreatePatientMutation } from '@/shared/api/mutations/patients/create-patients-mutation';

export type PatientFormValues = {
  name: string;
  id: string;
  employmentArea: string;
  phone: string;
  email: string;
  dob: string;
  gender: 'male' | 'female' | '';
};

export function usePatientForm(onSuccess?: () => void) {
  const router = useRouter();
  const { executeCreatePatient, isPending } = useCreatePatientMutation();

  const initialValues: PatientFormValues = {
    name: '',
    id: '',
    employmentArea: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nombre completo requerido'),
    id: Yup.string().required('La cédula es obligatoria'),
    phone: Yup.string().required('Teléfono requerido'),
    email: Yup.string().email('Email inválido').required('Requerido'),
    dob: Yup.date().required('Fecha requerida'),
    gender: Yup.string().oneOf(['male', 'female'], 'Seleccione un género').required('Requerido'),
  });

  const handleSubmit = async (
    values: PatientFormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    const nameParts = values.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      firstName,
      lastName,
      phone: values.phone,
      birthDate: values.dob,
      email: values.email,
      documentId: values.id,
      gender: values.gender,
    };

    executeCreatePatient(payload, {
      onSuccess: () => {
        resetForm();
        if (onSuccess) onSuccess();
        router.push('/patients');
      },
      onError: (err) => {
        console.error('Error al registrar paciente:', err);
      },
    });
  };

  return {
    initialValues,
    validationSchema,
    handleSubmit,
    isLoading: isPending,
  };
}
