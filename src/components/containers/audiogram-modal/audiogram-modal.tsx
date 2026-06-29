import React, { useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useAudiogram, ConductionType, AudiogramPoint } from './use-audiogram';

// Símbolos estándar ANSI S3.21 / ISO 8253
const SYMBOLS: Record<'OD' | 'OI', Record<ConductionType, string>> = {
    OD: { [ConductionType.AIR]: '○', [ConductionType.BONE]: '[' },
    OI: { [ConductionType.AIR]: '×', [ConductionType.BONE]: ']' },
};

const SIDE_COLOR: Record<'OD' | 'OI', string> = {
    OD: '#EF4444',
    OI: '#3B82F6',
};

const CONDUCTION_LABELS: Record<ConductionType, string> = {
    [ConductionType.AIR]: 'Vía Aérea',
    [ConductionType.BONE]: 'Vía Ósea',
};

interface Props {
    isOpen: boolean;
    side: 'OD' | 'OI';
    initialPoints: Record<string, string>;
    onClose: () => void;
    onConfirm: (points: AudiogramPoint[]) => void;
}

export const AudiogramModal: React.FC<Props> = ({
    isOpen,
    side,
    initialPoints,
    onClose,
    onConfirm,
}) => {
    const {
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
    } = useAudiogram();

    useEffect(() => {
        if (isOpen) loadFromData(initialPoints ?? {});
    }, [isOpen, initialPoints, loadFromData]);

    if (!isOpen) return null;

    const color = SIDE_COLOR[side];
    const airPoints = points.filter((p) => p.conduction === ConductionType.AIR).sort((a, b) => a.hz - b.hz);
    const bonePoints = points.filter((p) => p.conduction === ConductionType.BONE).sort((a, b) => a.hz - b.hz);

    const makePath = (pts: AudiogramPoint[]) =>
        pts.length > 1
            ? `M ${pts.map((p) => `${p.xPct} ${p.yPct}`).join(' L ')}`
            : '';

    const normalBoundaryY = ((25 - DB_MIN) / (DB_MAX - DB_MIN)) * 100;

    return (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:p-4">
            <div className="bg-white w-full md:max-w-3xl rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
                style={{ maxHeight: '92dvh' }}>

                {/* CABECERA */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <Typography variant={TypographyVariant.SUBTITLE} className="text-sm" style={{ color }}>
                            Oído {side === 'OD' ? 'Derecho' : 'Izquierdo'}
                        </Typography>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* TOOLBAR: selector de vía + limpiar */}
                <div className="flex items-center justify-between gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                        {([ConductionType.AIR, ConductionType.BONE]).map((conduction) => (
                            <button
                                key={conduction}
                                onClick={() => setActiveConduction(conduction)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeConduction === conduction
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <span className="font-black text-sm" style={{ color: activeConduction === conduction ? 'white' : color }}>
                                    {SYMBOLS[side][conduction]}
                                </span>
                                {CONDUCTION_LABELS[conduction]}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => clearConduction(activeConduction)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-amber-50"
                        >
                            <Trash2 size={13} />
                            Limpiar {CONDUCTION_LABELS[activeConduction].toLowerCase()}
                        </button>
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                        >
                            Todo
                        </button>
                    </div>
                </div>

                {/* INSTRUCCIÓN */}
                <div className="px-5 py-2 shrink-0">
                    <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400">
                        Toca la grilla para agregar un punto de{' '}
                        <span className="font-bold" style={{ color }}>
                            {CONDUCTION_LABELS[activeConduction].toLowerCase()}
                        </span>
                        {' '}({SYMBOLS[side][activeConduction]}). Toca un símbolo existente para eliminarlo.
                    </Typography>
                </div>

                {/* PLANO — scroll-safe, tamaño fijo */}
                <div className="flex-1 overflow-hidden flex items-center justify-center px-4 py-2">
                    <div className="w-full" style={{ maxHeight: '52dvh' }}>
                        {/* contenedor con márgenes para labels */}
                        <div className="relative" style={{ paddingLeft: 36, paddingBottom: 24, paddingRight: 4 }}>

                            {/* SVG principal */}
                            <svg
                                viewBox="0 0 100 100"
                                preserveAspectRatio="xMidYMid meet"
                                className="w-full border border-slate-300 cursor-crosshair select-none touch-none"
                                style={{ aspectRatio: '7 / 5', display: 'block' }}
                                onPointerDown={addPoint}
                            >
                                {/* zona de normalidad */}
                                <rect
                                    x={0} y={0}
                                    width={100} height={normalBoundaryY}
                                    fill="#F0FDF4" opacity={0.6}
                                />

                                {/* línea de 25 dB */}
                                <line
                                    x1={0} y1={normalBoundaryY}
                                    x2={100} y2={normalBoundaryY}
                                    stroke="#86EFAC" strokeWidth={0.4} strokeDasharray="1 1"
                                />

                                {/* grilla Hz vertical */}
                                {FREQUENCIES.map((_, index) => {
                                    const xPct = (index / (FREQUENCIES.length - 1)) * 100;
                                    return (
                                        <line
                                            key={index}
                                            x1={xPct} y1={0} x2={xPct} y2={100}
                                            stroke="#E2E8F0" strokeWidth={0.4}
                                        />
                                    );
                                })}

                                {/* grilla dB horizontal */}
                                {DB_LEVELS.map((db, index) => {
                                    const yPct = (index / (DB_LEVELS.length - 1)) * 100;
                                    return (
                                        <line
                                            key={db}
                                            x1={0} y1={yPct} x2={100} y2={yPct}
                                            stroke="#E2E8F0" strokeWidth={0.3}
                                        />
                                    );
                                })}

                                {/* curva vía aérea */}
                                {makePath(airPoints) && (
                                    <path
                                        d={makePath(airPoints)}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth={0.7}
                                        strokeLinejoin="round"
                                    />
                                )}

                                {/* curva vía ósea — discontinua */}
                                {makePath(bonePoints) && (
                                    <path
                                        d={makePath(bonePoints)}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth={0.7}
                                        strokeDasharray="2 1"
                                        strokeLinejoin="round"
                                    />
                                )}

                                {/* Puntos de vía aérea */}
                                {airPoints.map((point) => (
                                    <text
                                        key={`air-${point.hz}`}
                                        x={point.xPct}
                                        y={point.yPct}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize={10}
                                        fill={color}
                                        fontWeight="bold"
                                        style={{ cursor: 'pointer', pointerEvents: 'all' }}
                                        onPointerDown={(event) => {
                                            event.stopPropagation();
                                            removePoint(point.hz, ConductionType.AIR);
                                        }}
                                    >
                                        {SYMBOLS[side][ConductionType.AIR]}
                                    </text>
                                ))}

                                {/* Puntos de vía ósea */}
                                {bonePoints.map((point) => (
                                    <text
                                        key={`bone-${point.hz}`}
                                        x={point.xPct}
                                        y={point.yPct}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize={10}
                                        fill={color}
                                        fontWeight="bold"
                                        style={{ cursor: 'pointer', pointerEvents: 'all' }}
                                        onPointerDown={(event) => {
                                            event.stopPropagation();
                                            removePoint(point.hz, ConductionType.BONE);
                                        }}
                                    >
                                        {SYMBOLS[side][ConductionType.BONE]}
                                    </text>
                                ))}
                            </svg>

                            {/* Labels dB — eje Y */}
                            <div className="absolute top-0 left-0 pointer-events-none" style={{ width: 32 }}>
                                {DB_LEVELS.map((db, index) => {
                                    const yPct = (index / (DB_LEVELS.length - 1)) * 100;
                                    return (
                                        <span
                                            key={db}
                                            className="absolute text-[8px] font-bold text-slate-400 text-right"
                                            style={{
                                                right: 4,
                                                top: `calc(${yPct}% * (100% / 100))`,
                                                transform: 'translateY(-50%)',
                                                lineHeight: 1,
                                            }}
                                        >
                                            {db}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Labels Hz — eje X */}
                            <div className="absolute left-0 right-0 bottom-0 pointer-events-none flex justify-between"
                                style={{ paddingLeft: 36, paddingRight: 4, height: 20 }}>
                                {FREQUENCIES.map((hz) => (
                                    <span
                                        key={hz}
                                        className="text-[8px] font-bold text-slate-400 text-center"
                                        style={{ width: 0, overflow: 'visible', whiteSpace: 'nowrap' }}
                                    >
                                        {hz >= 1000 ? `${hz / 1000}k` : hz}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* LEYENDA */}
                <div className="px-5 py-2 flex items-center gap-5 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black" style={{ color }}>○ ×</span>
                        <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400">Vía aérea (línea continua)</Typography>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black" style={{ color }}>[ ]</span>
                        <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400">Vía ósea (línea discontinua)</Typography>
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                        <div className="w-3 h-2 rounded-sm bg-emerald-50 border border-emerald-200" />
                        <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400">Normal ≤25 dB</Typography>
                    </div>
                </div>

                {/* ACCIONES */}
                <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                    <Button variant={ButtonVariant.CANCEL} onClick={onClose} text="Cancelar" />
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        onClick={() => onConfirm(points)}
                        text="Confirmar"
                    />
                </div>
            </div>
        </div>
    );
};
