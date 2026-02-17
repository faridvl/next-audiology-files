import { useState } from 'react';
import { MedicalSpeciality, MedicalControl } from '@/types/medical-controls/medical-control.types';
import { useCreateMedicalControlMutation } from '@/shared/api/mutations/medical-control-mutation/medical-control-mutation';
import { useMedicalControlsQuery } from '@/shared/api/querys/medical-controls-query';

const INITIAL_FINDINGS: Record<MedicalSpeciality, Record<string, any>> = {
  [MedicalSpeciality.AUDIOLOGY]: {
    otoscopyRight: '',
    otoscopyLeft: '',
    cleaningPerformed: false,
    usesAuxiliaries: false,
    tinnitus: false,
  },
  [MedicalSpeciality.GENERAL]: {
    generalNotes: '',
  },
  [MedicalSpeciality.DENTAL]: {
    generalNotes: '',
  },
};

export const useNewControl = (patientUUID: string, appointmentUUID?: string | null) => {
  const { executeCreateControl, isPending } = useCreateMedicalControlMutation();
  const { data: historyData, isLoading: isLoadingHistory } = useMedicalControlsQuery(patientUUID);
  const [showHistory, setShowHistory] = useState(true);
  const [speciality, setSpeciality] = useState<MedicalSpeciality>(MedicalSpeciality.AUDIOLOGY);
  const [diagnosis, setDiagnosis] = useState('');

  const [findings, setFindings] = useState(INITIAL_FINDINGS[MedicalSpeciality.AUDIOLOGY]);

  const [followUp, setFollowUp] = useState({
    hasFollowUp: false,
    tentativeDate: '',
    notes: '',
  });

  const updateFinding = (key: string, value: any) => {
    setFindings((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeSpeciality = (newSpec: MedicalSpeciality) => {
    setSpeciality(newSpec);
    setFindings(INITIAL_FINDINGS[newSpec] || {});
  };

  const handleSave = async () => {
    if (!diagnosis.trim()) {
      alert('Por favor, ingrese un diagnóstico.');
      return;
    }

    const payload: MedicalControl = {
      header: {
        patientUUID,
        appointmentUUID: appointmentUUID || null,
        speciality,
        schemaVersion: 1,
      },
      clinicalData: {
        findings,
        diagnosis,
      },
      followUp: {
        hasFollowUp: followUp.hasFollowUp,
        tentativeDate: followUp.tentativeDate
          ? new Date(followUp.tentativeDate).toISOString()
          : null,
        notes: followUp.notes,
      },
    };

    executeCreateControl(payload);
  };

  return {
    states: { speciality, diagnosis, findings, followUp, showHistory, isPending },
    setters: { setDiagnosis, setFindings, setFollowUp, setShowHistory },
    methods: { updateFinding, handleSave, handleChangeSpeciality },
  };
};
