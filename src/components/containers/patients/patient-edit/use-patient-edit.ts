import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePatientDetailQuery, FETCH_PATIENT_DETAIL_KEY } from '@/shared/api/querys/get-patient-query';
import { useUpdatePatientMutation } from '@/shared/api/mutations/patients/update-patient-mutation';
import { FETCH_PATIENTS_KEY } from '@/shared/api/querys/patients-query';
import { useNavigation } from '@/hooks/use-navigation';
import { toast } from 'sonner';
import {
  DocumentType,
  PatientGender,
  patientEditValidationSchema,
} from '@/components/containers/patients/patient-validation';

export type PatientEditFormValues = {
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentId: string;
  phone: string;
  birthDate: string;
  address: string;
  email: string;
  gender: PatientGender;
};

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
    documentType: DocumentType.NATIONAL,
    documentId: patient?.documentId ?? '',
    phone: patient?.phone ?? '',
    birthDate: patient?.birthDate ? patient.birthDate.split('T')[0] : '',
    address: patient?.address ?? '',
    email: patient?.email ?? '',
    gender: (patient?.gender as PatientGender) ?? PatientGender.MALE,
  };

  const handleSubmit = (values: PatientEditFormValues) => {
    executeUpdatePatient({
      uuid: patientUuid,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone,
      address: values.address.trim(),
      email: values.email.trim().toLowerCase(),
      gender: values.gender,
      documentId: values.documentId,
      birthDate: values.birthDate,
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
  };
}
