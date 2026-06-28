import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useMedicalControlsQuery, MedicalControlResponse } from '@/shared/api/querys/medical-controls-query';
import { useMemo } from 'react';

const AUDIOLOGY_SPECIALITY = 'AUDIOLOGY';

export function usePatientSummary(uuid: string) {
  const { data: patient, isLoading: isLoadingPatient } = usePatientDetailQuery(uuid);
  const { data: controlsPage, isLoading: isLoadingControls } = useMedicalControlsQuery(uuid, 1, 50);

  const latestAudiologyControl = useMemo((): MedicalControlResponse | null => {
    if (!controlsPage?.data?.length) return null;

    const audiologyControls = controlsPage.data.filter(
      (control) => control.header.speciality === AUDIOLOGY_SPECIALITY,
    );

    if (!audiologyControls.length) return controlsPage.data[0];

    return audiologyControls.reduce((latest, current) =>
      new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest,
    );
  }, [controlsPage]);

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

    const lastVisit = latestAudiologyControl
      ? new Date(latestAudiologyControl.createdAt).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Sin visitas registradas';

    const mainDiagnosis = latestAudiologyControl?.clinicalData?.diagnosis || 'Sin diagnóstico registrado';

    const audiogramFindings = latestAudiologyControl?.clinicalData?.findings as Record<string, unknown> | undefined;
    const observations = audiogramFindings
      ? `Control de ${latestAudiologyControl?.header?.speciality?.toLowerCase() ?? 'especialidad'} — ${mainDiagnosis}`
      : 'Sin observaciones registradas';

    return {
      name: `${patient.firstName} ${patient.lastName}`,
      id: patient.uuid.split('-')[0].toUpperCase(),
      age: `${age} años (${formattedBirth})`,
      bloodType: 'O+',
      phone: patient.phone || 'Sin teléfono',
      lastVisit,
      mainDiagnosis,
      observations,
      latestAudiologyControl,
    };
  }, [patient, latestAudiologyControl]);

  return {
    patient: transformedPatient,
    isLoading: isLoadingPatient || isLoadingControls,
  };
}
