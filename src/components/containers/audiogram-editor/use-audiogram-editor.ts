import { useCallback, useMemo, useState } from 'react';
import {
  AudiometryThreshold,
  ConductionRoute,
  Ear,
  HearingLossScale,
} from '@/types/studies/audiometry.types';
import { classifyHearingLoss, thresholdKey } from '@/shared/utils/audiometry';

export interface AudiogramEditorState {
  thresholds: AudiometryThreshold[];
  activeEar: Ear;
  activeRoute: ConductionRoute;
  isMaskedMode: boolean;
  isNoResponseMode: boolean;
}

export function useAudiogramEditor(initialThresholds: AudiometryThreshold[] = []) {
  const [thresholds, setThresholds] = useState<AudiometryThreshold[]>(initialThresholds);
  const [activeEar, setActiveEar] = useState<Ear>(Ear.RIGHT);
  const [activeRoute, setActiveRoute] = useState<ConductionRoute>(ConductionRoute.AIR);
  const [isMaskedMode, setIsMaskedMode] = useState(false);
  const [isNoResponseMode, setIsNoResponseMode] = useState(false);

  /** Una sola medición por (frecuencia, oído, vía): volver a marcar la reemplaza */
  const upsertThreshold = useCallback(
    (frequency: number, decibels: number) => {
      setThresholds((previous) => {
        const candidate: AudiometryThreshold = {
          frequency,
          ear: activeEar,
          route: activeRoute,
          decibels,
          isMasked: isMaskedMode,
          isNoResponse: isNoResponseMode,
        };
        const withoutExisting = previous.filter(
          (item) => thresholdKey(item) !== thresholdKey(candidate),
        );
        return [...withoutExisting, candidate].sort(
          (a, b) => a.frequency - b.frequency || a.ear.localeCompare(b.ear),
        );
      });
    },
    [activeEar, activeRoute, isMaskedMode, isNoResponseMode],
  );

  const removeThreshold = useCallback((target: AudiometryThreshold) => {
    setThresholds((previous) =>
      previous.filter((item) => thresholdKey(item) !== thresholdKey(target)),
    );
  }, []);

  const clearEar = useCallback((ear: Ear) => {
    setThresholds((previous) => previous.filter((item) => item.ear !== ear));
  }, []);

  const clearAll = useCallback(() => setThresholds([]), []);

  const rightClassification = useMemo(
    () => classifyHearingLoss(thresholds, Ear.RIGHT, HearingLossScale.WHO_2021),
    [thresholds],
  );
  const leftClassification = useMemo(
    () => classifyHearingLoss(thresholds, Ear.LEFT, HearingLossScale.WHO_2021),
    [thresholds],
  );

  const hasThresholds = thresholds.length > 0;

  return {
    thresholds,
    activeEar,
    setActiveEar,
    activeRoute,
    setActiveRoute,
    isMaskedMode,
    setIsMaskedMode,
    isNoResponseMode,
    setIsNoResponseMode,
    upsertThreshold,
    removeThreshold,
    clearEar,
    clearAll,
    rightClassification,
    leftClassification,
    hasThresholds,
  };
}
