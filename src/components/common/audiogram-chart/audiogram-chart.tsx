import React from 'react';
import { AudiogramData } from '@/types/medical-controls/medical-control.types';

const FREQUENCIES = [125, 250, 500, 1000, 2000, 4000, 8000];
const DB_MIN = -10;
const DB_MAX = 120;
const DB_STEP = 10;
const DB_LEVELS = Array.from({ length: (DB_MAX - DB_MIN) / DB_STEP + 1 }, (_, i) => DB_MIN + i * DB_STEP);

const HEARING_LOSS_GRADES = [
    { label: 'Normal', range: [DB_MIN, 25], color: '#10B981' },
    { label: 'Leve', range: [25, 40], color: '#84CC16' },
    { label: 'Moderada', range: [40, 55], color: '#F59E0B' },
    { label: 'Moderada-severa', range: [55, 70], color: '#F97316' },
    { label: 'Severa', range: [70, 90], color: '#EF4444' },
    { label: 'Profunda', range: [90, DB_MAX + 1], color: '#7C3AED' },
];

export function classifyHearingLoss(audiogram: AudiogramData, side: 'OD' | 'OI'): { label: string; color: string; pta: number } {
    const speechFreqs = [500, 1000, 2000];
    const values = speechFreqs
        .map((hz) => parseFloat(audiogram[side]?.[hz] ?? ''))
        .filter((value) => !isNaN(value));

    if (values.length === 0) return { label: 'Sin datos', color: '#94A3B8', pta: 0 };

    const pta = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
    const grade = HEARING_LOSS_GRADES.find(({ range }) => pta >= range[0] && pta < range[1]);
    return { label: grade?.label ?? 'Profunda', color: grade?.color ?? '#7C3AED', pta };
}

function toPercent(value: number, min: number, max: number) {
    return ((value - min) / (max - min)) * 100;
}

interface SideChartProps {
    data: Record<string, string>;
    side: 'OD' | 'OI';
    compact?: boolean;
}

