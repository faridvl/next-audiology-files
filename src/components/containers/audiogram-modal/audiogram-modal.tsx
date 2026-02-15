import { Button, ButtonVariant } from "@/components/common/button/button";
import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import { Trash2 } from "lucide-react";
import { useAudiogram } from "./use-audiogram";
import { useEffect } from "react";

export const AudiogramModal = ({ isOpen, onClose, onConfirm, side, initialPoints }: any) => {
    const frequencies = [125, 250, 500, 1000, 2000, 4000, 8000];
    const dbs = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

    const { points, addPoint, setPoints, clearPoints } = useAudiogram(frequencies, dbs);

    useEffect(() => {
        if (isOpen && initialPoints) {
            const mappedPoints = Object.entries(initialPoints)
                .filter(([_, db]) => db !== '' && db !== undefined)
                .map(([hz, db]) => {
                    const hzVal = parseInt(hz);
                    const dbVal = parseInt(db as string);
                    return {
                        hz: hzVal,
                        db: dbVal,
                        x: (frequencies.indexOf(hzVal) / (frequencies.length - 1)) * 100,
                        y: (dbs.indexOf(dbVal) / (dbs.length - 1)) * 100
                    };
                });
            setPoints(mappedPoints);
        }
    }, [isOpen, initialPoints]);

    if (!isOpen) return null;

    const color = side === 'OD' ? '#ef4444' : '#3b82f6';
    const Symbol = side === 'OD' ? '○' : '×';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Cabecera */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <Typography variant={TypographyVariant.SUBTITLE} className={side === 'OD' ? 'text-red-500' : 'text-blue-500'}>
                        Oído {side === 'OD' ? 'Derecho' : 'Izquierdo'} — {side === 'OD' ? 'Rojo (○)' : 'Azul (×)'}
                    </Typography>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl transition-colors">✕</button>
                </div>

                {/* Plano Clínico */}
                <div className="p-20 bg-white flex justify-center">
                    <div
                        className="relative w-full h-[400px] border-b-2 border-r-2 border-slate-300"
                        onClick={addPoint}
                        style={{
                            backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
                            backgroundSize: `${100 / (frequencies.length - 1)}% ${100 / (dbs.length - 1)}%`
                        }}
                    >
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                            {points.length > 1 && (
                                <path
                                    d={`M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                                    fill="none" stroke={color} strokeWidth="0.6"
                                />
                            )}
                        </svg>

                        {points.map((p, i) => (
                            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none" style={{ left: `${p.x}%`, top: `${p.y}%`, color }}>
                                <span className="text-2xl font-black leading-none">{Symbol}</span>
                                <span className="text-[9px] font-bold bg-white px-1 shadow-sm border border-slate-100">{p.db}dB</span>
                            </div>
                        ))}

                        {/* Labels */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {dbs.map(db => <span key={db} className="absolute -left-10 text-[10px] font-bold text-slate-400 -translate-y-1/2" style={{ top: `${(dbs.indexOf(db) / (dbs.length - 1)) * 100}%` }}>{db}</span>)}
                        </div>
                        <div className="absolute inset-0 flex justify-between pointer-events-none">
                            {frequencies.map(hz => <span key={hz} className="absolute -bottom-8 text-[10px] font-bold text-slate-400 -translate-x-1/2" style={{ left: `${(frequencies.indexOf(hz) / (frequencies.length - 1)) * 100}%` }}>{hz}</span>)}
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="p-8 bg-slate-50 flex justify-between items-center border-t border-slate-100">
                    <button onClick={clearPoints} className="text-red-500 text-xs font-black uppercase tracking-widest hover:text-red-700 transition-colors">
                        <div className="flex items-center gap-2"><Trash2 size={14} /> Reiniciar Plano</div>
                    </button>
                    <div className="flex gap-3">
                        <Button variant={ButtonVariant.CANCEL} onClick={onClose} text="Cancelar" />
                        <Button
                            variant={ButtonVariant.PRIMARY}
                            onClick={() => onConfirm(points)}
                            text="Confirmar Puntos"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};