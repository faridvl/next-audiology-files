import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/hooks/use-session';
import { useNavigation } from '@/hooks/use-navigation';
import { useCreateMedicalControlMutation } from '@/shared/api/mutations/medical-control-mutation/medical-control-mutation';
import { useClinicalTemplatesBySpecialityQuery } from '@/shared/api/querys/clinical-templates-query';
import { FETCH_ENCOUNTER_KEY } from '@/shared/api/querys/encounters-query';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { UserSpecialty } from '@/types/auth/auth';

// DENTAL not yet in API schema — falls back to GENERAL until endpoint supports it
const userSpecialtyToApiSpeciality: Record<UserSpecialty, MedicalSpeciality> = {
  [UserSpecialty.AUDIOLOGY]: MedicalSpeciality.AUDIOLOGY,
  [UserSpecialty.DENTAL]: MedicalSpeciality.GENERAL,
  [UserSpecialty.GENERAL]: MedicalSpeciality.GENERAL,
};

export function useConsultaControl(patientUuid: string, encounterUuid: string) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { user } = useSession();

  const apiSpeciality: MedicalSpeciality = user?.specialty
    ? userSpecialtyToApiSpeciality[user.specialty]
    : MedicalSpeciality.GENERAL;

  const { data: templatesData } = useClinicalTemplatesBySpecialityQuery(apiSpeciality);
  const templates = templatesData ?? [];
  const [selectedTemplateUuid, setSelectedTemplateUuid] = useState<string | null>(null);

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplateUuid) {
      setSelectedTemplateUuid(templates[0].uuid);
    }
  }, [templates, selectedTemplateUuid]);

  const activeTemplate = templates.find((template) => template.uuid === selectedTemplateUuid) ?? null;

  const [otoscopyRight, setOtoscopyRight] = useState('');
  const [otoscopyLeft, setOtoscopyLeft] = useState('');
  const [cleaningPerformed, setCleaningPerformed] = useState(false);
  const [usesAuxiliaries, setUsesAuxiliaries] = useState(false);
  const [tinnitus, setTinnitus] = useState(false);
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
      findings.cleaningPerformed = cleaningPerformed;
      findings.usesAuxiliaries = usesAuxiliaries;
      findings.tinnitus = tinnitus;
    }

    if (activeTemplate) {
      for (const field of activeTemplate.fields) {
        const value = fieldValues[field.id];
        if (value !== undefined) findings[field.label] = value;
      }
    }

    executeCreateControl(
      {
        header: { patientUUID: patientUuid, encounterUuid, speciality: apiSpeciality, schemaVersion: 1 },
        clinicalData: { findings, diagnosis },
        followUp: { hasFollowUp: false, tentativeDate: null },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [FETCH_ENCOUNTER_KEY, encounterUuid] });
          toast.success('Control clínico guardado');
          navigation.patients.consulta(patientUuid);
        },
      },
    );
  }

  return {
    apiSpeciality,
    templates,
    activeTemplate,
    selectedTemplateUuid,
    setSelectedTemplateUuid,
    fields: {
      otoscopyRight, setOtoscopyRight,
      otoscopyLeft, setOtoscopyLeft,
      cleaningPerformed, setCleaningPerformed,
      usesAuxiliaries, setUsesAuxiliaries,
      tinnitus, setTinnitus,
      diagnosis, setDiagnosis,
      fieldValues, setFieldValue,
    },
    isPending,
    handleSave,
  };
}
