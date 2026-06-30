import React, { useEffect } from 'react';
import { Maximize2 } from "lucide-react";
import { useAudiometryData } from "./use-audiometry-data";
import { AudiogramModal } from "../audiogram-modal/audiogram-modal";
import { AudiogramPoint } from "../audiogram-modal/use-audiogram";
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
                onConfirm={(points: AudiogramPoint[]) => {
                    syncFromModal(modalSide!, points);
                    setModalSide(null);
                }}
            />

            {/* Contenedor de inputs numéricos por oído */}
            <div className="bg-neutral-50 p-5 md:p-8 rounded-app-xl border border-neutral-100 space-y-6">
                {(['OI', 'OD'] as const).map((side) => (
                    <div key={side} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`h-3.5 w-3.5 rounded-full ${side === 'OD' ? 'bg-danger' : 'bg-primary'}`} />
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm">
                                    Oído {side === 'OD' ? 'Derecho' : 'Izquierdo'}
                                </Typography>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalSide(side)}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase text-neutral-500 hover:text-primary transition-all bg-white px-3 py-1.5 rounded-full shadow-sm border border-neutral-100 active:scale-95"
                            >
                                <Maximize2 size={12} /> Abrir Plano
                            </button>
                        </div>

                        {/* 7 columnas — una por frecuencia, sin overflow */}
                        <div className="grid grid-cols-7 gap-2">
                            {frequencies.map(hz => (
                                <div key={`${side}-${hz}`} className="flex flex-col gap-1.5">
                                    <span className="text-[8px] font-black text-neutral-400 text-center uppercase tracking-tight">
                                        {hz >= 1000 ? `${hz / 1000}k` : hz}
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="—"
                                        min="-10"
                                        max="120"
                                        value={auditData[side][hz] ?? ''}
                                        onChange={(e) => updateValue(side, hz, e.target.value)}
                                        className="w-full py-2.5 rounded-app-sm border-none text-center text-xs font-semibold shadow-inner bg-white focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                                    />
                                </div>
                            ))}
                        </div>

                        {side === 'OI' && <div className="border-t border-neutral-200 pt-2" />}
                    </div>
                ))}
            </div>
        </div>
    );
};