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
    History
} from "lucide-react";
import { Button, ButtonVariant } from "@/components/common/button/button";
import { MedicalSpeciality } from "@/types/medical-controls/medical-control.types";
import { ClinicalControl, ControlType } from "@/types/otros/clinical";
import { DocumentsContainer } from "../../documents/documents-view";

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
    const {
        patient, history, summary, isLoading, isFetching,
        hasMore, searchTerm, setSearchTerm, selectedSpec, setSelectedSpec, loadMore
    } = usePatientDetail(id);

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
        <div className="max-w-[1400px] mx-auto p-6 space-y-8 animate-in fade-in duration-500">

            {/* PERFIL PACIENTE */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="h-20 w-20 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-slate-200">
                        {patient.firstName.charAt(0)}
                    </div>
                    <div className="text-center md:text-left">
                        <Typography variant={TypographyVariant.HEADER} className="text-2xl font-black text-slate-900 leading-tight">
                            {patient.firstName} {patient.lastName}
                        </Typography>
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1 mt-1">
                            <HeaderInfo icon={<IdentificationIcon className="h-3.5 w-3.5" />} text={patient.uuid.split('-')[0].toUpperCase()} />
                            <HeaderInfo icon={<PhoneIcon className="h-3.5 w-3.5" />} text={patient.phone} />
                            <HeaderInfo icon={<EnvelopeIcon className="h-3.5 w-3.5" />} text="Sin correo" isWarning />
                        </div>
                    </div>
                </div>
                <Button variant={ButtonVariant.PRIMARY} className="rounded-xl px-5 h-10 shadow-lg shadow-blue-100" onClick={() => navigation.patients.addControl(id)}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    <span className="text-xs font-bold uppercase tracking-tight">Nuevo registro</span>
                </Button>
            </div>

            {/* INDICADORES RÁPIDOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Próxima cita" value={summary.nextAppointment} icon={<CalendarIcon className="h-5 w-5 text-blue-600" />} />
                <StatCard title="Garantía equipo" value={summary.warrantyExpiration} icon={<ShieldCheckIcon className="h-5 w-5 text-emerald-600" />} />
                <StatCard title="Mantenimientos" value={`${summary.pendingMaintenance.length} pendientes`} icon={<WrenchScrewdriverIcon className="h-5 w-5 text-amber-600" />} />
            </div>

            {/* NAVEGACIÓN INTERNA */}
            <div className="flex gap-1.5 p-1 bg-slate-100/80 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab(PatientTabs.HISTORY)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] transition-all text-xs font-black uppercase tracking-widest
                    ${activeTab === PatientTabs.HISTORY ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <History size={14} /> Historial
                </button>
                <button
                    onClick={() => setActiveTab(PatientTabs.DOCUMENTS)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.1rem] transition-all text-xs font-black uppercase tracking-widest
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
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[1.8rem] border border-slate-100 shadow-sm">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                <TabButton label="Todos" isActive={selectedSpec === 'ALL'} onClick={() => setSelectedSpec('ALL')} />
                                {Object.values(MedicalSpeciality).map((spec) => (
                                    <TabButton key={spec} label={spec} isActive={selectedSpec === spec} onClick={() => setSelectedSpec(spec)} />
                                ))}
                            </div>
                            <div className="relative w-full md:w-64">
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
                                history.map((record: ClinicalControl) => (
                                    <div key={record.id} onClick={() => navigation.patients.viewControl(id, record.id)} className="bg-white p-5 rounded-[1.8rem] border border-slate-100 hover:border-blue-300 transition-all flex items-center gap-6 cursor-pointer group">
                                        <div className="w-32 shrink-0">
                                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${getTypeStyle(record.type as ControlType)}`}>
                                                {record.type}
                                            </span>
                                            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">{record.date}</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1">{record.note}</p>
                                        </div>
                                        <ChevronRightIcon className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                ))
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
    );
};