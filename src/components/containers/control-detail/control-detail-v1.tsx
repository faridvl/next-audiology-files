import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';
import { useControlDetail } from './use-control-detail';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

interface Props { patientId: string; controlId: string; }

export const ControlDetailContainer: React.FC<Props> = ({
    patientId,
    controlId
}) => {
    const navigation = useNavigation();
    const { data, isLoading, isError } = useControlDetail(
        patientId,
        controlId
    );

    if (isLoading)
        return (
            <div className="p-20 text-center">
                <Typography variant={TypographyVariant.OVERLINE}>
                    Cargando expediente...
                </Typography>
            </div>
        );

    if (isError || !data)
        return (
            <div className="p-20 text-center">
                <Typography variant={TypographyVariant.BODY}>
                    Error al recuperar el registro médico.
                </Typography>
            </div>
        );

    const { patient, control } = data;

    return (
        <div className="max-w-6xl mx-auto pb-12 px-6 space-y-4 animate-in fade-in duration-500">

            {/* NAV BAR SUPERIOR */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => navigation.patients.detail(patientId)}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#1E3A8A] transition-colors"
                >
                    <ArrowLeft size={16} />
                    <Typography variant={TypographyVariant.LINK_TEXT}>
                        Volver al paciente
                    </Typography>
                </button>

                <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl hover:bg-slate-100 transition"
                >
                    <Printer size={18} className="text-slate-500" />
                </button>
            </div>

            {/* HEADER ZYNKA */}
            <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm space-y-6">

                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Typography variant={TypographyVariant.ACCENT}>
                            {control.institution}
                        </Typography>

                        <Typography variant={TypographyVariant.HEADER}>
                            Expediente Clínico
                        </Typography>

                        <Typography variant={TypographyVariant.CAPTION}>
                            Generado el {control.date}
                        </Typography>
                    </div>

                    <div className="px-4 py-2 bg-[#1E3A8A]/5 rounded-xl">
                        <Typography variant={TypographyVariant.OVERLINE}>
                            Folio {control.id.substring(0, 8).toUpperCase()}
                        </Typography>
                    </div>
                </div>

                {/* Datos paciente */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">

                    <InfoBlock label="Paciente" value={patient.fullName} />
                    <InfoBlock label="Documento" value={patient.documentId} />
                    <InfoBlock label="Edad" value={patient.age} />
                    <InfoBlock label="Género" value={patient.gender} />
                    <InfoBlock label="Tipo de sangre" value={patient.bloodType} />
                    <InfoBlock label="Especialidad" value={control.speciality} />
                </div>
            </div>

            {/* HALLAZGOS */}
            <SectionCard title="Hallazgos Clínicos">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <ObservationCard
                        title="Otoscopía Derecha"
                        value={control.findings.otoscopyRight}
                    />

                    <ObservationCard
                        title="Otoscopía Izquierda"
                        value={control.findings.otoscopyLeft}
                    />

                </div>

                <div className="pt-8 border-t border-slate-100">
                    <Typography variant={TypographyVariant.SUBTITLE}>
                        Observaciones técnicas
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <StatusRow label="Limpieza técnica realizada" status={control.findings.cleaningPerformed} />
                        <StatusRow label="Usuario de auxiliares auditivos" status={control.findings.usesAuxiliaries} />
                        <StatusRow label="Presencia de tinnitus" status={control.findings.tinnitus} />
                    </div>
                </div>
            </SectionCard>

            {/* DIAGNÓSTICO */}
            <SectionCard title="Diagnóstico Final">
                <Typography variant={TypographyVariant.BODY}>
                    {control.diagnosis}
                </Typography>
            </SectionCard>

            {/* PLAN */}
            <SectionCard title="Plan de Tratamiento">
                <ul className="space-y-4">
                    {control.plan.map((item, i) => (
                        <li key={i} className="flex gap-4">
                            <div className="h-6 w-6 flex items-center justify-center bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-sm font-semibold">
                                {i + 1}
                            </div>

                            <Typography variant={TypographyVariant.BODY}>
                                {item}
                            </Typography>
                        </li>
                    ))}
                </ul>
            </SectionCard>

            {/* FIRMA */}
            <div className="pt-10">
                <div className="w-72 border-t border-slate-300 pt-4">
                    <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                        {control.specialistName}
                    </Typography>

                    <Typography variant={TypographyVariant.CAPTION}>
                        Profesional responsable
                    </Typography>
                </div>
            </div>
        </div>
    );
};
// --- SUB-COMPONENTES AUXILIARES ---

const SectionCard = ({ title, children }: any) => (
    <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm space-y-6">
        <Typography variant={TypographyVariant.SUBTITLE}>
            {title}
        </Typography>
        {children}
    </div>
);
const InfoBlock = ({ label, value }: any) => (
    <div className="space-y-1">
        <Typography variant={TypographyVariant.CAPTION}>
            {label}
        </Typography>
        <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
            {value || "---"}
        </Typography>
    </div>
);

const ObservationCard = ({ title, value }: any) => (
    <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100">
        <Typography variant={TypographyVariant.OVERLINE}>
            {title}
        </Typography>

        <Typography variant={TypographyVariant.BODY} className="mt-3">
            {value}
        </Typography>
    </div>
);

const StatusRow = ({ label, status }: { label: string, status: boolean }) => (
    <div className="flex items-center gap-2">
        <span className={`text-[10px] ${status ? 'text-slate-900' : 'text-slate-300'}`}>
            {status ? '•' : '○'}
        </span>
        <span className={`text-[11px] font-bold uppercase tracking-tight ${status ? 'text-slate-700' : 'text-slate-400 line-through decoration-slate-200'}`}>
            {label}
        </span >
    </div >
);

const HeaderCell: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = "" }) => (
    <div className={`p-6 border-r border-b border-slate-100 last:border-r-0 ${className}`}>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-xs font-bold text-slate-900 truncate uppercase">{value || "---"}</p>
    </div>
);

const DetailRow = ({ label, value, isBold = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-slate-50 pt-8 first:border-0 first:pt-0">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-1">{label}</div>
        <div className={`md:col-span-3 text-[13px] leading-relaxed uppercase tracking-tight ${isBold ? 'font-black text-slate-900' : 'text-slate-600 font-medium'}`}>
            {value}
        </div>
    </div>
);