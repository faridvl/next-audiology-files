import React from 'react';
import {
    ArrowLeft,
    Printer,
} from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useNavigation } from '@/hooks/use-navigation';
import { useControlDetail } from './use-control-detail';
import { useSession } from '@/hooks/use-session';
import { MedicalSpeciality, AudiologyFindings } from '@/types/medical-controls/medical-control.types';

const specialityLabels: Record<MedicalSpeciality, string> = {
    [MedicalSpeciality.AUDIOLOGY]: 'Audiología Clínica',
    [MedicalSpeciality.DENTAL]: 'Odontología',
    [MedicalSpeciality.GENERAL]: 'Medicina General',
};

// Convierte clave camelCase a texto legible
const formatFieldLabel = (key: string): string =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase()).trim();

// Formatea valor de findings para mostrar en UI
const formatFieldValue = (value: unknown): string => {
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (value === null || value === undefined || value === '') return '—';
    return String(value);
};

// Campos conocidos de audiología — no se muestran como genéricos
const AUDIOLOGY_KNOWN_FIELDS = new Set([
    'otoscopyRight',
    'otoscopyLeft',
    'tinnitus',
    'cleaningPerformed',
    'usesAuxiliaries',
]);

interface HeaderCellProps {
    label: string;
    value: string;
    className?: string;
}

const HeaderCell: React.FC<HeaderCellProps> = ({ label, value, className = '' }) => (
    <div className={`p-5 border-r border-slate-100 last:border-r-0 ${className}`}>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xs font-bold text-slate-900 tracking-tight uppercase">{value}</p>
    </div>
);

interface Props {
    patientId: string;
    controlId: string;
    /** Slot para el botón de descarga PDF (inyectado desde la página) */
    pdfButton?: React.ReactNode;
}

