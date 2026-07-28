import React, { useMemo, useRef } from 'react';
import {
  AUDIOMETRY_DB_MAX,
  AUDIOMETRY_DB_MIN,
  AUDIOMETRY_FREQUENCIES,
  AUDIOMETRY_OCTAVE_FREQUENCIES,
  AudiometryThreshold,
  ConductionRoute,
  Ear,
} from '@/types/studies/audiometry.types';
import {
  EAR_COLOR,
  decibelsToPercent,
  frequencyToPercent,
  percentToDecibels,
  percentToFrequency,
  resolveSymbol,
  thresholdKey,
} from '@/shared/utils/audiometry';
import { AudiogramSymbol } from './audiogram-symbol';

// El viewBox tiene márgenes para los ejes DENTRO del SVG. Esto es lo que arregla
// los clicks: antes el viewBox era 0 0 100 100 con aspect-ratio 7/5, así que
// preserveAspectRatio="meet" letterboxeaba y las coordenadas del puntero no
// correspondían a las del gráfico. Ahora viewBox y aspecto coinciden y la
// conversión puntero→dato usa la misma caja de trazado.
const VIEW_WIDTH = 760;
const VIEW_HEIGHT = 560;
const MARGIN = { top: 24, right: 20, bottom: 44, left: 52 };
const PLOT_WIDTH = VIEW_WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = VIEW_HEIGHT - MARGIN.top - MARGIN.bottom;

const MIN_HZ = AUDIOMETRY_FREQUENCIES[0];
const MAX_HZ = AUDIOMETRY_FREQUENCIES[AUDIOMETRY_FREQUENCIES.length - 1];

const DB_GRID_STEP = 10;
const DB_GRID_LEVELS = Array.from(
  { length: (AUDIOMETRY_DB_MAX - AUDIOMETRY_DB_MIN) / DB_GRID_STEP + 1 },
  (_, index) => AUDIOMETRY_DB_MIN + index * DB_GRID_STEP,
);

/** Corte de normalidad WHO 2021 */
const NORMAL_LIMIT_DB = 20;

export function plotX(frequency: number): number {
  return MARGIN.left + (frequencyToPercent(frequency, MIN_HZ, MAX_HZ) / 100) * PLOT_WIDTH;
}

export function plotY(decibels: number): number {
  return MARGIN.top + (decibelsToPercent(decibels) / 100) * PLOT_HEIGHT;
}

export interface AudiogramPointerResult {
  frequency: number;
  decibels: number;
}

interface Props {
  thresholds: AudiometryThreshold[];
  /** Modo lectura: sin interacción, sin cursor de cruz */
  isReadOnly?: boolean;
  /** Oculta la grilla densa y los rótulos interoctava (tarjetas pequeñas) */
  isCompact?: boolean;
  onPlotClick?: (result: AudiogramPointerResult) => void;
  onThresholdClick?: (threshold: AudiometryThreshold) => void;
}

