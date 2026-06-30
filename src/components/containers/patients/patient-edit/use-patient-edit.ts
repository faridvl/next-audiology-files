import * as Yup from 'yup';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePatientDetailQuery, FETCH_PATIENT_DETAIL_KEY } from '@/shared/api/querys/get-patient-query';
import { useUpdatePatientMutation } from '@/shared/api/mutations/patients/update-patient-mutation';
import { FETCH_PATIENTS_KEY } from '@/shared/api/querys/patients-query';
import { useNavigation } from '@/hooks/use-navigation';
import { toast } from 'sonner';

export interface PatientEditFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  email: string;
  gender: string;
}

const PHONE_REGEX = /^\+?[\d\s\-]{7,20}$/;
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;

export const patientEditValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(NAME_REGEX, 'Solo letras y espacios')
    .max(60, 'Máximo 60 caracteres')
    .required('Nombre requerido'),
  lastName: Yup.string()
    .matches(NAME_REGEX, 'Solo letras y espacios')
    .max(60, 'Máximo 60 caracteres')
    .required('Apellido requerido'),
  phone: Yup.string()
    .matches(PHONE_REGEX, 'Formato: +XXX XXXX-XXXX, solo dígitos')
    .max(15, 'Máximo 15 caracteres')
    .required('Teléfono requerido'),
  address: Yup.string().max(120, 'Máximo 120 caracteres'),
  email: Yup.string().email('Correo inválido'),
  gender: Yup.string(),
});

export function usePatientEdit(patientUuid: string) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: patient, isLoading: isLoadingPatient } = usePatientDetailQuery(patientUuid);
  const { executeUpdatePatient, isPending, isSuccess, error } = useUpdatePatientMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Paciente actualizado correctamente.');
      queryClient.invalidateQueries({ queryKey: [FETCH_PATIENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [FETCH_PATIENT_DETAIL_KEY, patientUuid] });
      navigation.patients.detail(patientUuid);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error('Error al actualizar el paciente.');
    }
  }, [error]);

  const initialValues: PatientEditFormValues = {
    firstName: patient?.firstName ?? '',
    lastName: patient?.lastName ?? '',
    phone: patient?.phone ?? '',
    address: patient?.address ?? '',
    email: patient?.email ?? '',
    gender: patient?.gender ?? '',
  };

  const handleSubmit = (values: PatientEditFormValues) => {
    executeUpdatePatient({
      uuid: patientUuid,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone,
      address: values.address,
      email: values.email,
      gender: values.gender || undefined,
    });
  };

  const handleCancel = () => {
    navigation.patients.detail(patientUuid);
  };

  return {
    patient,
    initialValues,
    isLoadingPatient,
    isSaving: isPending,
    handleSubmit,
    handleCancel,
    validationSchema: patientEditValidationSchema,
    documentId: patient?.documentId ?? null,
  };
}
