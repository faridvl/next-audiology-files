import React from 'react';
import { User, Calendar, History, Clock, ChevronRight } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

interface PatientSummaryHeaderProps {
    onOpenFollowUp: () => void;
    onToggleHistory: () => void;
    showHistory: boolean;
}

export const PatientSummaryHeader: React.FC<PatientSummaryHeaderProps> = ({
    onOpenFollowUp,
    onToggleHistory,
    showHistory
}) => {
    // En V1 estos datos pueden venir de props o un context de paciente
    const patient = {
        name: "Carlos Alberto Rodríguez",
        age: "45 años",
        id: "12345678",
        lastVisit: "10 Feb 2026"
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm font-['Roboto']">

            {/* INFO PRINCIPAL */}
            <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <User size={32} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <Typography variant={TypographyVariant.SUBTITLE} className="font-black text-slate-900">
                            {patient.name}
                        </Typography>
                        <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-md uppercase">
                            ID: {patient.id}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-slate-400">
                        <span className="flex items-center gap-1.5 text-xs font-medium">
                            <Calendar size={14} className="text-blue-500" /> {patient.age}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium border-l pl-4 border-slate-100">
                            <Clock size={14} className="text-blue-500" /> Última visita: {patient.lastVisit}
                        </span>
                    </div>
                </div>
            </div>

            {/* ACCIONES RÁPIDAS */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenFollowUp}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md"
                >
                    <Calendar size={16} /> Programar Seguimiento
                </button>

                <button
                    onClick={onToggleHistory}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border ${showHistory
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                        }`}
                >
                    <History size={16} /> {showHistory ? 'Ocultar Historial' : 'Ver Historial'}
                </button>
            </div>
        </div>
    );
};