import { useState, useCallback } from 'react';

export enum ConductionType {
  AIR = 'AIR',
  BONE = 'BONE',
}

export interface AudiogramPoint {
  hz: number;
  db: number;
  xPct: number;
  yPct: number;
  conduction: ConductionType;
}

const FREQUENCIES = [125, 250, 500, 1000, 2000, 4000, 8000];
const DB_MIN = -10;
const DB_MAX = 120;
const DB_STEP = 10;
const DB_LEVELS = Array.from(
  { length: (DB_MAX - DB_MIN) / DB_STEP + 1 },
  (_, i) => DB_MIN + i * DB_STEP,
);

function snapToGrid(xPct: number, yPct: number) {
  const stepX = 100 / (FREQUENCIES.length - 1);
  const stepY = 100 / (DB_LEVELS.length - 1);
  const snappedX = Math.round(xPct / stepX) * stepX;
  const snappedY = Math.round(yPct / stepY) * stepY;
  const hzIndex = Math.round(snappedX / stepX);
  const dbIndex = Math.round(snappedY / stepY);
  return {
    hz: FREQUENCIES[hzIndex] ?? null,
    db: DB_LEVELS[dbIndex] ?? null,
    xPct: snappedX,
    yPct: snappedY,
  };
}

export const useAudiogram = () => {
  const [points, setPoints] = useState<AudiogramPoint[]>([]);
  const [activeConduction, setActiveConduction] = useState<ConductionType>(ConductionType.AIR);

  const addPoint = useCallback(
    (event: React.PointerEvent<SVGElement>) => {
      const svg = event.currentTarget;
      const rect = svg.getBoundingClientRect();
      const xPct = ((event.clientX - rect.left) / rect.width) * 100;
      const yPct = ((event.clientY - rect.top) / rect.height) * 100;
      const snapped = snapToGrid(xPct, yPct);
      if (snapped.hz === null || snapped.db === null) return;

      setPoints((previous) => {
        const filtered = previous.filter(
          (point) => !(point.hz === snapped.hz && point.conduction === activeConduction),
        );
        return [
          ...filtered,
          {
            hz: snapped.hz!,
            db: snapped.db!,
            xPct: snapped.xPct,
            yPct: snapped.yPct,
            conduction: activeConduction,
          },
        ].sort((a, b) => a.hz - b.hz || a.conduction.localeCompare(b.conduction));
      });
    },
    [activeConduction],
  );

  const removePoint = useCallback((hz: number, conduction: ConductionType) => {
    setPoints((previous) => previous.filter((p) => !(p.hz === hz && p.conduction === conduction)));
  }, []);

  const loadFromData = useCallback((data: Record<string, string>) => {
    const loaded: AudiogramPoint[] = Object.entries(data)
      .filter(([, db]) => db !== '' && db !== undefined)
      .map(([hz, db]) => {
        const hzNum = parseInt(hz);
        const dbNum = parseInt(db);
        const hzIndex = FREQUENCIES.indexOf(hzNum);
        const dbIndex = DB_LEVELS.indexOf(dbNum);
        if (hzIndex === -1 || dbIndex === -1) return null;
        return {
          hz: hzNum,
          db: dbNum,
          xPct: (hzIndex / (FREQUENCIES.length - 1)) * 100,
          yPct: (dbIndex / (DB_LEVELS.length - 1)) * 100,
          conduction: ConductionType.AIR,
        };
      })
      .filter(Boolean) as AudiogramPoint[];
    setPoints(loaded);
  }, []);

  const clearAll = useCallback(() => setPoints([]), []);

  const clearConduction = useCallback((conduction: ConductionType) => {
    setPoints((previous) => previous.filter((p) => p.conduction !== conduction));
  }, []);

  return {
    points,
    activeConduction,
    setActiveConduction,
    addPoint,
    removePoint,
    loadFromData,
    clearAll,
    clearConduction,
    DB_MIN,
    DB_MAX,
    DB_LEVELS,
    FREQUENCIES,
  };
};
