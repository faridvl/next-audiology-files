import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSession } from '@/hooks/use-session';
import { useNavigation } from '@/hooks/use-navigation';
import { useCreateMedicalControlMutation } from '@/shared/api/mutations/medical-control-mutation/medical-control-mutation';
import { useClinicalTemplateBySpecialityQuery } from '@/shared/api/querys/clinical-templates-query';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { UserSpecialty } from '@/types/auth/auth';
import { ConsultaSessionStorage } from '@/shared/utils/consulta-session';

const userSpecialtyToApiSpeciality: Record<UserSpecialty, MedicalSpeciality> = {
  [UserSpecialty.AUDIOLOGY]: MedicalSpeciality.AUDIOLOGY,
  [UserSpecialty.DENTAL]: MedicalSpeciality.DENTAL,
  [UserSpecialty.GENERAL]: MedicalSpeciality.GENERAL,
};

export function useConsultaControl(patientUuid: string) {
  const navigation = useNavigation();
  const { user } = useSession();

  const apiSpeciality: MedicalSpeciality = user?.specialty
    ? userSpecialtyToApiSpeciality[user.specialty]
    : MedicalSpeciality.GENERAL;

  const { data: templateData } = useClinicalTemplateBySpecialityQuery(apiSpeciality);
  const activeTemplate = templateData ?? null;

  const [otoscopyRight, setOtoscopyRight] = useState('');
  const [otoscopyLeft, setOtoscopyLeft] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string | boolean | number>>({});

  const { executeCreateControl, isPending, isSuccess, error, reset } = useCreateMedicalControlMutation();

  useEffect(() => {
    if (isSuccess) return;
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error('Error al guardar el control. Intenta nuevamente.');
      reset();
    }
  }, [error, reset]);

  function setFieldValue(fieldId: string, value: string | boolean | number) {
    setFieldValues((previous) => ({ ...previous, [fieldId]: value }));
  }

  function handleSave() {
    if (!diagnosis.trim()) {
      toast.error('El diagnóstico es requerido');
      return;
    }

    const findings: Record<string, unknown> = {};

    if (apiSpeciality === MedicalSpeciality.AUDIOLOGY) {
      findings.otoscopyRight = otoscopyRight;
      findings.otoscopyLeft = otoscopyLeft;
    }

    if (activeTemplate) {
      for (const field of activeTemplate.fields) {
        const value = fieldValues[field.id];
        if (value !== undefined) findings[field.label] = value;
      }
    }

    executeCreateControl(
      {
        header: { patientUUID: patientUuid, speciality: apiSpeciality, schemaVersion: 1 },
        clinicalData: { findings, diagnosis },
        followUp: { hasFollowUp: false, tentativeDate: null },
      },
      {
        onSuccess: (data) => {
          const saved = data as { uuid: string };
          ConsultaSessionStorage.update(patientUuid, { savedControlUuid: saved.uuid });
          toast.success('Control clínico guardado');
          navigation.patients.consulta(patientUuid);
        },
      },
    );
  }

  return {
    apiSpeciality,
    activeTemplate,
    fields: { otoscopyRight, setOtoscopyRight, otoscopyLeft, setOtoscopyLeft, diagnosis, setDiagnosis, fieldValues, setFieldValue },
    isPending,
    handleSave,
  };
}