const SideChart: React.FC<SideChartProps> = ({ data, side, compact = false }) => {
    const color = side === 'OD' ? '#EF4444' : '#3B82F6';
    const symbol = side === 'OD' ? '○' : '×';
    const label = side === 'OD' ? 'OD — Derecho' : 'OI — Izquierdo';

    const points = FREQUENCIES
        .map((hz) => {
            const db = parseFloat(data?.[hz] ?? '');
            if (isNaN(db)) return null;
            return {
                hz,
                db,
                xPct: toPercent(FREQUENCIES.indexOf(hz), 0, FREQUENCIES.length - 1),
                yPct: toPercent(db, DB_MIN, DB_MAX),
            };
        })
        .filter(Boolean) as { hz: number; db: number; xPct: number; yPct: number }[];

    const pathD = points.length > 1
        ? `M ${points.map((p) => `${p.xPct} ${p.yPct}`).join(' L ')}`
        : '';

    const symbolSize = compact ? 10 : 14;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>
                    {label}
                </span>
            </div>

            <div className="relative w-full" style={{ paddingLeft: compact ? 28 : 36, paddingBottom: compact ? 20 : 24 }}>
                {/* Zona de normalidad */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        left: compact ? 28 : 36,
                        right: 0,
                        top: 0,
                        height: `${toPercent(25, DB_MIN, DB_MAX)}%`,
                        backgroundColor: '#F0FDF4',
                    }}
                />

                {/* Grid SVG */}
                <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full border border-slate-200 bg-white"
                    style={{ aspectRatio: '7/5' }}
                >
                    {/* líneas horizontales de dB */}
                    {DB_LEVELS.map((db) => (
                        <line
                            key={db}
                            x1={0} y1={toPercent(db, DB_MIN, DB_MAX)}
                            x2={100} y2={toPercent(db, DB_MIN, DB_MAX)}
                            stroke={db === 25 ? '#86EFAC' : '#F1F5F9'}
                            strokeWidth={db === 25 ? 0.4 : 0.3}
                        />
                    ))}
                    {/* líneas verticales de Hz */}
                    {FREQUENCIES.map((_, index) => (
                        <line
                            key={index}
                            x1={toPercent(index, 0, FREQUENCIES.length - 1)}
                            y1={0}
                            x2={toPercent(index, 0, FREQUENCIES.length - 1)}
                            y2={100}
                            stroke="#F1F5F9"
                            strokeWidth={0.3}
                        />
                    ))}

                    {/* curva */}
                    {pathD && (
                        <path d={pathD} fill="none" stroke={color} strokeWidth={0.8} strokeLinejoin="round" />
                    )}

                    {/* símbolos */}
                    {points.map((point) => (
                        <text
                            key={point.hz}
                            x={point.xPct}
                            y={point.yPct}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={symbolSize}
                            fill={color}
                            fontWeight="bold"
                        >
                            {symbol}
                        </text>
                    ))}
                </svg>

                {/* labels dB — eje Y */}
                <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between pointer-events-none"
                    style={{ width: compact ? 24 : 32 }}>
                    {DB_LEVELS.filter((_, i) => i % 2 === 0).map((db) => (
                        <span
                            key={db}
                            className="text-[7px] font-bold text-slate-400 text-right pr-1 leading-none"
                            style={{ position: 'absolute', top: `${toPercent(db, DB_MIN, DB_MAX)}%`, transform: 'translateY(-50%)' }}
                        >
                            {db}
                        </span>
                    ))}
                </div>

                {/* labels Hz — eje X */}
                <div className="absolute left-0 right-0 flex justify-between pointer-events-none"
                    style={{ bottom: 0, paddingLeft: compact ? 28 : 36 }}>
                    {FREQUENCIES.map((hz) => (
                        <span key={hz} className="text-[7px] font-bold text-slate-400 leading-none">
                            {hz >= 1000 ? `${hz / 1000}k` : hz}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface AudiogramChartProps {
    audiogram: AudiogramData;
    compact?: boolean;
    showClassification?: boolean;
}

export const AudiogramChart: React.FC<AudiogramChartProps> = ({
    audiogram,
    compact = false,
    showClassification = true,
}) => {
    const odClass = classifyHearingLoss(audiogram, 'OD');
    const oiClass = classifyHearingLoss(audiogram, 'OI');

    const hasOD = Object.values(audiogram.OD ?? {}).some((v) => v !== '');
    const hasOI = Object.values(audiogram.OI ?? {}).some((v) => v !== '');

    if (!hasOD && !hasOI) return null;

    return (
        <div className="space-y-4">
            {showClassification && (
                <div className="grid grid-cols-2 gap-3">
                    {(['OD', 'OI'] as const).map((side) => {
                        const classification = side === 'OD' ? odClass : oiClass;
                        const hasData = side === 'OD' ? hasOD : hasOI;
                        if (!hasData) return null;
                        return (
                            <div
                                key={side}
                                className="flex items-center gap-3 p-3 rounded-xl border"
                                style={{ borderColor: `${classification.color}30`, backgroundColor: `${classification.color}08` }}
                            >
                                <div
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: side === 'OD' ? '#EF4444' : '#3B82F6' }}
                                />
                                <div className="min-w-0">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        {side === 'OD' ? 'Oído Derecho' : 'Oído Izquierdo'}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span
                                            className="text-xs font-black"
                                            style={{ color: classification.color }}
                                        >
                                            {classification.label}
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-medium">
                                            PTA {classification.pta} dB
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={`grid gap-6 ${hasOD && hasOI ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {hasOD && <SideChart data={audiogram.OD} side="OD" compact={compact} />}
                {hasOI && <SideChart data={audiogram.OI} side="OI" compact={compact} />}
            </div>

            {/* leyenda de zona normal */}
            <div className="flex items-center gap-2 text-[9px] text-slate-400 font-medium">
                <div className="w-4 h-2 rounded-sm bg-emerald-50 border border-emerald-200" />
                Zona de audición normal (≤25 dB HL)
            </div>
        </div>
    );
};