export const AudiogramChart: React.FC<Props> = ({
  thresholds,
  isReadOnly = false,
  isCompact = false,
  onPlotClick,
  onThresholdClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const labelledFrequencies = isCompact
    ? AUDIOMETRY_OCTAVE_FREQUENCIES
    : AUDIOMETRY_FREQUENCIES;

  // Curvas: una por oído y vía. Los "sin respuesta" cortan la línea — unir un
  // umbral real con uno no alcanzado dibujaría una pendiente que no se midió.
  const curves = useMemo(() => {
    const result: Array<{ key: string; path: string; color: string; route: ConductionRoute }> = [];
    for (const ear of [Ear.RIGHT, Ear.LEFT]) {
      for (const route of [ConductionRoute.AIR, ConductionRoute.BONE]) {
        const series = thresholds
          .filter((item) => item.ear === ear && item.route === route && !item.isNoResponse)
          .sort((a, b) => a.frequency - b.frequency);
        if (series.length < 2) continue;
        result.push({
          key: `${ear}-${route}`,
          color: EAR_COLOR[ear],
          route,
          path: series
            .map((item, index) => `${index === 0 ? 'M' : 'L'} ${plotX(item.frequency)} ${plotY(item.decibels)}`)
            .join(' '),
        });
      }
    }
    return result;
  }, [thresholds]);

  function resolvePointer(event: React.PointerEvent<SVGSVGElement>): AudiogramPointerResult | null {
    const svg = svgRef.current;
    if (!svg) return null;

    // Conversión por matriz: robusta ante cualquier escala/aspecto del SVG,
    // a diferencia de calcular porcentajes sobre getBoundingClientRect.
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const screenToSvg = svg.getScreenCTM();
    if (!screenToSvg) return null;
    const local = point.matrixTransform(screenToSvg.inverse());

    const xPercent = ((local.x - MARGIN.left) / PLOT_WIDTH) * 100;
    const yPercent = ((local.y - MARGIN.top) / PLOT_HEIGHT) * 100;
    if (xPercent < -2 || xPercent > 102 || yPercent < -2 || yPercent > 102) return null;

    const rawFrequency = percentToFrequency(Math.min(100, Math.max(0, xPercent)), MIN_HZ, MAX_HZ);
    const frequency = AUDIOMETRY_FREQUENCIES.reduce((closest, candidate) =>
      Math.abs(Math.log2(candidate) - Math.log2(rawFrequency)) <
      Math.abs(Math.log2(closest) - Math.log2(rawFrequency))
        ? candidate
        : closest,
    );

    const rawDecibels = percentToDecibels(Math.min(100, Math.max(0, yPercent)));
    const decibels = Math.min(
      AUDIOMETRY_DB_MAX,
      Math.max(AUDIOMETRY_DB_MIN, Math.round(rawDecibels / 5) * 5),
    );

    return { frequency, decibels };
  }

  const symbolSize = isCompact ? 7 : 9;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className={`w-full h-auto select-none ${isReadOnly ? '' : 'cursor-crosshair touch-none'}`}
      role="img"
      aria-label="Audiograma tonal"
      onPointerDown={
        isReadOnly || !onPlotClick
          ? undefined
          : (event) => {
              const resolved = resolvePointer(event);
              if (resolved) onPlotClick(resolved);
            }
      }
    >
      {/* Zona de audición normal (≤20 dB, WHO 2021) */}
      <rect
        x={MARGIN.left}
        y={plotY(AUDIOMETRY_DB_MIN)}
        width={PLOT_WIDTH}
        height={plotY(NORMAL_LIMIT_DB) - plotY(AUDIOMETRY_DB_MIN)}
        fill="#F0FDF4"
      />

      {/* Grilla dB */}
      {DB_GRID_LEVELS.map((decibels) => (
        <g key={`db-${decibels}`}>
          <line
            x1={MARGIN.left}
            y1={plotY(decibels)}
            x2={MARGIN.left + PLOT_WIDTH}
            y2={plotY(decibels)}
            stroke={decibels === NORMAL_LIMIT_DB ? '#86EFAC' : '#E2E8F0'}
            strokeWidth={decibels === NORMAL_LIMIT_DB ? 1.5 : 1}
            strokeDasharray={decibels === NORMAL_LIMIT_DB ? '6 4' : undefined}
          />
          <text
            x={MARGIN.left - 10}
            y={plotY(decibels)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={13}
            fill="#94A3B8"
            fontWeight={600}
          >
            {decibels}
          </text>
        </g>
      ))}

      {/* Grilla Hz — octavas marcadas, interoctavas tenues */}
      {AUDIOMETRY_FREQUENCIES.map((frequency) => {
        const isOctave = AUDIOMETRY_OCTAVE_FREQUENCIES.includes(frequency);
        return (
          <line
            key={`hz-${frequency}`}
            x1={plotX(frequency)}
            y1={MARGIN.top}
            x2={plotX(frequency)}
            y2={MARGIN.top + PLOT_HEIGHT}
            stroke={isOctave ? '#CBD5E1' : '#EEF2F6'}
            strokeWidth={1}
          />
        );
      })}

      {/* Rótulos Hz */}
      {labelledFrequencies.map((frequency) => (
        <text
          key={`hz-label-${frequency}`}
          x={plotX(frequency)}
          y={MARGIN.top + PLOT_HEIGHT + 20}
          textAnchor="middle"
          fontSize={13}
          fill="#94A3B8"
          fontWeight={600}
        >
          {frequency >= 1000 ? `${frequency / 1000}k` : frequency}
        </text>
      ))}

      {/* Títulos de eje */}
      <text
        x={MARGIN.left + PLOT_WIDTH / 2}
        y={VIEW_HEIGHT - 8}
        textAnchor="middle"
        fontSize={12}
        fill="#64748B"
        fontWeight={700}
      >
        Frecuencia (Hz)
      </text>
      <text
        x={14}
        y={MARGIN.top + PLOT_HEIGHT / 2}
        textAnchor="middle"
        fontSize={12}
        fill="#64748B"
        fontWeight={700}
        transform={`rotate(-90 14 ${MARGIN.top + PLOT_HEIGHT / 2})`}
      >
        Umbral (dB HL)
      </text>

      {/* Marco */}
      <rect
        x={MARGIN.left}
        y={MARGIN.top}
        width={PLOT_WIDTH}
        height={PLOT_HEIGHT}
        fill="none"
        stroke="#94A3B8"
        strokeWidth={1.5}
      />

      {/* Curvas — ósea discontinua, aérea continua */}
      {curves.map((curve) => (
        <path
          key={curve.key}
          d={curve.path}
          fill="none"
          stroke={curve.color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={curve.route === ConductionRoute.BONE ? '7 5' : undefined}
          pointerEvents="none"
        />
      ))}

      {/* Símbolos */}
      {thresholds.map((threshold) => (
        <g
          key={thresholdKey(threshold)}
          style={{ cursor: isReadOnly || !onThresholdClick ? 'default' : 'pointer' }}
          onPointerDown={
            isReadOnly || !onThresholdClick
              ? undefined
              : (event) => {
                  event.stopPropagation();
                  onThresholdClick(threshold);
                }
          }
        >
          {/* Área de toque generosa — 44px reales en móvil */}
          {!isReadOnly && (
            <circle
              cx={plotX(threshold.frequency)}
              cy={plotY(threshold.decibels)}
              r={symbolSize * 2.2}
              fill="transparent"
            />
          )}
          <AudiogramSymbol
            symbol={resolveSymbol(threshold.ear, threshold.route, threshold.isMasked)}
            x={plotX(threshold.frequency)}
            y={plotY(threshold.decibels)}
            color={EAR_COLOR[threshold.ear]}
            size={symbolSize}
            isNoResponse={threshold.isNoResponse}
          />
        </g>
      ))}
    </svg>
  );
};
