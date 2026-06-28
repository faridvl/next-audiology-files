import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { useCreateMedicalControlMutation } from '@/shared/api/mutations/medical-control-mutation/medical-control-mutation';
import { useNavigation } from '@/hooks/use-navigation';
import { useSession } from '@/hooks/use-session';
import { ClinicalTemplate } from '@/types/clinical-template/clinical-template.types';
import { useClinicalTemplateBySpecialityQuery } from '@/shared/api/querys/clinical-templates-query';

export enum Speciality {
  AUDIOLOGY = 'Audiología',
  DENTAL = 'Odontología',
  DERMA = 'Dermatología',
  GENERAL = 'Medicina General',
}

const businessTypeToSpeciality: Record<string, Speciality> = {
  AUDIOLOGY: Speciality.AUDIOLOGY,
  DENTAL: Speciality.DENTAL,
  GENERAL: Speciality.GENERAL,
  DERMA: Speciality.DERMA,
};

const specialityToApiSpeciality: Record<Speciality, MedicalSpeciality> = {
  [Speciality.AUDIOLOGY]: MedicalSpeciality.AUDIOLOGY,
  [Speciality.DENTAL]: MedicalSpeciality.DENTAL,
  [Speciality.DERMA]: MedicalSpeciality.GENERAL,
  [Speciality.GENERAL]: MedicalSpeciality.GENERAL,
};

// Convierte el enum de Speciality (UI) al string de MedicalSpeciality (API)
const specialityToApiKey: Record<Speciality, string> = {
  [Speciality.AUDIOLOGY]: 'AUDIOLOGY',
  [Speciality.DENTAL]: 'DENTAL',
  [Speciality.DERMA]: 'GENERAL',
  [Speciality.GENERAL]: 'GENERAL',
};

export const useNewControl = (patientId: string) => {
  const navigation = useNavigation();
  const { tenant } = useSession();
  const { executeCreateControl, isPending, isSuccess, error } = useCreateMedicalControlMutation();

  const [showHistory, setShowHistory] = useState(true);
  const [showAudiogram, setShowAudiogram] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  // Valores de los campos dinámicos de la plantilla: { fieldId -> value }
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, string | boolean | number>>({});
  const [audiogramData, setAudiogramData] = useState<{ OD: Record<number, string>; OI: Record<number, string> }>({ OD: {}, OI: {} });

  const [formData, setFormData] = useState({
    speciality: Speciality.AUDIOLOGY,
    otoscopyRight: '',
    otoscopyLeft: '',
    generalFindings: '',
    diagnosis: '',
    nextMaintenanceDate: '',
    nextControlNotes: '',
  });

  // Plantilla dinámica activa para la especialidad seleccionada — obtenida desde el API
  const apiSpecialityKeyForQuery = specialityToApiKey[formData.speciality];
  const { data: activeTemplateData } = useClinicalTemplateBySpecialityQuery(apiSpecialityKeyForQuery);
  const activeTemplate: ClinicalTemplate | null = activeTemplateData ?? null;

  useEffect(() => {
    if (tenant?.businessType && businessTypeToSpeciality[tenant.businessType]) {
      setFormData((previous) => ({
        ...previous,
        speciality: businessTypeToSpeciality[tenant.businessType as string],
      }));
    }
  }, [tenant?.businessType]);

  // Limpiar valores dinámicos al cambiar de especialidad
  useEffect(() => {
    setDynamicFieldValues({});
  }, [formData.speciality]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Control médico guardado exitosamente');
      navigation.patients.detail(patientId);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) toast.error('Error al guardar el control médico');
  }, [error]);

  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setFormData({ ...formData, nextMaintenanceDate: date.toISOString().split('T')[0] });
  };

  const setDynamicFieldValue = (fieldId: string, value: string | boolean | number) => {
    setDynamicFieldValues((previous) => ({ ...previous, [fieldId]: value }));
  };

  const handleSave = () => {
    if (!formData.diagnosis.trim()) {
      toast.error('El diagnóstico es requerido');
      return;
    }

    const apiSpeciality = specialityToApiSpeciality[formData.speciality];

    let findings: Record<string, unknown>;

    if (formData.speciality === Speciality.AUDIOLOGY) {
      findings = {
        otoscopyRight: formData.otoscopyRight,
        otoscopyLeft: formData.otoscopyLeft,
        cleaningPerformed: false,
        usesAuxiliaries: false,
        tinnitus: false,
        audiogram: audiogramData,
      };
    } else {
      findings = { generalFindings: formData.generalFindings };
    }

    // Agregar campos dinámicos de la plantilla clínica al objeto findings
    if (activeTemplate && Object.keys(dynamicFieldValues).length > 0) {
      for (const field of activeTemplate.fields) {
        const value = dynamicFieldValues[field.id];
        if (value !== undefined) {
          findings[field.label] = value;
        }
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
