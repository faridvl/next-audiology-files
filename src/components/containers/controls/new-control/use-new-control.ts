import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { UserSpecialty } from '@/types/auth/auth';
import { useCreateMedicalControlMutation } from '@/shared/api/mutations/medical-control-mutation/medical-control-mutation';
import { useNavigation } from '@/hooks/use-navigation';
import { useSession } from '@/hooks/use-session';
import { ClinicalTemplate } from '@/types/clinical-template/clinical-template.types';
import { useClinicalTemplateBySpecialityQuery } from '@/shared/api/querys/clinical-templates-query';

// Mapeo de UserSpecialty (sesión) a MedicalSpeciality (API)
const userSpecialtyToApiSpeciality: Record<UserSpecialty, MedicalSpeciality> = {
  [UserSpecialty.AUDIOLOGY]: MedicalSpeciality.AUDIOLOGY,
  [UserSpecialty.DENTAL]: MedicalSpeciality.DENTAL,
  [UserSpecialty.GENERAL]: MedicalSpeciality.GENERAL,
};

// Fallback: tenant.businessType → UserSpecialty
const businessTypeToUserSpecialty: Record<string, UserSpecialty> = {
  AUDIOLOGY: UserSpecialty.AUDIOLOGY,
  DENTAL: UserSpecialty.DENTAL,
  GENERAL: UserSpecialty.GENERAL,
};

function resolveSpecialty(userSpecialty?: UserSpecialty, tenantBusinessType?: string): UserSpecialty | null {
  if (userSpecialty) return userSpecialty;
  if (tenantBusinessType && businessTypeToUserSpecialty[tenantBusinessType]) {
    return businessTypeToUserSpecialty[tenantBusinessType];
  }
  return null;
}

export const useNewControl = (patientId: string) => {
  const navigation = useNavigation();
  const { user, tenant } = useSession();
  const { executeCreateControl, isPending, isSuccess, error } = useCreateMedicalControlMutation();

  const [showHistory, setShowHistory] = useState(true);
  const [showAudiogram, setShowAudiogram] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, string | boolean | number>>({});
  const [audiogramData, setAudiogramData] = useState<{ OD: Record<number, string>; OI: Record<number, string> }>({ OD: {}, OI: {} });

  // Especialidad resuelta: usuario logueado > tipo de negocio del tenant
  const resolvedSpecialty = resolveSpecialty(user?.specialty, tenant?.businessType);
  const apiSpeciality: MedicalSpeciality = resolvedSpecialty
    ? userSpecialtyToApiSpeciality[resolvedSpecialty]
    : MedicalSpeciality.GENERAL;

  const [formData, setFormData] = useState({
    otoscopyRight: '',
    otoscopyLeft: '',
    generalFindings: '',
    diagnosis: '',
    nextMaintenanceDate: '',
    nextControlNotes: '',
  });

  // Plantilla clínica para la especialidad resuelta
  const { data: activeTemplateData } = useClinicalTemplateBySpecialityQuery(apiSpeciality);
  const activeTemplate: ClinicalTemplate | null = activeTemplateData ?? null;

  // Limpiar valores dinámicos si cambia la especialidad (cambio de sesión)
  useEffect(() => {
    setDynamicFieldValues({});
  }, [apiSpeciality]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Control médico guardado exitosamente');
      navigation.patients.detail(patientId);
    }
  }, [isSuccess, navigation, patientId]);

  useEffect(() => {
    if (error) toast.error('Error al guardar el control médico');
  }, [error]);

  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setFormData((previous) => ({ ...previous, nextMaintenanceDate: date.toISOString().split('T')[0] }));
  };

  const setDynamicFieldValue = (fieldId: string, value: string | boolean | number) => {
    setDynamicFieldValues((previous) => ({ ...previous, [fieldId]: value }));
  };

  const handleSave = () => {
    if (!formData.diagnosis.trim()) {
      toast.error('El diagnóstico es requerido');
      return;
    }

    let findings: Record<string, unknown>;

    if (apiSpeciality === MedicalSpeciality.AUDIOLOGY) {
      findings = {
        otoscopyRight: formData.otoscopyRight,
        otoscopyLeft: formData.otoscopyLeft,
        cleaningPerformed: false,
        usesAuxiliaries: false,
        tinnitus: false,
        audiogram: audiogramData,
      };
    } else if (apiSpeciality === MedicalSpeciality.DENTAL) {
      findings = {
        generalFindings: formData.generalFindings,
      };
    } else {
      findings = {
        generalFindings: formData.generalFindings,
      };
    }

    if (activeTemplate && Object.keys(dynamicFieldValues).length > 0) {
      for (const field of activeTemplate.fields) {
        const value = dynamicFieldValues[field.id];
        if (value !== undefined) findings[field.label] = value;
      }
    }

    const hasFollowUp = !!formData.nextMaintenanceDate;

    executeCreateControl({
      header: {
        patientUUID: patientId,
        speciality: apiSpeciality,
        schemaVersion: 1,
      },
      clinicalData: {
        findings,
        diagnosis: formData.diagnosis,
      },
      followUp: {
        hasFollowUp,
        tentativeDate: hasFollowUp ? new Date(formData.nextMaintenanceDate).toISOString() : null,
        notes: formData.nextControlNotes || undefined,
      },
    });
  };

  return {
    resolvedSpecialty,
    apiSpeciality,
    states: {
      showHistory,
      showAudiogram,
      isFollowUpModalOpen,
      formData,
      isPending,
      activeTemplate,
      dynamicFieldValues,
    },
    setters: {
      setShowHistory,
      setShowAudiogram,
      setIsFollowUpModalOpen,
      setFormData,
      setDynamicFieldValue,
      setAudiogramData,
    },
    methods: { setQuickDate, handleSave },
  };
};
