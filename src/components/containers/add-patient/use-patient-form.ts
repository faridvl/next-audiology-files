import * as Yup from 'yup';
import { useState } from 'react';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { useRouter } from 'next/router';

export type PatientFormValues = {
  name: string;
  id: string;
  employmentArea: string;
  phone: string;
  email: string;
  dob: string;
  gender: 'male' | 'female' | '';
};

export type PatientApiPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
};

export function usePatientForm(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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
    setIsLoading(true);

    const token = CookiesManager.getAccessToken();

    const nameParts = values.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload: PatientApiPayload = {
      firstName,
      lastName,
      phone: values.phone,
      birthDate: values.dob,
    };

    try {
      const response = await fetch('http://localhost:7171/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        console.warn('Sesión expirada');
        CookiesManager.clearAll();
        window.location.href = '/login';
        return;
      }

      if (!response.ok) throw new Error('Error en servidor');
      router.push('/patients');
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al registrar paciente:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    initialValues,
    validationSchema,
    handleSubmit,
    isLoading,
  };
}
