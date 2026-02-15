import { useState } from 'react';

export const useAudiometryData = () => {
  const [modalSide, setModalSide] = useState<'OI' | 'OD' | null>(null);
  const [auditData, setAuditData] = useState({
    OD: {} as Record<number, string>,
    OI: {} as Record<number, string>,
  });

  const updateValue = (side: 'OI' | 'OD', hz: number, value: string) => {
    setAuditData((prev) => ({
      ...prev,
      [side]: { ...prev[side], [hz]: value },
    }));
  };

  const syncFromModal = (side: 'OI' | 'OD', points: any[]) => {
    const newValues = { ...auditData[side] };
    points.forEach((p) => {
      newValues[p.hz] = p.db.toString();
    });
    setAuditData((prev) => ({ ...prev, [side]: newValues }));
    setModalSide(null);
  };

  return {
    modalSide,
    setModalSide,
    auditData,
    updateValue,
    syncFromModal,
  };
};
