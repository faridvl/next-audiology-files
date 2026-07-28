import React from 'react';
import { AudiometrySymbol } from '@/shared/utils/audiometry';

interface Props {
  symbol: AudiometrySymbol;
  /** Centro del símbolo, en unidades del viewBox */
  x: number;
  y: number;
  color: string;
  /** Radio nominal en unidades del viewBox */
  size: number;
  /** Flecha hacia abajo: no se alcanzó umbral al máximo de salida */
  isNoResponse?: boolean;
}

/**
 * Símbolos audiométricos ASHA 1990 dibujados como FORMAS, no como texto.
 * Dibujarlos con caracteres (○ × [ ]) depende de la fuente, no centra bien y
 * no escala de forma predecible — además ASHA no exige color, así que la forma
 * debe ser suficiente por sí sola (impresión b/n, daltonismo).
 */
export const AudiogramSymbol: React.FC<Props> = ({ symbol, x, y, color, size, isNoResponse = false }) => {
  const strokeWidth = size * 0.28;
  const common = {
    stroke: color,
    strokeWidth,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
  };

  const renderShape = () => {
    switch (symbol) {
      // OD aéreo sin enmascarar — círculo
      case AudiometrySymbol.AIR_RIGHT_UNMASKED:
        return <circle cx={x} cy={y} r={size} {...common} />;

      // OI aéreo sin enmascarar — aspa
      case AudiometrySymbol.AIR_LEFT_UNMASKED:
        return (
          <>
            <line x1={x - size} y1={y - size} x2={x + size} y2={y + size} {...common} />
            <line x1={x + size} y1={y - size} x2={x - size} y2={y + size} {...common} />
          </>
        );

      // OD aéreo enmascarado — triángulo
      case AudiometrySymbol.AIR_RIGHT_MASKED:
        return (
          <polygon
            points={`${x},${y - size} ${x + size},${y + size} ${x - size},${y + size}`}
            {...common}
          />
        );

      // OI aéreo enmascarado — cuadrado
      case AudiometrySymbol.AIR_LEFT_MASKED:
        return (
          <rect x={x - size} y={y - size} width={size * 2} height={size * 2} {...common} />
        );

      // OD óseo sin enmascarar — "<"
      case AudiometrySymbol.BONE_RIGHT_UNMASKED:
        return (
          <polyline points={`${x + size},${y - size} ${x - size},${y} ${x + size},${y + size}`} {...common} />
        );

      // OI óseo sin enmascarar — ">"
      case AudiometrySymbol.BONE_LEFT_UNMASKED:
        return (
          <polyline points={`${x - size},${y - size} ${x + size},${y} ${x - size},${y + size}`} {...common} />
        );

      // OD óseo enmascarado — "["
      case AudiometrySymbol.BONE_RIGHT_MASKED:
        return (
          <polyline
            points={`${x + size},${y - size} ${x - size},${y - size} ${x - size},${y + size} ${x + size},${y + size}`}
            {...common}
          />
        );

      // OI óseo enmascarado — "]"
      case AudiometrySymbol.BONE_LEFT_MASKED:
        return (
          <polyline
            points={`${x - size},${y - size} ${x + size},${y - size} ${x + size},${y + size} ${x - size},${y + size}`}
            {...common}
          />
        );
    }
  };

  return (
    <g>
      {renderShape()}
      {isNoResponse && (
        <>
          <line x1={x} y1={y + size} x2={x} y2={y + size * 2.6} {...common} />
          <polyline
            points={`${x - size * 0.55},${y + size * 1.9} ${x},${y + size * 2.6} ${x + size * 0.55},${y + size * 1.9}`}
            {...common}
          />
        </>
      )}
    </g>
  );
};
