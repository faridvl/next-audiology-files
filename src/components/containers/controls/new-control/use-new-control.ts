import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { useCreateMedicalControlMutation } from '@/shared/api/mutations/medical-control-mutation/medical-control-mutation';
import { useNavigation } from '@/hooks/use-navigation';

export const useNewControl = (patientId: string) => {
  const navigation = useNavigation();
  const { executeCreateControl, isPending, isSuccess, error } = useCreateMedicalControlMutation();

  const [showHistory, setShowHistory] = useState(true);
  const [showAudiogram, setShowAudiogram] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    speciality: MedicalSpeciality.AUDIOLOGY,
    otoscopyRight: '',
    otoscopyLeft: '',
    generalFindings: '',
    diagnosis: '',
    nextMaintenanceDate: '',
    nextControlNotes: '',
  });

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

  const handleSave = () => {
    if (!formData.diagnosis.trim()) {
      toast.error('El diagnóstico es requerido');
      return;
    }

    const findings =
      formData.speciality === MedicalSpeciality.AUDIOLOGY
        ? {
            otoscopyRight: formData.otoscopyRight,
            otoscopyLeft: formData.otoscopyLeft,
            cleaningPerformed: false,
            usesAuxiliaries: false,
            tinnitus: false,
          }
        : { generalFindings: formData.generalFindings };

    const hasFollowUp = !!formData.nextMaintenanceDate;

    executeCreateControl({
      header: {
        patientUUID: patientId,
        speciality: formData.speciality,
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
    states: { showHistory, showAudiogram, isFollowUpModalOpen, formData, isPending },
    setters: { setShowHistory, setShowAudiogram, setIsFollowUpModalOpen, setFormData },
    methods: { setQuickDate, handleSave },
  };
};
