import { useControlDetailQuery } from '@/shared/api/querys/get-medical-controls-query';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import {
  AudiologyFindings,
  MedicalSpeciality,
} from '@/types/medical-controls/medical-control.types';

export function useControlDetail(patientId: string, controlId: string) {
  const {
    data: controlRaw,
    isLoading: isLoadingControl,
    isError: isErrorControl,
  } = useControlDetailQuery(controlId);
  const {
    data: patientRaw,
    isLoading: isLoadingPatient,
    isError: isErrorPatient,
  } = usePatientDetailQuery(patientId);

  const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return '---';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    )
      age--;
    return `${age} AÑOS`;
  };

  const mappedData =
    controlRaw && patientRaw
      ? {
          patient: {
            fullName: `${patientRaw.firstName} ${patientRaw.lastName}`.toUpperCase(),
            documentId: patientRaw.uuid.split('-')[0].toUpperCase(),
            gender: 'MASCULINO', // TODO: API Patient debe retornar gender
            age: calculateAge(patientRaw.birthDate),
            bloodType: 'NO REGISTRADO', // TODO: API Patient debe retornar bloodType
          },
          control: {
            id: controlRaw.uuid,
            institution: 'CENTRO DE SALUD DIGITAL', // TODO: Mocked
            specialistName: 'DR. SISTEMA GEMINI', // TODO: Mocked
            date: new Date(controlRaw.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }),
            speciality: controlRaw.header.speciality as MedicalSpeciality,
            findings: controlRaw.clinicalData.findings as AudiologyFindings,
            diagnosis: controlRaw.clinicalData.diagnosis.toUpperCase(),
            plan: [
              'CONTINUAR CON CUIDADOS HABITUALES.',
              'CONSULTAR EN CASO DE MOLESTIAS O RECURRENCIA.',
            ],
          },
        }
      : null;

  return {
    data: mappedData,
    isLoading: isLoadingControl || isLoadingPatient,
    isError: isErrorControl || isErrorPatient,
  };
}
