import React, { useState } from "react";
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
    History,
    ClipboardList,
    Link,
} from "lucide-react";
import { Button, ButtonVariant } from "@/components/common/button/button";
import { MedicalSpeciality } from "@/types/medical-controls/medical-control.types";
import { ClinicalControl, ControlType } from "@/types/otros/clinical";
import { DocumentsContainer } from "../../documents/documents-view";
import { useSession } from "@/hooks/use-session";
import { LinkDeviceModal } from "./link-device-modal";

enum PatientTabs {
    HISTORY = 'history',
    DOCUMENTS = 'documents'
}

// Sub-componentes auxiliares
const HeaderInfo = ({ icon, text, isWarning }: any) => (
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

const StatCard = ({ title, value, icon, onClick }: any) => (
    <button
        onClick={onClick}
        className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-blue-200 hover:shadow-md transition-all text-left w-full group"
    >
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{title}</p>
            <p className="text-sm font-bold text-slate-900">{value}</p>
        </div>
        <ChevronRightIcon className="h-4 w-4 text-slate-300 self-center group-hover:text-blue-500 transition-colors" />
    </button>
);

const TabButton = ({ label, isActive, onClick }: any) => (
    <button
        onClick={onClick}
        className={`px-5 py-2 rounded-xl transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest
        ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
    >
        {label}
    </button>
);

export const PatientDetailContainer = ({ id }: { id: string }) => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<PatientTabs>(PatientTabs.HISTORY);
    const [isLinkDeviceOpen, setIsLinkDeviceOpen] = useState(false);
    // TODO(!): P3-2-API — El filtro de especialidad en el front es UX adicional.
    // La seguridad real debe implementarse en el API con un guard de especialidad.
    const { user } = useSession();
    const {
        patient, history, summary, isLoading, isFetching,
        hasMore, searchTerm, setSearchTerm, selectedSpec, setSelectedSpec, loadMore
    } = usePatientDetail(id, user?.specialty);

    if (isLoading || !patient) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Cargando expediente...</div>;

    const getTypeStyle = (type: ControlType) => {
        switch (type) {
            case ControlType.AUDIOLOGY: return "bg-purple-50 text-purple-600 border-purple-100";
            case ControlType.DENTAL: return "bg-blue-50 text-blue-600 border-blue-100";
            case ControlType.GENERAL: return "bg-emerald-50 text-emerald-600 border-emerald-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <>
        <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6 md:space-y-8 animate-in fade-in duration-500">

            {/* PERFIL PACIENTE */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
                {/* Fila superior: avatar + datos */}
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
                {/* Botones — en mobile pasan a fila completa 1 columna */}
                <div className="flex flex-col sm:flex-row gap-2">
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
                    <Button variant={ButtonVariant.PRIMARY} className="rounded-xl px-5 h-10 shadow-lg shadow-blue-100 flex-1 sm:flex-none" onClick={() => navigation.patients.addControl(id)}>
                        <PlusIcon className="h-4 w-4 mr-2 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-tight">Nuevo registro</span>
                    </Button>
                </div>
            </div>

            {/* INDICADORES RÁPIDOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Próxima cita" value={summary.nextAppointment} icon={<CalendarIcon className="h-5 w-5 text-blue-600" />} onClick={() => navigation.appointments.list()} />
                <StatCard title="Garantía equipo" value={summary.warrantyExpiration} icon={<ShieldCheckIcon className="h-5 w-5 text-emerald-600" />} onClick={() => setActiveTab(PatientTabs.DOCUMENTS)} />
                <StatCard title="Mantenimientos" value={`${summary.pendingMaintenance.length} pendientes`} icon={<WrenchScrewdriverIcon className="h-5 w-5 text-amber-600" />} onClick={() => setActiveTab(PatientTabs.DOCUMENTS)} />
            </div>

            {/* NAVEGACIÓN INTERNA */}
            <div className="flex gap-1.5 p-1 bg-slate-100/80 rounded-2xl w-full sm:w-fit">
                <button
                    onClick={() => setActiveTab(PatientTabs.HISTORY)}
                    className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 md:px-6 py-2.5 rounded-[1.1rem] transition-all text-xs font-black uppercase tracking-widest
                    ${activeTab === PatientTabs.HISTORY ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <History size={14} /> Historial
                </button>
                <button
                    onClick={() => setActiveTab(PatientTabs.DOCUMENTS)}
                    className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 md:px-6 py-2.5 rounded-[1.1rem] transition-all text-xs font-black uppercase tracking-widest
                    ${activeTab === PatientTabs.DOCUMENTS ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <FileText size={14} /> Documentos
                </button>
            </div>

            {/* CONTENIDO VARIABLE */}
            <div className="min-h-[400px]">
                {activeTab === PatientTabs.HISTORY ? (
                    <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                        {/* Filtros Historial */}
                        <div className="flex flex-col gap-3 bg-white p-4 rounded-[1.8rem] border border-slate-100 shadow-sm">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                <TabButton label="Todos" isActive={selectedSpec === 'ALL'} onClick={() => setSelectedSpec('ALL')} />
                                {Object.values(MedicalSpeciality).map((spec) => (
                                    <TabButton key={spec} label={spec} isActive={selectedSpec === spec} onClick={() => setSelectedSpec(spec)} />
                                ))}
                            </div>
                            <div className="relative w-full">
                                <MagnifyingGlassIcon className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Listado de Registros */}
                        <div className="space-y-3">
                            {history.length === 0 ? (
                                <div className="py-16 text-center bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-widest">No hay registros</div>
                            ) : (
                                <>
                                    {history.map((record: ClinicalControl) => (
                                        <div key={record.id} onClick={() => navigation.patients.viewControl(id, record.id)} className="bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[1.8rem] border border-slate-100 hover:border-blue-300 transition-all flex items-center gap-3 md:gap-6 cursor-pointer group">
                                            <div className="shrink-0">
                                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${getTypeStyle(record.type as ControlType)}`}>
                                                    {record.type}
                                                </span>
                                                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight whitespace-nowrap">{record.date}</p>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2">{record.note}</p>
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
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right-2 duration-300">
                        <DocumentsContainer patientId={id} />
                    </div>
                )}
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