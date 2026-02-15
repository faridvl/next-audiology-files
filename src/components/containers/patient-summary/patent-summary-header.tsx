import React from 'react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import {
    User, History, Calendar, Phone, AlertCircle,
    Stethoscope, Pill, FileText, ChevronRight
} from 'lucide-react';

interface PatientHeaderProps {
    onOpenFollowUp: () => void;
    onToggleHistory: () => void;
    showHistory: boolean;
}

export const PatientSummaryHeader: React.FC<PatientHeaderProps> = ({
    onOpenFollowUp,
    onToggleHistory,
    showHistory
}) => {
    // Datos puramente clínicos
    const patient = {
        name: "Juan Pérez Rodríguez",
        id: "00214",
        age: "45 años (15/05/1980)",
        bloodType: "O+",
        phone: "+506 8888-8888",
        lastVisit: "12 de Enero, 2026",
        mainDiagnosis: "Hipoacusia Sensorineural Bilateral",
        allergies: ["Penicilina", "AINES"],
        medications: ["Enalapril 10mg", "Atorvastatina 20mg"],
        observations: "Paciente con implante coclear en oído izquierdo."
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-sm flex flex-col gap-6">

            {/* FILA 1: IDENTIDAD Y CONTACTO */}
            <div className="flex items-start justify-between">
                <div className="flex gap-5">
                    <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 border border-slate-200">
                        <User size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Typography variant={TypographyVariant.BODY_BOLD} className="text-2xl text-slate-900">
                                {patient.name}
                            </Typography>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-100">
                                ID: {patient.id}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500">
                            <Typography variant={TypographyVariant.CAPTION} className="font-medium">
                                {patient.age} • <span className="font-bold text-slate-700">{patient.bloodType}</span>
                            </Typography>
                            <span className="text-slate-300">|</span>
                            <div className="flex items-center gap-1">
                                <Phone size={14} />
                                <Typography variant={TypographyVariant.CAPTION} className="font-medium">{patient.phone}</Typography>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onOpenFollowUp}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                        <Calendar size={16} /> Próxima Cita
                    </button>
                    <button
                        onClick={onToggleHistory}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${showHistory
                            ? 'bg-slate-900 text-white'
                            : 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                            }`}
                    >
                        <History size={16} /> {showHistory ? 'Cerrar Historial' : 'Ver Historial'}
                    </button>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* FILA 2: RESUMEN CLÍNICO (LO QUE EL MÉDICO NECESITA SABER) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Diagnóstico Principal */}
                <div className="flex gap-3">
                    <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg h-fit">
                        <Stethoscope size={18} />
                    </div>
                    <div>
                        <Typography variant={TypographyVariant.OVERLINE} className="text-slate-400 font-bold mb-1">Diagnóstico Base</Typography>
                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-slate-800">
                            {patient.mainDiagnosis}
                        </Typography>
                    </div>
                </div>

                {/* Alergias y Riesgos */}
                <div className="flex gap-3">
                    <div className="mt-1 p-2 bg-red-50 text-red-600 rounded-lg h-fit">
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <Typography variant={TypographyVariant.OVERLINE} className="text-slate-400 font-bold mb-1">Alergias / Contraindicaciones</Typography>
                        <div className="flex flex-wrap gap-1">
                            {patient.allergies.map(a => (
                                <span key={a} className="text-sm font-bold text-red-700">{a}{patient.allergies.indexOf(a) !== patient.allergies.length - 1 ? ',' : ''}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Medicación Actual */}
                <div className="flex gap-3">
                    <div className="mt-1 p-2 bg-emerald-50 text-emerald-600 rounded-lg h-fit">
                        <Pill size={18} />
                    </div>
                    <div>
                        <Typography variant={TypographyVariant.OVERLINE} className="text-slate-400 font-bold mb-1">Medicación Permanente</Typography>
                        <Typography variant={TypographyVariant.CAPTION} className="text-slate-700 font-medium">
                            {patient.medications.join(' • ')}
                        </Typography>
                    </div>
                </div>
            </div>

            {/* BARRA INFERIOR: ÚLTIMA NOTA / OBSERVACIÓN RAPIDA */}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                    <FileText size={16} className="text-slate-400" />
                    <Typography variant={TypographyVariant.CAPTION} className="text-slate-600 italic">
                        <span className="font-bold not-italic text-slate-800 mr-2">Nota clave:</span>
                        "{patient.observations}"
                    </Typography>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Última visita: {patient.lastVisit}
                </div>
            </div>
        </div>
    );
};