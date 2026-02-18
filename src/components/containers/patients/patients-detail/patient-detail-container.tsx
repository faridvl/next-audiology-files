import { useNavigation } from "@/hooks/use-navigation";
import { usePatientDetail } from "./use-patient-detail";
import { useState } from "react";
import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import { EnvelopeIcon, IdentificationIcon, MagnifyingGlassIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { CalendarIcon, ChevronRightIcon, PhoneIcon, PlusIcon, ShieldCheckIcon } from "lucide-react";
import { Button, ButtonVariant } from "@/components/common/button/button";
import { MedicalSpeciality } from "@/types/medical-controls/medical-control.types";
import { ClinicalControl, ControlType } from "@/types/otros/clinical";
const HeaderInfo = ({ icon, text, isWarning }: any) => (
    <div className="flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>

        <Typography
            variant={TypographyVariant.CAPTION}
            className={isWarning ? 'text-amber-600 italic' : undefined}
        >
            {text}
        </Typography>
    </div>
);

const StatCard = ({ title, value, icon, onClick }: any) => (
    <button
        onClick={onClick}
        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-[#1E3A8A]/30 hover:shadow-lg hover:-translate-y-1 transition-all text-left w-full group"
    >
        <div className="p-3 bg-[#F8FAFC] rounded-2xl transition-colors shadow-inner">
            {icon}
        </div>

        <div className="flex-1 space-y-1">
            <Typography variant={TypographyVariant.OVERLINE}>
                {title}
            </Typography>

            <Typography variant={TypographyVariant.SUBTITLE}>
                {value}
            </Typography>
        </div>

        <ChevronRightIcon className="h-4 w-4 text-slate-300 self-center" />
    </button>
);

const TabButton = ({ label, isActive, onClick }: any) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 rounded-xl transition-all whitespace-nowrap
        ${isActive
                ? 'bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20'
                : 'bg-white text-slate-500 hover:text-[#1E3A8A] border border-slate-100'
            }`}
    >
        <Typography variant={TypographyVariant.OVERLINE} as="span">
            {label}
        </Typography>
    </button>
);



export const PatientDetailContainer = ({ id }: { id: string }) => {
    const navigation = useNavigation();

    const getTypeStyle = (type: ControlType) => {
        switch (type) {
            case ControlType.AUDIOLOGY:
                return "bg-purple-50 text-purple-600 border border-purple-100";

            case ControlType.DENTAL:
                return "bg-blue-50 text-blue-600 border border-blue-100";

            case ControlType.GENERAL:
                return "bg-emerald-50 text-emerald-600 border border-emerald-100";

            default:
                return "bg-slate-50 text-slate-600 border border-slate-100";
        }
    };

    const {
        patient,
        history,
        summary,
        isLoading,
        isFetching,
        hasMore,
        searchTerm,
        setSearchTerm,
        selectedSpec,
        setSelectedSpec,
        loadMore
    } = usePatientDetail(id);

    const [activeModal, setActiveModal] = useState<{ type: string; data?: any } | null>(null);

    if (isLoading || !patient) {
        return (
            <div className="p-20 text-center animate-pulse">
                <div className="h-12 w-12 bg-[#1E3A8A]/10 rounded-full mx-auto mb-6 animate-bounce" />
                <Typography
                    variant={TypographyVariant.OVERLINE}
                    className="text-slate-500"
                >
                    Cargando expediente...
                </Typography>
            </div>
        );
    }

    const fullName = `${patient.firstName} ${patient.lastName}`;

    return (
        <div className="max-w-[1400px] mx-auto p-6 space-y-10 animate-in fade-in duration-500">

            {/* HEADER */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="h-24 w-24 bg-[#1E3A8A] rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-[#1E3A8A]/20">
                        {patient.firstName.charAt(0)}
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <Typography variant={TypographyVariant.HEADER}>
                            {fullName}
                        </Typography>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <HeaderInfo
                                icon={<IdentificationIcon className="h-4 w-4" />}
                                text={patient.uuid.split('-')[0].toUpperCase()}
                            />
                            <HeaderInfo
                                icon={<PhoneIcon className="h-4 w-4" />}
                                text={patient.phone}
                            />
                            <HeaderInfo
                                icon={<EnvelopeIcon className="h-4 w-4" />}
                                text="Sin correo"
                                isWarning
                            />
                        </div>
                    </div>
                </div>

                <Button
                    variant={ButtonVariant.PRIMARY}
                    className="rounded-2xl px-6 h-12 shadow-md"
                    onClick={() => navigation.patients.addControl(id)}
                >
                    <PlusIcon className="h-5 w-5 mr-2 stroke-[3px]" />
                    <Typography variant={TypographyVariant.BUTTON_TEXT} as="span">
                        Nuevo registro
                    </Typography>
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Próxima cita"
                    value={summary.nextAppointment}
                    icon={<CalendarIcon className="h-6 w-6 text-[#1E3A8A]" />}
                    onClick={() => setActiveModal({ type: 'APPOINTMENT', data: summary })}
                />

                <StatCard
                    title="Garantía equipo"
                    value={summary.warrantyExpiration}
                    icon={<ShieldCheckIcon className="h-6 w-6 text-emerald-600" />}
                    onClick={() => setActiveModal({ type: 'WARRANTY', data: summary })}
                />

                <StatCard
                    title="Mantenimientos"
                    value={`${summary.pendingMaintenance.length} pendientes`}
                    icon={<WrenchScrewdriverIcon className="h-6 w-6 text-amber-600" />}
                    onClick={() => setActiveModal({ type: 'MAINTENANCE', data: summary })}
                />
            </div>

            {/* FILTROS */}
            <div className="bg-[#F8FAFC] p-5 rounded-[2rem] border border-slate-100 space-y-5">

                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">

                    <div className="flex gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto">
                        <TabButton
                            label="Todos"
                            isActive={selectedSpec === 'ALL'}
                            onClick={() => setSelectedSpec('ALL')}
                        />

                        {Object.values(MedicalSpeciality).map((spec) => (
                            <TabButton
                                key={spec}
                                label={spec}
                                isActive={selectedSpec === spec}
                                onClick={() => setSelectedSpec(spec)}
                            />
                        ))}
                    </div>

                    <div className="relative w-full lg:w-80">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            placeholder="Buscar en el historial..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-sm focus:ring-4 focus:ring-[#1E3A8A]/10 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* LISTADO */}
            <div className="space-y-6">

                {history.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <Typography variant={TypographyVariant.BODY}>
                            No se encontraron registros con los filtros seleccionados
                        </Typography>
                    </div>
                ) : (
                    history.map((record: ClinicalControl) => (
                        <div
                            key={record.id}
                            className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-[#1E3A8A]/30 hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 group items-center"
                        >
                            <div
                                className="flex-1 flex flex-col md:flex-row gap-6 cursor-pointer w-full"
                                onClick={() => navigation.patients.viewControl(id, record.id)}
                            >
                                <div className="md:w-48 shrink-0 space-y-2">
                                    <Typography
                                        variant={TypographyVariant.OVERLINE}
                                        className={getTypeStyle(record.type as ControlType)}
                                    >
                                        {record.type}
                                    </Typography>

                                    <Typography variant={TypographyVariant.CAPTION}>
                                        {record.date}
                                    </Typography>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                                        {record.note}
                                    </Typography>

                                    <Typography
                                        variant={TypographyVariant.LINK_TEXT}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Ver reporte completo →
                                    </Typography>
                                </div>
                            </div>

                            <ChevronRightIcon className="h-5 w-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                    ))
                )}

                {hasMore && (
                    <div className="flex justify-center pt-4">
                        <Button
                            variant={ButtonVariant.CANCEL}
                            onClick={loadMore}
                            disabled={isFetching}
                            className="px-10 rounded-2xl h-14"
                        >
                            <Typography variant={TypographyVariant.BUTTON_TEXT}>
                                {isFetching ? "Cargando..." : "Mostrar registros más antiguos"}
                            </Typography>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
