import { useState } from 'react';
import { AudiogramPoint, ConductionType } from '../audiogram-modal/use-audiogram';

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

  const syncFromModal = (side: 'OI' | 'OD', points: AudiogramPoint[]) => {
    // Solo tomamos los puntos de vía aérea para los inputs numéricos del capturador
    const airPoints = points.filter((point) => point.conduction === ConductionType.AIR);
    const newValues: Record<number, string> = {};
    airPoints.forEach((point) => {
      newValues[point.hz] = point.db.toString();
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
