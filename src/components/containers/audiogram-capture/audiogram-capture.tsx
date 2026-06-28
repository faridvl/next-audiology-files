import React, { useEffect } from 'react';
import { Maximize2 } from "lucide-react";
import { useAudiometryData } from "./use-audiometry-data";
import { AudiogramModal } from "../audiogram-modal/audiogram-modal";
import { Typography, TypographyVariant } from "@/components/common/typography/typography";

interface AudiometryCaptureProps {
    onChange?: (data: { OD: Record<number, string>; OI: Record<number, string> }) => void;
}

export const AudiometryCapture: React.FC<AudiometryCaptureProps> = ({ onChange }) => {
    const frequencies = [125, 250, 500, 1000, 2000, 4000, 8000];

    const {
        modalSide,
        setModalSide,
        auditData,
        updateValue,
        syncFromModal
    } = useAudiometryData();

    // Sincronización con el formulario padre cada vez que cambian los datos locales
    useEffect(() => {
        if (onChange) {
            onChange(auditData);
        }
    }, [auditData, onChange]);

    return (
        <div className="space-y-6">
            {/* Modal para captura visual mediante gráfico */}
            <AudiogramModal
                isOpen={!!modalSide}
                side={modalSide || 'OD'}
                initialPoints={auditData[modalSide || 'OD']}
                onClose={() => setModalSide(null)}
                onConfirm={(points: { hz: number; db: number }[]) => {
                    syncFromModal(modalSide!, points);
                    setModalSide(null);
                }}
            />

            {/* Contenedor de inputs numéricos por oído */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-slate-50 p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100">
                {(['OI', 'OD'] as const).map((side) => (
                    <div
                        key={side}
                        className={`space-y-3 md:space-y-4 ${side === 'OD' ? 'md:border-l border-slate-200 md:pl-8 border-t pt-5 md:border-t-0 md:pt-0' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`h-3.5 w-3.5 md:h-4 md:w-4 rounded-full ${side === 'OD' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm md:text-base">
                                    Oído {side === 'OD' ? 'Derecho' : 'Izquierdo'}
                                </Typography>
                            </div>

                            <button
                                type="button"
                                onClick={() => setModalSide(side)}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-blue-600 transition-all bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 active:scale-95"
                            >
                                <Maximize2 size={12} /> Abrir Plano
                            </button>
                        </div>

                        {/* Grid de Frecuencias — 4 cols en mobile, 4 en desktop */}
                        <div className="grid grid-cols-4 gap-2 md:gap-3">
                            {frequencies.map(hz => (
                                <div key={`${side}-${hz}`} className="flex flex-col gap-1">
                                    <span className="text-[8px] md:text-[9px] font-black text-slate-400 text-center uppercase">
                                        {hz >= 1000 ? `${hz / 1000}k` : hz}Hz
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="dB"
                                        min="-10"
                                        max="120"
                                        value={auditData[side][hz] ?? ''}
                                        onChange={(e) => updateValue(side, hz, e.target.value)}
                                        className="w-full p-2 md:p-2.5 rounded-xl md:rounded-2xl border-none text-center text-xs md:text-sm shadow-inner bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};