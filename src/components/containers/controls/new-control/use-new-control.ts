import { useState } from 'react';

export enum Speciality {
  AUDIOLOGY = 'Audiología',
  DENTAL = 'Odontología',
  DERMA = 'Dermatología',
  GENERAL = 'Medicina General',
}

export const useNewControl = () => {
  const [showHistory, setShowHistory] = useState(true);
  const [showAudiogram, setShowAudiogram] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    speciality: Speciality.AUDIOLOGY,
    nextMaintenanceDate: '',
    nextControlNotes: '',
    comments: '',
    findings: {
      rightEar: '',
      leftEar: '',
      general: '',
    },
  });

  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setFormData({ ...formData, nextMaintenanceDate: date.toISOString().split('T')[0] });
  };

  const handleSave = async () => {
    console.log('Guardando...', formData);
  };

  return {
    states: { showHistory, showAudiogram, isFollowUpModalOpen, formData },
    setters: { setShowHistory, setShowAudiogram, setIsFollowUpModalOpen, setFormData },
    methods: { setQuickDate, handleSave },
  };
};
