import React, { useState } from 'react';
import {
    ArrowLeft, PenLine, Check, X,
} from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useNavigation } from '@/hooks/use-navigation';
import { useControlDetail } from './use-control-detail';
import { useSession } from '@/hooks/use-session';
import { useAddCorrectionNoteMutation } from '@/shared/api/mutations/medical-controls/use-add-correction-note-mutation';
import { toast } from 'sonner';
import { MedicalSpeciality, AudiologyFindings, AudiogramData } from '@/types/medical-controls/medical-control.types';
import { AudiogramChart, classifyHearingLoss } from '@/components/common/audiogram-chart/audiogram-chart';

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
    <div className={`p-5 border-r border-neutral-100 last:border-r-0 ${className}`}>
        <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{label}</Typography>
        <Typography variant={TypographyVariant.BODY_BOLD} className="text-xs font-bold text-neutral-900 tracking-tight uppercase">{value}</Typography>
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
    const { addCorrectionNote, isPending: isSavingNote } = useAddCorrectionNoteMutation(controlId);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteText, setNoteText] = useState('');

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto py-12 px-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-neutral-100 rounded w-1/3" />
                    <div className="h-64 bg-neutral-100 rounded-app-md" />
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="max-w-5xl mx-auto py-12 px-6 text-center text-neutral-400">
                No se pudo cargar el control médico.
            </div>
        );
    }

    // TODO(!): P3-2-API — El API debe validar esto con un guard de especialidad en el backend
    const userSpecialty = user?.specialty;
    const controlSpeciality = data.control.speciality as string;
    const hasSpecialtyMismatch =
        userSpecialty !== undefined && userSpecialty !== controlSpeciality;

    if (hasSpecialtyMismatch) {
        return (
            <div className="max-w-5xl mx-auto py-12 px-6">
                <div className="flex justify-between items-center mb-8 no-print">
                    <button
                        onClick={() => navigation.patients.detail(patientId)}
                        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 font-medium text-xs uppercase tracking-widest transition-all"
                    >
                        <ArrowLeft size={14} /> Volver al Registro del Paciente
                    </button>
                </div>
                <div className="bg-warning/10 border border-warning/30 rounded-app-md p-10 text-center space-y-3">
                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm font-black text-warning uppercase tracking-widest">
                        Acceso restringido
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION} className="text-xs text-warning">
                        No tienes permiso para ver este control. Este registro pertenece a la especialidad{' '}
                        <span className="font-bold">{controlSpeciality}</span> y tu especialidad es{' '}
                        <span className="font-bold">{userSpecialty}</span>.
                    </Typography>
                </div>
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

    const audiogram = data.control.speciality === MedicalSpeciality.AUDIOLOGY
        ? ((data.control.findings as AudiologyFindings).audiogram as AudiogramData | undefined)
        : undefined;

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-neutral-50 pt-8">
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] self-start pt-1">
                    Campos Adicionales
                </div>
                <div className="md:col-span-3">
                    <table className="w-full text-sm border-collapse">
                        <tbody>
                            {unknownEntries.map(([key, value]) => (
                                <tr key={key} className="border-b border-neutral-50 last:border-b-0">
                                    <td className="py-2 pr-4 font-bold text-neutral-500 text-xs uppercase tracking-wide w-1/3">
                                        {formatFieldLabel(key)}
                                    </td>
                                    <td className="py-2 text-neutral-700">
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
                    className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 font-medium text-xs uppercase tracking-widest transition-all"
                >
                    <ArrowLeft size={14} /> Volver al Registro del Paciente
                </button>
                <div className="flex items-center gap-4">
                    {pdfButton}
                </div>
            </div>

            {/* EXPEDIENTE MÉDICO */}
            <div className="bg-white border border-neutral-300 shadow-sm rounded-none">

                {/* ENCABEZADO HOSPITALARIO */}
                <div className="p-10 border-b-4 border-neutral-900 flex justify-between items-start bg-neutral-50">
                    <div className="space-y-1">
                        <Typography variant={TypographyVariant.HEADER} className="text-xl font-black text-neutral-900 tracking-tighter uppercase">{institutionName}</Typography>
                        <Typography variant={TypographyVariant.CAPTION} className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">Sistema de Gestión de Expedientes Digitales</Typography>
                    </div>
                    <div className="text-right">
                        <div className="inline-block bg-neutral-900 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                            Copia de Archivo
                        </div>
                    </div>
                </div>

                {/* BANNER DE DATOS DEL PACIENTE */}
                <div className="bg-white grid grid-cols-2 md:grid-cols-4 border-b border-neutral-200">
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
                        <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] self-start pt-1">
                            Especialista
                        </div>
                        <div className="md:col-span-3">
                            <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm font-bold text-neutral-900 uppercase tracking-tight">
                                {specialistName}
                            </Typography>
                        </div>
                    </div>

                    {/* ESPECIALIDAD */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2">
                        <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] self-start pt-1">
                            Especialidad
                        </div>
                        <div className="md:col-span-3">
                            <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm font-bold text-neutral-900 uppercase tracking-tight">
                                {specialityLabel}
                            </Typography>
                        </div>
                    </div>

                    {/* HALLAZGOS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2">
                        <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] self-start pt-1">
                            Notas Clínicas
                        </div>
                        <div className="md:col-span-3 text-neutral-600 text-sm leading-relaxed text-justify">
                            {renderFindings()}
                        </div>
                    </div>

                    {/* AUDIOGRAMA */}
                    {audiogram && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 border-t border-neutral-50 pt-8">
                            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] self-start pt-1">
                                Audiograma
                            </div>
                            <div className="md:col-span-3">
                                <AudiogramChart audiogram={audiogram} showClassification />
                            </div>
                        </div>
                    )}

                    {/* CAMPOS GENÉRICOS (plantilla clínica) */}
                    {renderGenericFindings()}

                    {/* DIAGNÓSTICO */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-neutral-50 pt-8">
                        <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] self-start pt-1">
                            Diagnóstico
                        </div>
                        <div className="md:col-span-3">
                            <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm font-bold text-neutral-900 leading-snug">
                                {data.control.diagnosis}
                            </Typography>
                        </div>
                    </div>

                    {/* NOTA DE CORRECCIÓN */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-neutral-50 pt-8 no-print">
                        <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] self-start pt-1">
                            Nota de Corrección
                        </div>
                        <div className="md:col-span-3 space-y-3">
                            {data.control.correctionNotes && !isEditingNote && (
                                <div className="bg-warning/10 border border-warning/30 rounded-app-sm p-4">
                                    <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black text-warning uppercase tracking-widest mb-2 block">
                                        Corrección registrada
                                    </Typography>
                                    <Typography variant={TypographyVariant.BODY} className="text-sm text-warning leading-relaxed">
                                        {data.control.correctionNotes}
                                    </Typography>
                                </div>
                            )}
                            {!isEditingNote ? (
                                <button
                                    onClick={() => { setNoteText(data.control.correctionNotes ?? ''); setIsEditingNote(true); }}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-700 transition-colors border border-dashed border-neutral-200 px-4 py-2 rounded-app-sm hover:border-neutral-400"
                                >
                                    <PenLine size={12} />
                                    {data.control.correctionNotes ? 'Editar nota' : 'Agregar nota de corrección'}
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <textarea
                                        autoFocus
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        rows={4}
                                        className="w-full border border-warning/40 bg-warning/10 rounded-app-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-warning/20 resize-none"
                                        placeholder="Describe la corrección o aclaración a este registro..."
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            disabled={isSavingNote || !noteText.trim()}
                                            onClick={async () => {
                                                try {
                                                    await addCorrectionNote(noteText.trim());
                                                    toast.success('Nota de corrección guardada');
                                                    setIsEditingNote(false);
                                                } catch {
                                                    toast.error('Error al guardar la nota');
                                                }
                                            }}
                                            className="flex items-center gap-2 bg-warning text-white px-4 py-2 rounded-app-sm text-[10px] font-black uppercase tracking-widest hover:bg-warning/80 disabled:opacity-50 transition-all"
                                        >
                                            <Check size={12} /> Guardar
                                        </button>
                                        <button
                                            onClick={() => setIsEditingNote(false)}
                                            className="flex items-center gap-2 text-neutral-400 px-4 py-2 rounded-app-sm text-[10px] font-black uppercase tracking-widest hover:text-neutral-700 transition-colors"
                                        >
                                            <X size={12} /> Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PLAN */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-neutral-50 pt-8">
                        <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] self-start pt-1">
                            Plan Médico
                        </div>
                        <div className="md:col-span-3">
                            <ul className="space-y-3">
                                {data.control.plan.map((item, planItemIndex) => (
                                    <li key={planItemIndex} className="text-sm text-neutral-600 flex items-start gap-3">
                                        <span className="text-[10px] font-black text-neutral-300 pt-0.5">{planItemIndex + 1}.</span>
                                        <Typography variant={TypographyVariant.BODY} className="text-sm text-neutral-600">{item}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* PIE DE PÁGINA TÉCNICO */}
                <div className="bg-neutral-50 p-6 text-center border-t border-neutral-200">
                    <Typography variant={TypographyVariant.CAPTION} className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em]">
                        Propiedad Privada del Paciente - Confidencialidad bajo Ley de Protección de Datos
                    </Typography>
                </div>
            </div>
        </div>
    );
};
