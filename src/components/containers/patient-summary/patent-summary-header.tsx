import React from 'react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import {
    User, History, Calendar, Phone, AlertCircle,
    Stethoscope, Pill, FileText, AlertTriangle
} from 'lucide-react';
import { usePatientSummary } from './use-patient-summary-header';

interface PatientHeaderProps {
    patientId: string;
    onOpenFollowUp: () => void;
    onToggleHistory: () => void;
    showHistory: boolean;
}

export const PatientSummaryHeader: React.FC<PatientHeaderProps> = ({
    patientId,
    onOpenFollowUp,
    onToggleHistory,
    showHistory
}) => {
    const { patient, isLoading } = usePatientSummary(patientId);

    if (isLoading || !patient) {
        return <div className="h-48 w-full bg-neutral-50 animate-pulse rounded-app-lg border border-neutral-100" />;
    }

    return (
        <div className="bg-white border border-neutral-200 rounded-app-lg p-6 mb-8 shadow-sm flex flex-col gap-6 animate-in fade-in duration-500">

            {/* FILA 1: IDENTIDAD Y CONTACTO */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex gap-5">
                    <div className="h-16 w-16 bg-primary rounded-app-md flex items-center justify-center text-white shadow-lg shadow-primary-soft">
                        <User size={30} strokeWidth={2} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Typography variant={TypographyVariant.BODY_BOLD} className="text-2xl text-neutral-900 leading-none">
                                {patient.name}
                            </Typography>
                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-bold rounded-md border border-neutral-200">
                                ID: {patient.id}
                            </span>
                            {patient.isInactive && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-danger/10 text-danger text-[10px] font-bold rounded-md border border-danger/20">
                                    <AlertTriangle size={10} />
                                    Inactivo
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-neutral-500">
                            <Typography variant={TypographyVariant.CAPTION} className="font-medium text-neutral-400">
                                {patient.age} • <span className="font-bold text-primary">{patient.bloodType}</span>
                            </Typography>
                            <span className="text-neutral-200">|</span>
                            <div className="flex items-center gap-1.5">
                                <Phone size={14} className="text-neutral-400" />
                                <Typography variant={TypographyVariant.CAPTION} className="font-bold text-neutral-600">{patient.phone}</Typography>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={onOpenFollowUp}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-neutral-200 rounded-app-md text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-all"
                    >
                        <Calendar size={16} /> Próxima Cita
                    </button>
                    <button
                        onClick={onToggleHistory}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-app-md text-xs font-bold transition-all ${showHistory
                            ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-200'
                            : 'bg-primary text-white shadow-lg shadow-primary-soft'
                            }`}
                    >
                        <History size={16} /> {showHistory ? 'Cerrar Historial' : 'Ver Historial'}
                    </button>
                </div>
            </div>

            <hr className="border-neutral-100" />

            {/* FILA 2: RESUMEN CLÍNICO */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ClinicalItem
                    icon={<Stethoscope size={18} />}
                    label="Diagnóstico Base"
                    value={patient.mainDiagnosis}
                    color="blue"
                />
                <ClinicalItem
                    icon={<AlertCircle size={18} />}
                    label="Alergias"
                    value={patient.allergies.join(', ')}
                    color="red"
                    isWarning={patient.allergies.length > 0 && patient.allergies[0] !== 'Ninguna'}
                />
                <ClinicalItem
                    icon={<Pill size={18} />}
                    label="Medicación"
                    value={patient.medications.length > 0 ? patient.medications.join(' • ') : 'Ninguna registrada'}
                    color="emerald"
                />
            </div> */}

            {/* BARRA INFERIOR */}
            <div className="bg-neutral-50/50 rounded-app-md p-4 flex flex-col md:flex-row items-center justify-between border border-neutral-100 gap-3">
                <div className="flex items-center gap-3">
                    <FileText size={16} className="text-secondary" />
                    <Typography variant={TypographyVariant.CAPTION} className="text-neutral-600">
                        <span className="font-bold text-neutral-800 mr-2 uppercase text-[9px] tracking-wider">Nota clínica:</span>
                        <span className="italic">{patient.observations}</span>
                    </Typography>
                </div>
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-neutral-100">
                    Última visita: {patient.lastVisit}
                </div>
            </div>
        </div>
    );
};

/* Componente Interno para los items clínicos */
const ClinicalItem = ({ icon, label, value, color, isWarning }: any) => {
    const colors: any = {
        blue: 'bg-primary-soft text-primary',
        red: 'bg-danger/10 text-danger',
        emerald: 'bg-success/10 text-success'
    };

    return (
        <div className="flex gap-3">
            <div className={`mt-1 p-2 rounded-app-sm h-fit ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400 font-black text-[9px] mb-1 tracking-tighter uppercase">
                    {label}
                </Typography>
                <Typography variant={TypographyVariant.BODY_BOLD} className={`text-sm ${isWarning ? 'text-danger' : 'text-neutral-700'}`}>
                    {value}
                </Typography>
            </div>
        </div>
    );
};