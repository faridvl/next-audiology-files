import { useState, useCallback } from 'react';

export const useAudiogram = (frequencies: number[], dbs: number[]) => {
  const [points, setPoints] = useState<any[]>([]);

  // Evitar que un clic fuera de rango rompa el array
  const addPoint = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();

      // 1. Posición exacta relativa al div (sin importar scroll o zoom)
      const xPixels = e.clientX - rect.left;
      const yPixels = e.clientY - rect.top;

      // 2. Convertir a porcentaje para que sea responsive
      const xPct = (xPixels / rect.width) * 100;
      const yPct = (yPixels / rect.height) * 100;

      // 3. SNAPPING: Forzar el punto a la intersección más cercana de la grilla
      const stepX = 100 / (frequencies.length - 1);
      const stepY = 100 / (dbs.length - 1);

      const closestX = Math.round(xPct / stepX) * stepX;
      const closestY = Math.round(yPct / stepY) * stepY;

      // 4. Traducir de vuelta a valores clínicos para el objeto final
      const hzIndex = Math.round(closestX / stepX);
      const dbIndex = Math.round(closestY / stepY);
      if (frequencies[hzIndex] === undefined || dbs[dbIndex] === undefined) return;

      const newPoint = {
        hz: frequencies[hzIndex],
        db: dbs[dbIndex],
        x: closestX,
        y: closestY,
      };

      setPoints((prev) => {
        const filtered = prev.filter((p) => p.hz !== newPoint.hz);
        return [...filtered, newPoint].sort((a, b) => a.hz - b.hz);
      });
    },
    [frequencies, dbs],
  );

  return { points, addPoint, setPoints, clearPoints: () => setPoints([]) };
};
