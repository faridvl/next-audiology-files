import React, { useEffect } from 'react';
import { Maximize2, Volume2, Activity } from "lucide-react";
import { useAudiometryData } from "./use-audiometry-data";
import { AudiogramModal } from "../audiogram-modal/audiogram-modal";
import { AudiogramPoint } from "../audiogram-modal/use-audiogram";
import { Typography, TypographyVariant } from "@/components/common/typography/typography";

interface AudiometryCaptureProps {
    onChange?: (data: { OD: Record<number, string>; OI: Record<number, string> }) => void;
}

const frequencies = [125, 250, 500, 1000, 2000, 4000, 8000];

function formatFrequency(hz: number): string {
    return hz >= 1000 ? `${hz / 1000}k` : String(hz);
}

const earConfig = {
    OD: {
        label: 'Oído Derecho',
        shortLabel: 'OD',
        color: 'text-danger',
        dotColor: 'bg-danger',
        ringColor: 'focus:ring-danger/30',
        borderColor: 'border-danger/20',
        bgColor: 'bg-danger/5',
        headerBg: 'bg-danger/5 border-danger/20',
    },
    OI: {
        label: 'Oído Izquierdo',
        shortLabel: 'OI',
        color: 'text-primary',
        dotColor: 'bg-primary',
        ringColor: 'focus:ring-primary/30',
        borderColor: 'border-primary/20',
        bgColor: 'bg-primary/5',
        headerBg: 'bg-primary/5 border-primary/20',
    },
} as const;

export const AudiometryCapture: React.FC<AudiometryCaptureProps> = ({ onChange }) => {
    const {
        modalSide,
        setModalSide,
        auditData,
        updateValue,
        syncFromModal
    } = useAudiometryData();

    useEffect(() => {
        if (onChange) {
            onChange(auditData);
        }
    }, [auditData, onChange]);

    return (
        <div className="space-y-0">
            <AudiogramModal
                isOpen={!!modalSide}
                side={modalSide || 'OD'}
                initialPoints={auditData[modalSide || 'OD']}
                onClose={() => setModalSide(null)}
                onConfirm={(points: AudiogramPoint[]) => {
                    syncFromModal(modalSide!, points);
                    setModalSide(null);
                }}
            />

            {/* Leyenda de frecuencias — encabezado compartido */}
            <div className="bg-neutral-50 border border-neutral-100 rounded-t-app-xl px-6 pt-5 pb-3">
                <div className="flex items-center gap-2 mb-4">
                    <Activity size={15} className="text-neutral-400" />
                    <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                        Audiometría tonal — Hz
                    </Typography>
                </div>
                <div className="grid grid-cols-7 gap-2 pl-0">
                    {frequencies.map((hz) => (
                        <div key={hz} className="flex flex-col items-center gap-1">
                            <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black text-neutral-400 tracking-tight text-center">
                                {formatFrequency(hz)}
                            </Typography>
                            <div className="w-px h-3 bg-neutral-200" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Oídos */}
            {(['OD', 'OI'] as const).map((side, index) => {
                const config = earConfig[side];
                const isLast = index === 1;
                return (
                    <div
                        key={side}
                        className={`border border-t-0 border-neutral-100 bg-white px-6 py-5 space-y-4 ${isLast ? 'rounded-b-app-xl' : ''}`}
                    >
                        {/* Header del oído */}
                        <div className={`flex items-center justify-between px-4 py-3 rounded-app-md border ${config.headerBg}`}>
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-app-sm ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
                                    <Volume2 size={14} className={config.color} />
                                </div>
                                <div>
                                    <Typography variant={TypographyVariant.BODY_BOLD} className={`text-sm font-black ${config.color}`}>
                                        {config.label}
                                    </Typography>
                                    <Typography variant={TypographyVariant.CAPTION} className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
                                        dB HL · Via aérea
                                    </Typography>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalSide(side)}
                                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-wide px-3 py-2 rounded-app-sm bg-white border border-neutral-200 hover:border-neutral-300 shadow-sm transition-all active:scale-95 ${config.color}`}
                            >
                                <Maximize2 size={12} />
                                Plano
                            </button>
                        </div>

                        {/* Inputs de frecuencia */}
                        <div className="grid grid-cols-7 gap-2">
                            {frequencies.map((hz) => {
                                const value = auditData[side][hz] ?? '';
                                const filled = value !== '';
                                return (
                                    <div key={`${side}-${hz}`} className="flex flex-col items-center gap-1.5">
                                        <input
                                            type="number"
                                            placeholder="—"
                                            min="-10"
                                            max="120"
                                            value={value}
                                            onChange={(e) => updateValue(side, hz, e.target.value)}
                                            className={`w-full py-3 rounded-app-md border text-center text-sm font-bold outline-none transition-all focus:ring-2 ${config.ringColor} ${
                                                filled
                                                    ? `${config.borderColor} ${config.bgColor} ${config.color}`
                                                    : 'border-neutral-100 bg-neutral-50 text-neutral-400 hover:border-neutral-200'
                                            }`}
                                        />
                                        {filled && (
                                            <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor} opacity-60`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Footer informativo */}
            <div className="mt-3 flex items-center gap-4 px-1">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-danger" />
                    <Typography variant={TypographyVariant.CAPTION} className="text-[9px] text-neutral-400">OD = Oído derecho</Typography>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <Typography variant={TypographyVariant.CAPTION} className="text-[9px] text-neutral-400">OI = Oído izquierdo</Typography>
                </div>
                <Typography variant={TypographyVariant.CAPTION} className="text-[9px] text-neutral-300 ml-auto">
                    Valores en dB HL (−10 a 120)
                </Typography>
            </div>
        </div>
    );
};