export const ControlDetailContainer: React.FC<Props> = ({ patientId, controlId, pdfButton }) => {
    const navigation = useNavigation();
    const { data, isLoading, isError } = useControlDetail(patientId, controlId);
    const { tenant, user } = useSession();

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto py-12 px-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-100 rounded w-1/3" />
                    <div className="h-64 bg-slate-100 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="max-w-5xl mx-auto py-12 px-6 text-center text-slate-400">
                No se pudo cargar el control médico.
            </div>
        );
    }

    const institutionName = tenant?.businessName?.toUpperCase() ?? 'INSTITUCIÓN MÉDICA';
    const specialistName = user?.fullName ? `DR. ${user.fullName.toUpperCase()}` : 'ESPECIALISTA';
    const specialityLabel = specialityLabels[data.control.speciality] ?? data.control.speciality;

    const renderAudiologyFindings = () => {
        const audiologyFindings = data.control.findings as AudiologyFindings;
        const parts: string[] = [];
        if (audiologyFindings.otoscopyRight) parts.push(`OD: ${audiologyFindings.otoscopyRight}`);
        if (audiologyFindings.otoscopyLeft) parts.push(`OI: ${audiologyFindings.otoscopyLeft}`);
        if (audiologyFindings.tinnitus) parts.push('Tinnitus presente.');
        if (audiologyFindings.cleaningPerformed) parts.push('Se realizó limpieza.');
        if (audiologyFindings.usesAuxiliaries) parts.push('Usa auxiliares auditivos.');
        return parts.join(' ') || '—';
    };

    // Campos genéricos: cualquier clave no conocida de la especialidad actual
    const renderGenericFindings = () => {
        const findingsMap = data.control.findings as unknown as Record<string, unknown>;
        const knownKeys =
            data.control.speciality === MedicalSpeciality.AUDIOLOGY
                ? AUDIOLOGY_KNOWN_FIELDS
                : new Set<string>();

        const unknownEntries = Object.entries(findingsMap).filter(
            ([key]) => !knownKeys.has(key) && key !== 'audiogram',
        );

        if (unknownEntries.length === 0) return null;

        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-slate-50 pt-8">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] self-start pt-1">
                    Campos Adicionales
                </div>
                <div className="md:col-span-3">
                    {/* TODO(!): P3-3 — Estos campos provienen de plantillas clínicas configurables en localStorage.
                        Implementar GET/POST /clinical-templates en API para persistencia real. */}
                    <table className="w-full text-sm border-collapse">
                        <tbody>
                            {unknownEntries.map(([key, value]) => (
                                <tr key={key} className="border-b border-slate-50 last:border-b-0">
                                    <td className="py-2 pr-4 font-bold text-slate-500 text-xs uppercase tracking-wide w-1/3">
                                        {formatFieldLabel(key)}
                                    </td>
                                    <td className="py-2 text-slate-700">
                                        {formatFieldValue(value)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderFindings = () => {
        if (data.control.speciality === MedicalSpeciality.AUDIOLOGY) {
            return renderAudiologyFindings();
        }
        const generalFindings = data.control.findings as unknown as Record<string, unknown>;
        return String(generalFindings.generalFindings ?? '—');
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 space-y-8 font-['Roboto',sans-serif] animate-in fade-in duration-700">

            {/* ACCIONES DE SISTEMA */}
            <div className="flex justify-between items-center no-print">
                <button
                    onClick={() => navigation.patients.detail(patientId)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-medium text-xs uppercase tracking-widest transition-all"
                >
                    <ArrowLeft size={14} /> Volver al Registro del Paciente
                </button>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Printer size={18} />
                    </button>
                    {pdfButton}
                </div>
            </div>

            {/* EXPEDIENTE MÉDICO */}
            <div className="bg-white border border-slate-300 shadow-sm rounded-none">

                {/* ENCABEZADO HOSPITALARIO */}
                <div className="p-10 border-b-4 border-slate-900 flex justify-between items-start bg-slate-50">
                    <div className="space-y-1">
                        <p className="text-xl font-black text-slate-900 tracking-tighter uppercase">{institutionName}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Sistema de Gestión de Expedientes Digitales</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-block bg-slate-900 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                            Copia de Archivo
                        </div>
                    </div>
                </div>

                {/* BANNER DE DATOS DEL PACIENTE */}
                <div className="bg-white grid grid-cols-2 md:grid-cols-4 border-b border-slate-200">
                    <HeaderCell label="Paciente" value={data.patient.fullName} className="col-span-2" />
                    <HeaderCell label="Identificación" value={data.patient.documentId} />
                    <HeaderCell label="Género" value={data.patient.gender} />
                    <HeaderCell label="Edad" value={data.patient.age} />
                    <HeaderCell label="Tipo Sangre" value={data.patient.bloodType} />
                    <HeaderCell label="Fecha Consulta" value={data.control.date} />
                    <HeaderCell label="ID Documento" value={controlId.toUpperCase()} />
                </div>

                {/* CUERPO DEL REGISTRO */}
                <div className="p-12 md:p-16 space-y-12">

                    {/* ESPECIALISTA */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] self-start pt-1">
                            Especialista
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                                {specialistName}
                            </p>
                        </div>
                    </div>

                    {/* ESPECIALIDAD */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] self-start pt-1">
                            Especialidad
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                                {specialityLabel}
                            </p>
                        </div>
                    </div>

                    {/* HALLAZGOS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] self-start pt-1">
                            Notas Clínicas
                        </div>
                        <div className="md:col-span-3 text-slate-600 text-sm leading-relaxed text-justify">
                            {renderFindings()}
                        </div>
                    </div>

                    {/* CAMPOS GENÉRICOS (plantilla clínica) */}
                    {renderGenericFindings()}

                    {/* DIAGNÓSTICO */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-slate-50 pt-8">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] self-start pt-1">
                            Diagnóstico
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-sm font-bold text-slate-900 leading-snug">
                                {data.control.diagnosis}
                            </p>
                        </div>
                    </div>

                    {/* PLAN */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-slate-50 pt-8">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] self-start pt-1">
                            Plan Médico
                        </div>
                        <div className="md:col-span-3">
                            <ul className="space-y-3">
                                {data.control.plan.map((item, index) => (
                                    <li key={index} className="text-sm text-slate-600 flex items-start gap-3">
                                        <span className="text-[10px] font-black text-slate-300 pt-0.5">{index + 1}.</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* PIE DE PÁGINA TÉCNICO */}
                <div className="bg-slate-50 p-6 text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center border-t border-slate-200">
                    Propiedad Privada del Paciente - Confidencialidad bajo Ley de Protección de Datos
                </div>
            </div>
        </div>
    );
};
