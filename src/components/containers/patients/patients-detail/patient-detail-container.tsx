import React, { useState } from 'react';
import {
    PlusIcon, CalendarIcon,
    WrenchScrewdriverIcon, ShieldCheckIcon,
    EnvelopeIcon, PhoneIcon, IdentificationIcon,
    ChevronRightIcon, ArrowDownTrayIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { usePatientDetail } from './use-patient-detail';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useNavigation } from '@/hooks/use-navigation';
import { ClinicalControl, ControlType } from '@/types/otros/clinical';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';

export const PatientDetailContainer = ({ id }: { id: string }) => {
    const navigation = useNavigation();
    const {
        patient, history, summary, isLoading, isFetching, hasMore,
        searchTerm, setSearchTerm, selectedSpec, setSelectedSpec, loadMore
    } = usePatientDetail(id);

    const [activeModal, setActiveModal] = useState<{ type: string; data?: any } | null>(null);

    if (isLoading || !patient) {
        return (
            <div className="p-20 text-center animate-pulse">
                <div className="h-12 w-12 bg-blue-100 rounded-full mx-auto mb-4 animate-bounce" />
                <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 font-bold uppercase tracking-[0.3em]">
                    Cargando Expediente...
                </Typography>
            </div>
        );
    }

    const fullName = `${patient.firstName} ${patient.lastName}`;

    return (
        <div className="max-w-[1400px] mx-auto p-6 space-y-8 animate-in fade-in duration-500">

            {/* 1. HEADER DE PERFIL */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-100">
                        {patient.firstName.charAt(0)}
                    </div>
                    <div className="text-center md:text-left">
                        <Typography variant={TypographyVariant.HEADER} className="text-slate-800">{fullName}</Typography>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                            <HeaderInfo icon={<IdentificationIcon className="h-4 w-4" />} text={patient.uuid.split('-')[0].toUpperCase()} />
                            <HeaderInfo icon={<PhoneIcon className="h-4 w-4" />} text={patient.phone} />
                            <HeaderInfo icon={<EnvelopeIcon className="h-4 w-4" />} text="Sin Correo" isWarning />
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        className="rounded-2xl px-6 h-12 shadow-md"
                        onClick={() => navigation.patients.addControl(id)}
                    >
                        <PlusIcon className="h-5 w-5 mr-2 stroke-[3px]" /> Nuevo Registro
                    </Button>
                </div>
            </div>

            {/* 2. WIDGETS INTERACTIVOS (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Próxima Cita"
                    value={summary.nextAppointment}
                    icon={<CalendarIcon className="h-6 w-6 text-blue-500" />}
                    onClick={() => setActiveModal({ type: 'APPOINTMENT', data: summary })}
                />
                <StatCard
                    title="Garantía de Equipo"
                    value={summary.warrantyExpiration}
                    icon={<ShieldCheckIcon className="h-6 w-6 text-emerald-500" />}
                    onClick={() => setActiveModal({ type: 'WARRANTY', data: summary })}
                />
                <StatCard
                    title="Mantenimientos"
                    value={`${summary.pendingMaintenance.length} Pendientes`}
                    icon={<WrenchScrewdriverIcon className="h-6 w-6 text-orange-500" />}
                    onClick={() => setActiveModal({ type: 'MAINTENANCE', data: summary })}
                />
            </div>

            {/* 3. BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100 space-y-4">
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
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 4. LISTADO DE CONTROLES */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {history.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-slate-300 italic">
                                No se encontraron registros con los filtros seleccionados
                            </Typography>
                        </div>
                    ) : (
                        history.map((record: ClinicalControl) => (
                            <div
                                key={record.id}
                                className="w-full bg-white p-6 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 group items-center"
                            >
                                <div
                                    className="flex-1 flex flex-col md:flex-row gap-6 cursor-pointer w-full"
                                    onClick={() => navigation.patients.viewControl(id, record.id)}
                                >
                                    <div className="md:w-48 shrink-0">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getTypeStyle(record.type as ControlType)}`}>
                                            {record.type}
                                        </span>
                                        <p className="text-xs font-bold text-slate-400 mt-2">{record.date}</p>
                                    </div>
                                    <div className="flex-1">
                                        <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-slate-700 leading-relaxed line-clamp-2">
                                            {record.note}
                                        </Typography>
                                        <p className="text-[10px] font-bold text-blue-500 mt-2 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                            Ver reporte completo →
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 border-l border-slate-50 pl-6 shrink-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); }}
                                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                    >
                                        <ArrowDownTrayIcon className="h-6 w-6" />
                                    </button>
                                    <ChevronRightIcon className="h-5 w-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* BOTÓN CARGAR MÁS */}
                {hasMore && (
                    <div className="flex justify-center pt-4">
                        <Button
                            variant={ButtonVariant.CANCEL}
                            onClick={loadMore}
                            disabled={isFetching}
                            className="px-10 rounded-2xl border-2 border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] h-14 hover:bg-blue-50 hover:border-blue-100 transition-all disabled:opacity-50"
                        >
                            {isFetching ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    Cargando...
                                </div>
                            ) : (
                                "Mostrar registros más antiguos"
                            )}
                        </Button>
                    </div>
                )}
            </div>

            {/* 5. MODALES OPERATIVOS (Se mantienen igual) */}
            {/* ... rest of the modal code ... */}
        </div>
    );
};

/* --- COMPONENTES AUXILIARES --- */

const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-100'
            }`}
    >
        {label}
    </button>
);

const StatCard = ({ title, value, icon, onClick }: any) => (
    <button onClick={onClick} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all text-left w-full group">
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors shadow-inner">{icon}</div>
        <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
            <p className="text-lg font-bold text-slate-800 mt-1 leading-tight">{value}</p>
        </div>
        <ChevronRightIcon className="h-4 w-4 text-slate-300 self-center" />
    </button>
);

const HeaderInfo = ({ icon, text, isWarning }: any) => (
    <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-tight ${isWarning ? 'text-orange-500 italic' : 'text-slate-500'}`}>
        <span className="opacity-70">{icon}</span> {text}
    </div>
);

const getTypeStyle = (type: ControlType) => {
    switch (type) {
        case ControlType.AUDIOLOGY: return 'bg-purple-50 text-purple-600 border border-purple-100';
        case ControlType.DENTAL: return 'bg-blue-50 text-blue-600 border border-blue-100';
        case ControlType.GENERAL: return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        default: return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
};