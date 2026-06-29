import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSession } from '@/hooks/use-session';
import { useNavigation } from '@/hooks/use-navigation';
import { useCreateMedicalControlMutation } from '@/shared/api/mutations/medical-control-mutation/medical-control-mutation';
import { useCreateMaintenanceMutation } from '@/shared/api/mutations/maintenance/create-maintenance-mutation';
import { useClinicalTemplateBySpecialityQuery } from '@/shared/api/querys/clinical-templates-query';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { UserSpecialty } from '@/types/auth/auth';
import { AudiogramData, createEmptyAudiogram } from '@/components/common/audiogram-table/audiogram-table';
import { ClinicalTemplate } from '@/types/clinical-template/clinical-template.types';

const userSpecialtyToApiSpeciality: Record<UserSpecialty, MedicalSpeciality> = {
  [UserSpecialty.AUDIOLOGY]: MedicalSpeciality.AUDIOLOGY,
  [UserSpecialty.DENTAL]: MedicalSpeciality.DENTAL,
  [UserSpecialty.GENERAL]: MedicalSpeciality.GENERAL,
};

export interface ConsultaSections {
  control: boolean;
  audiogram: boolean;
  maintenance: boolean;
}

export function useConsulta(patientUuid: string) {
  const navigation = useNavigation();
  const { user } = useSession();

  const apiSpeciality: MedicalSpeciality = user?.specialty
    ? userSpecialtyToApiSpeciality[user.specialty]
    : MedicalSpeciality.GENERAL;

  const [sections, setSections] = useState<ConsultaSections>({
    control: true,
    audiogram: false,
    maintenance: false,
  });

  const [otoscopyRight, setOtoscopyRight] = useState('');
  const [otoscopyLeft, setOtoscopyLeft] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [dynamicFields, setDynamicFields] = useState<Record<string, string | boolean | number>>({});
  const [audiogramData, setAudiogramData] = useState<AudiogramData>(createEmptyAudiogram());

  const [maintenanceDescription, setMaintenanceDescription] = useState('');
  const [nextMaintenanceAt, setNextMaintenanceAt] = useState('');

  const { data: templateData } = useClinicalTemplateBySpecialityQuery(apiSpeciality);
  const activeTemplate: ClinicalTemplate | null = templateData ?? null;

  const {
    executeCreateControl,
    isPending: isPendingControl,
    isSuccess: isSuccessControl,
    error: errorControl,
    reset: resetControl,
  } = useCreateMedicalControlMutation();

  const {
    executeCreateMaintenance,
    isPending: isPendingMaintenance,
    isSuccess: isSuccessMaintenance,
    error: errorMaintenance,
    reset: resetMaintenance,
  } = useCreateMaintenanceMutation();

  const isPending = isPendingControl || isPendingMaintenance;

  const [savedControl, setSavedControl] = useState(false);
  const [savedMaintenance, setSavedMaintenance] = useState(false);

  useEffect(() => {
    if (isSuccessControl) setSavedControl(true);
  }, [isSuccessControl]);

  useEffect(() => {
    if (isSuccessMaintenance) setSavedMaintenance(true);
  }, [isSuccessMaintenance]);

  useEffect(() => {
    const needControl = sections.control || sections.audiogram;
    const needMaintenance = sections.maintenance;

    const controlDone = !needControl || savedControl;
    const maintenanceDone = !needMaintenance || savedMaintenance;

    if (controlDone && maintenanceDone && (savedControl || savedMaintenance)) {
      toast.success('Consulta guardada exitosamente');
      navigation.patients.detail(patientUuid);
    }
  }, [savedControl, savedMaintenance, sections, navigation, patientUuid]);

  useEffect(() => {
    if (errorControl) {
      toast.error('Error al guardar el control médico');
      resetControl();
    }
  }, [errorControl, resetControl]);

  useEffect(() => {
    if (errorMaintenance) {
      toast.error('Error al guardar el mantenimiento');
      resetMaintenance();
    }
  }, [errorMaintenance, resetMaintenance]);

  function toggleSection(key: keyof ConsultaSections) {
    setSections((previous) => ({ ...previous, [key]: !previous[key] }));
  }

  function setDynamicField(fieldId: string, value: string | boolean | number) {
    setDynamicFields((previous) => ({ ...previous, [fieldId]: value }));
  }

  function setQuickMaintenanceDate(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setNextMaintenanceAt(date.toISOString().split('T')[0]);
  }

  function handleFinalize() {
    const needControl = sections.control || sections.audiogram;
    const needMaintenance = sections.maintenance;

    if (!needControl && !needMaintenance) {
      toast.error('Activa al menos una sección de la consulta');
      return;
    }

    if (needControl && !diagnosis.trim()) {
      toast.error('El diagnóstico es requerido para guardar el control');
      return;
    }

    if (needMaintenance && !maintenanceDescription.trim()) {
      toast.error('La descripción del mantenimiento es requerida');
      return;
    }

    if (needControl) {
      const findings: Record<string, unknown> = {};

      if (apiSpeciality === MedicalSpeciality.AUDIOLOGY) {
        findings.otoscopyRight = otoscopyRight;
        findings.otoscopyLeft = otoscopyLeft;
      }

      if (sections.audiogram) {
        findings.audiogram = audiogramData;
      }

      if (activeTemplate) {
        for (const field of activeTemplate.fields) {
          const value = dynamicFields[field.id];
          if (value !== undefined) findings[field.label] = value;
        }
      }

      executeCreateControl({
        header: {
          patientUUID: patientUuid,
          speciality: apiSpeciality,
          schemaVersion: 1,
        },
        clinicalData: { findings, diagnosis },
        followUp: { hasFollowUp: false, tentativeDate: null },
      });
    } else {
      setSavedControl(true);
    }

    if (needMaintenance) {
      executeCreateMaintenance({
        patientUuid,
        description: maintenanceDescription,
        ...(nextMaintenanceAt ? { nextMaintenanceAt: new Date(nextMaintenanceAt).toISOString() } : {}),
      });
    } else {
      setSavedMaintenance(true);
    }
  }

  return {
    apiSpeciality,
    activeTemplate,
    sections,
    toggleSection,
    fields: {
      otoscopyRight,
      setOtoscopyRight,
      otoscopyLeft,
      setOtoscopyLeft,
      diagnosis,
      setDiagnosis,
      dynamicFields,
      setDynamicField,
      audiogramData,
      setAudiogramData,
      maintenanceDescription,
      setMaintenanceDescription,
      nextMaintenanceAt,
      setNextMaintenanceAt,
    },
    methods: { setQuickMaintenanceDate, handleFinalize },
    isPending,
  };
}
