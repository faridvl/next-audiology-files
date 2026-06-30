import React from "react";
import { useNavigation } from "@/hooks/use-navigation";
import { usePatientDetail } from "./use-patient-detail";
import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import {
    EnvelopeIcon,
    IdentificationIcon,
    MagnifyingGlassIcon,
    WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";
import {
    CalendarIcon,
    ChevronRightIcon,
    PhoneIcon,
    PlusIcon,
    ShieldCheckIcon,
    FileText,
    ClipboardList,
    Link,
} from "lucide-react";
import { Button, ButtonVariant } from "@/components/common/button/button";
import { MedicalSpeciality } from "@/types/medical-controls/medical-control.types";
import { ClinicalControl, ControlType } from "@/types/otros/clinical";
import { useSession } from "@/hooks/use-session";
import { UserRole } from "@/types/auth/auth";
import { LinkDeviceModal } from "./link-device-modal";
import { AudiogramChart, classifyHearingLoss } from "@/components/common/audiogram-chart/audiogram-chart";
import { useState } from "react";
import { useDeletePatientMutation } from "@/shared/api/mutations/patients/use-delete-patient-mutation";
import { toast } from "sonner";

interface HeaderInfoProps { icon: React.ReactNode; text: string; isWarning?: boolean; }
const HeaderInfo = ({ icon, text, isWarning }: HeaderInfoProps) => (
    <div className="flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>
        <Typography
            variant={TypographyVariant.CAPTION}
            className={isWarning ? 'text-amber-600 italic font-medium' : 'font-medium text-slate-600'}
        >
            {text}
        </Typography>
    </div>
);

interface StatCardProps { title: string; value: string; icon: React.ReactNode; onClick: () => void; }
const StatCard = ({ title, value, icon, onClick }: StatCardProps) => (
    <button
        onClick={onClick}
        className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-blue-200 hover:shadow-md transition-all text-left w-full group"
    >
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
            {icon}
        </div>
        <div className="flex-1">
            <Typography variant={TypographyVariant.CAPTION} className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{title}</Typography>
            <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm font-bold text-slate-900">{value}</Typography>
        </div>
        <ChevronRightIcon className="h-4 w-4 text-slate-300 self-center group-hover:text-blue-500 transition-colors" />
    </button>
);

interface SpecFilterButtonProps { label: string; isActive: boolean; onClick: () => void; }
const SpecFilterButton = ({ label, isActive, onClick }: SpecFilterButtonProps) => (
    <button
        onClick={onClick}
        className={`px-5 py-2 rounded-xl transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest
        ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
    >
        {label}
    </button>
);

const getTypeStyle = (type: ControlType) => {
    switch (type) {
        case ControlType.AUDIOLOGY: return "bg-purple-50 text-purple-600 border-purple-100";
        case ControlType.DENTAL: return "bg-blue-50 text-blue-600 border-blue-100";
        case ControlType.GENERAL: return "bg-emerald-50 text-emerald-600 border-emerald-100";
        default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
};

export const PatientDetailContainer = ({ id }: { id: string }) => {
    const navigation = useNavigation();
    const [isLinkDeviceOpen, setIsLinkDeviceOpen] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const { user } = useSession();
    const canStartConsulta = user?.role && user.role !== UserRole.STAFF;
    const isAdmin = user?.role === UserRole.OWNER || user?.role === UserRole.ADMIN;
    const { deletePatient, isPending: isDeletingPatient } = useDeletePatientMutation();

    const {
        patient, history, summary, isLoading, isFetching,
        hasMore, searchTerm, setSearchTerm, selectedSpec, setSelectedSpec, loadMore,
        latestAudiogram, recordTypeFilter, setRecordTypeFilter,
    } = usePatientDetail(id, user?.specialty);

    if (isLoading || !patient) return (
        <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">
            Cargando expediente...
        </div>
    );

    const specialityOptions = user?.specialty
        ? [user.specialty as unknown as MedicalSpeciality]
        : Object.values(MedicalSpeciality);

    return (
        <>
        <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6 md:space-y-8 animate-in fade-in duration-500">

            {/* PERFIL PACIENTE */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 md:h-20 md:w-20 bg-slate-900 rounded-[1.2rem] md:rounded-[1.8rem] flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-xl shadow-slate-200 shrink-0">
                        {patient.firstName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <Typography variant={TypographyVariant.HEADER} className="text-lg md:text-2xl font-black text-slate-900 leading-tight truncate">
                            {patient.firstName} {patient.lastName}
                        </Typography>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            <HeaderInfo icon={<IdentificationIcon className="h-3.5 w-3.5" />} text={patient.uuid.split('-')[0].toUpperCase()} />
                            <HeaderInfo icon={<PhoneIcon className="h-3.5 w-3.5" />} text={patient.phone} />
                            <HeaderInfo icon={<EnvelopeIcon className="h-3.5 w-3.5" />} text={patient.email ?? 'Sin correo'} isWarning={!patient.email} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    {isAdmin && !isConfirmDelete && (
                        <button
                            onClick={() => setIsConfirmDelete(true)}
                            className="flex items-center justify-center gap-1.5 border border-red-200 text-red-500 px-4 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex-1 sm:flex-none"
                        >
                            Desactivar paciente
                        </button>
                    )}
                    {isAdmin && isConfirmDelete && (
                        <div className="flex items-center gap-2 border border-red-300 bg-red-50 px-4 h-10 rounded-xl flex-1 sm:flex-none">
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">¿Confirmar?</span>
                            <button
                                disabled={isDeletingPatient}
                                onClick={async () => {
                                    try {
                                        await deletePatient(id);
                                        toast.success('Paciente desactivado');
                                        navigation.patients.list();
                                    } catch {
                                        toast.error('Error al desactivar');
                                        setIsConfirmDelete(false);
                                    }
                                }}
                                className="text-[10px] font-black text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                {isDeletingPatient ? '...' : 'Sí'}
                            </button>
                            <button onClick={() => setIsConfirmDelete(false)} className="text-[10px] font-black text-slate-500 hover:text-slate-700 uppercase tracking-widest">No</button>
                        </div>
                    )}
                    <button
                        onClick={() => setIsLinkDeviceOpen(true)}
                        className="flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 px-4 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all flex-1 sm:flex-none"
                    >
                        <Link className="h-4 w-4 shrink-0" />
                        <span className="truncate">{patient.linkedProductUuid ? 'Cambiar audífono' : 'Vincular audífono'}</span>
                    </button>
                    <button
                        onClick={() => navigation.patients.ficha(id)}
                        className="flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 px-4 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all flex-1 sm:flex-none"
                    >
                        <ClipboardList className="h-4 w-4 shrink-0" />
                        <span className="truncate">Ver ficha completa</span>
                    </button>
                    {canStartConsulta && (
                        <Button variant={ButtonVariant.PRIMARY} className="rounded-xl px-5 h-10 shadow-lg shadow-blue-100 flex-1 sm:flex-none" onClick={() => navigation.patients.consulta(id)}>
                            <PlusIcon className="h-4 w-4 mr-2 shrink-0" />
                            <span className="text-xs font-bold uppercase tracking-tight">Iniciar consulta</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* INDICADORES RÁPIDOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Próxima cita" value={summary.nextAppointment} icon={<CalendarIcon className="h-5 w-5 text-blue-600" />} onClick={() => navigation.appointments.list()} />
                <StatCard title="Próx. mantenimiento" value={summary.warrantyExpiration} icon={<ShieldCheckIcon className="h-5 w-5 text-emerald-600" />} onClick={() => navigation.maintenance.list()} />
                <StatCard title="Mantenimientos" value={`${summary.pendingMaintenance.length} registrados`} icon={<WrenchScrewdriverIcon className="h-5 w-5 text-amber-600" />} onClick={() => navigation.maintenance.list()} />
            </div>

            {/* HISTORIAL CLÍNICO */}
            <div className="space-y-4">
                {/* Filtros */}
                <div className="flex flex-col gap-3 bg-white p-4 rounded-[1.8rem] border border-slate-100 shadow-sm">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        <SpecFilterButton label="Todos" isActive={recordTypeFilter === 'ALL'} onClick={() => setRecordTypeFilter('ALL')} />
                        <SpecFilterButton label="Controles" isActive={recordTypeFilter === 'CONTROL'} onClick={() => setRecordTypeFilter('CONTROL')} />
                        <SpecFilterButton label="Audiogramas" isActive={recordTypeFilter === 'AUDIOGRAM'} onClick={() => setRecordTypeFilter('AUDIOGRAM')} />
                        <SpecFilterButton label="Mantenimientos" isActive={recordTypeFilter === 'MAINTENANCE'} onClick={() => setRecordTypeFilter('MAINTENANCE')} />
                    </div>
                    {specialityOptions.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            <SpecFilterButton label="Toda especialidad" isActive={selectedSpec === 'ALL'} onClick={() => setSelectedSpec('ALL')} />
                            {specialityOptions.map((spec) => (
                                <SpecFilterButton key={spec} label={spec} isActive={selectedSpec === spec} onClick={() => setSelectedSpec(spec)} />
                            ))}
                        </div>
                    )}
                    <div className="relative w-full">
                        <MagnifyingGlassIcon className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar en registros..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>
                </div>

                {/* AUDIOGRAMA MÁS RECIENTE */}
                {latestAudiogram && (
                    <div className="bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-slate-800">
                                    Audiograma más reciente
                                </Typography>
                                <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400 font-medium">
                                    {history.find(record => record.type === 'AUDIOLOGY')?.date ?? ''}
                                </Typography>
                            </div>
                            <div className="flex gap-2">
                                {(['OD', 'OI'] as const).map((side) => {
                                    const hasData = Object.values(latestAudiogram[side] ?? {}).some(v => v !== '');
                                    if (!hasData) return null;
                                    const classification = classifyHearingLoss(latestAudiogram, side);
                                    return (
                                        <div
                                            key={side}
                                            className="px-2.5 py-1.5 rounded-xl text-center"
                                            style={{ backgroundColor: `${classification.color}12`, border: `1px solid ${classification.color}30` }}
                                        >
                                            <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">{side}</div>
                                            <div className="text-[10px] font-black" style={{ color: classification.color }}>
                                                {classification.label}
                                            </div>
                                            <div className="text-[8px] text-slate-400">{classification.pta} dB</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <AudiogramChart audiogram={latestAudiogram} compact showClassification={false} />
                    </div>
                )}

                {/* REGISTROS */}
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <div className="py-16 text-center bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            No hay registros
                        </div>
                    ) : (
                        <>
                            {history.map((record: ClinicalControl) => (
                                <div
                                    key={record.id}
                                    onClick={() => {
                                        if (record.type !== 'MAINTENANCE') {
                                            navigation.patients.viewControl(id, record.id);
                                        }
                                    }}
                                    className={`bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[1.8rem] border border-slate-100 transition-all flex items-center gap-3 md:gap-6 group ${record.type === 'MAINTENANCE' ? '' : 'hover:border-blue-300 cursor-pointer'}`}
                                >
                                    <div className="shrink-0">
                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${getTypeStyle(record.type as ControlType)}`}>
                                            {record.type}
                                        </span>
                                        <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight whitespace-nowrap">
                                            {record.date}
                                        </Typography>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Typography variant={TypographyVariant.BODY} className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {record.note}
                                        </Typography>
                                    </div>
                                    <ChevronRightIcon className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform shrink-0" />
                                </div>
                            ))}
                            {hasMore && (
                                <button
                                    onClick={loadMore}
                                    disabled={isFetching}
                                    className="w-full py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 border border-dashed border-slate-200 rounded-[1.5rem] hover:border-blue-300 transition-all disabled:opacity-50"
                                >
                                    {isFetching ? 'Cargando...' : 'Cargar más registros'}
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* DOCUMENTOS — pendiente de backend */}
                <div className="bg-white rounded-[1.8rem] border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-slate-500">
                            Documentos del paciente
                        </Typography>
                        <Typography variant={TypographyVariant.CAPTION} className="text-xs text-slate-400 mt-0.5">
                            Próximamente — almacenamiento de archivos en configuración
                        </Typography>
                    </div>
                </div>
            </div>
        </div>

        {isLinkDeviceOpen && (
            <LinkDeviceModal
                patientUuid={id}
                currentLinkedProductUuid={patient.linkedProductUuid}
                onClose={() => setIsLinkDeviceOpen(false)}
                onSuccess={() => setIsLinkDeviceOpen(false)}
            />
        )}
        </>
    );
};
