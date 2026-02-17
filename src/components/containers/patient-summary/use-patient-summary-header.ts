import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useMemo } from 'react';

export function usePatientSummary(uuid: string) {
  const { data: patient, isLoading } = usePatientDetailQuery(uuid);

  const transformedPatient = useMemo(() => {
    if (!patient) return null;

    const birthDate = new Date(patient.birthDate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    const formattedBirth = birthDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return {
      name: `${patient.firstName} ${patient.lastName}`,
      id: patient.uuid.split('-')[0].toUpperCase(),
      age: `${age} años (${formattedBirth})`,
      bloodType: 'O+', // Hardcoded por ahora, o mapear si viene en el futuro
      phone: patient.phone || 'Sin teléfono',
      lastVisit: 'TODO(!): pendiente de agregar', // Esto vendría de la lista de controles
      mainDiagnosis: 'TODO(!): pendiente de agregar', // Placeholder clínico
      allergies: ['Pendiente'],
      medications: [],
      observations: 'TODO(!): pendiente de agregar',
    };
  }, [patient]);

  return {
    patient: transformedPatient,
    isLoading,
  };
}
