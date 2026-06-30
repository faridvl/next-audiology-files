import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Plus, Search,
    ChevronDown, ArrowRight, Clock, Loader2, CheckSquare, Square, Users
} from 'lucide-react';
import { TEXT } from '@/static/texts/i18n';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { Table } from '@/components/common/table/table';
import { useNavigation } from '@/hooks/use-navigation';
import { AppointmentDetailPanel } from '../appointment-detail-panel/appointment-detail-panel';
import {
    useAppointmentsContainer,
    ViewMode,
    statusConfig,
    specialityColorMap,
} from './use-appointment-list-container';
import { AppointmentStatus } from '@/types/appointments/appointment';
import { AppointmentUI } from '@/types/appointments/appointment-ui.types';

const DEFAULT_TYPE_COLOR = '#6366F1';

function getTypeAccentStyle(typeColor?: string | null) {
    const color = typeColor || DEFAULT_TYPE_COLOR;
    return { backgroundColor: `${color}14`, borderColor: `${color}30` };
}

function getTypeDotStyle(typeColor?: string | null) {
    return { backgroundColor: typeColor || DEFAULT_TYPE_COLOR };
}

function getSpecialityBarStyle(typeSpeciality?: string | null) {
    const color = typeSpeciality ? (specialityColorMap[typeSpeciality] || '#94A3B8') : null;
    if (!color) return null;
    return { backgroundColor: color };
}

interface AppointmentCardProps {
    appointment: AppointmentUI;
    onClick: () => void;
    compact?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onClick, compact = false }) => {
    const specialityBar = getSpecialityBarStyle(appointment.typeSpeciality);
    const accentStyle = getTypeAccentStyle(appointment.typeColor);
    const dotStyle = getTypeDotStyle(appointment.typeColor);

    return (
        <div
            onClick={onClick}
            style={accentStyle}
            className="rounded-app-md border cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden"
        >
            {/* barra lateral de color de tipo de cita */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={dotStyle}
            />

            <div className={`pl-3 pr-3 ${compact ? 'py-2.5' : 'py-3'}`}>
                {/* hora */}
                <div className="flex items-center gap-1.5 mb-1.5">
                    <Clock size={10} className="text-neutral-400 shrink-0" />
                    <span className="text-[10px] font-black text-neutral-500">{appointment.time}</span>
                    <span className={`ml-auto px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${appointment.statusColor}`}>
                        {appointment.statusLabel}
                    </span>
                </div>

                {/* paciente */}
                <Typography
                    variant={TypographyVariant.BODY_BOLD}
                    className={`leading-tight text-neutral-800 ${compact ? 'text-[11px]' : 'text-[12px]'} line-clamp-2 mb-1`}
                >
                    {appointment.patient}
                </Typography>

                {/* tipo de cita */}
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={dotStyle} />
                    <Typography variant={TypographyVariant.CAPTION} className="text-[9px] text-neutral-500 font-semibold truncate">
                        {appointment.type}
                    </Typography>
                </div>

                {appointment.notes && !compact && (
                    <Typography variant={TypographyVariant.CAPTION} className="text-[9px] text-neutral-400 italic truncate mt-1">
                        {appointment.notes}
                    </Typography>
                )}
            </div>

            {/* barra de especialidad al fondo — solo visible si hay especialidad */}
            {specialityBar && (
                <div
                    className="h-1 w-full opacity-60"
                    style={specialityBar}
                />
            )}
        </div>
    );
};

export const AppointmentsView: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const {
        viewMode, setViewMode, weekRangeLabel, moveWeek, daysOfCurrentWeek,
        appointments, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
        selectedAppointment, setSelectedAppointment, isLoading,
        selectedIds, toggleSelectAppointment, bulkTargetStatus, setBulkTargetStatus,
        isBulkPending, handleBulkStatusChange
    } = useAppointmentsContainer();

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-4 p-2 overflow-hidden relative">

            {/* HEADER CON FILTROS */}
            <div className="bg-white p-4 rounded-app-md border border-neutral-100 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/* toggle vista */}
                        <div className="flex bg-neutral-100 p-1 rounded-app-sm shadow-inner">
                            <button
                                onClick={() => setViewMode(ViewMode.WEEKLY)}
                                className={`p-2 rounded-lg transition-all ${viewMode === ViewMode.WEEKLY ? 'bg-white shadow-sm text-primary' : 'text-neutral-400 hover:text-neutral-600'}`}
                            >
                                <CalendarIcon size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode(ViewMode.TABLE)}
                                className={`p-2 rounded-lg transition-all ${viewMode === ViewMode.TABLE ? 'bg-white shadow-sm text-primary' : 'text-neutral-400 hover:text-neutral-600'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>

                        {viewMode === ViewMode.WEEKLY && (
                            <div className="flex items-center gap-2 border-l pl-3 border-neutral-100">
                                <button onClick={() => moveWeek('prev')} className="p-1.5 hover:bg-neutral-50 rounded-md text-neutral-400 transition-colors">
                                    <ChevronLeft size={18} />
                                </button>
                                <button onClick={() => moveWeek('next')} className="p-1.5 hover:bg-neutral-50 rounded-md text-neutral-400 transition-colors">
                                    <ChevronRight size={18} />
                                </button>
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-700 text-xs md:text-sm whitespace-nowrap hidden sm:block">
                                    {weekRangeLabel}
                                </Typography>
                            </div>
                        )}
                    </div>

                    <Button
                        variant={ButtonVariant.PRIMARY}
                        className="rounded-app-sm h-10 shadow-lg shadow-primary/10 shrink-0"
                        onClick={navigation.appointments.create}
                    >
                        <Plus size={18} />
                        <span className="hidden lg:inline ml-1">{t(TEXT.APPOINTMENTS.LIST.NEW_BUTTON)}</span>
                    </Button>
                </div>

                {/* búsqueda + filtro */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder={t(TEXT.APPOINTMENTS.LIST.SEARCH_PLACEHOLDER)}
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-transparent rounded-app-sm text-sm outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2 bg-white border border-neutral-200 rounded-app-sm text-xs font-bold text-neutral-600 outline-none cursor-pointer hover:border-primary/40 transition-colors"
                        >
                            {Object.entries(statusConfig).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex gap-4 overflow-hidden">
                <div className={`flex-1 bg-white rounded-app-lg border border-neutral-100 shadow-sm overflow-hidden flex flex-col ${isLoading ? 'opacity-60 cursor-wait' : ''}`}>

                    {viewMode === ViewMode.WEEKLY ? (
                        <div className="flex md:grid md:grid-cols-7 h-full divide-x divide-neutral-100 overflow-x-auto overflow-y-hidden">
                            {daysOfCurrentWeek.map((day, i) => {
                                const dayAppointments = appointments.filter(app => isSameDay(app.date, day));
                                const isToday = isSameDay(day, new Date());

                                return (
                                    <div key={i} className={`flex flex-col min-w-[140px] md:min-w-0 shrink-0 md:shrink ${isToday ? 'bg-primary-soft/30' : ''}`}>
                                        {/* header de columna */}
                                        <div className={`p-3 border-b text-center sticky top-0 z-10 backdrop-blur-sm ${isToday ? 'bg-primary-soft/80 border-b-primary-soft' : 'bg-white/80 border-neutral-50'}`}>
                                            <Typography
                                                variant={TypographyVariant.CAPTION}
                                                className={`uppercase font-black text-[9px] tracking-widest block ${isToday ? 'text-primary' : 'text-neutral-300'}`}
                                            >
                                                {format(day, 'eee', { locale: es })}
                                            </Typography>
                                            <Typography
                                                variant={TypographyVariant.BODY_BOLD}
                                                className={`text-xl leading-none ${isToday ? 'text-primary' : 'text-neutral-600'}`}
                                            >
                                                {format(day, 'dd')}
                                            </Typography>
                                            {/* contador de citas */}
                                            {dayAppointments.length > 0 && (
                                                <div className={`mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black ${isToday ? 'bg-primary-soft text-primary' : 'bg-neutral-100 text-neutral-400'}`}>
                                                    <Users size={8} />
                                                    {dayAppointments.length}
                                                </div>
                                            )}
                                        </div>

                                        {/* cards del día */}
                                        <div className="p-2 space-y-2 flex-1 overflow-y-auto scrollbar-hide">
                                            {dayAppointments.length === 0 ? (
                                                <div className="flex items-center justify-center h-16 opacity-0 group-hover:opacity-100">
                                                    <div className="w-4 h-px bg-neutral-100 rounded" />
                                                </div>
                                            ) : (
                                                dayAppointments.map(app => (
                                                    <AppointmentCard
                                                        key={app.id}
                                                        appointment={app}
                                                        onClick={() => setSelectedAppointment(app)}
                                                        compact
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto flex flex-col">
                            {/* barra de acciones en lote */}
                            {selectedIds.size > 0 && (
                                <div className="flex items-center gap-3 px-4 py-3 bg-primary-soft border-b border-primary-soft">
                                    <Typography variant={TypographyVariant.CAPTION} className="font-bold text-primary-dark">
                                        {selectedIds.size} {t(TEXT.APPOINTMENTS.LIST.BULK.SELECTED)}
                                    </Typography>
                                    <select
                                        value={bulkTargetStatus}
                                        onChange={(event) => setBulkTargetStatus(event.target.value as AppointmentStatus | '')}
                                        className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-primary-soft rounded-lg text-xs font-bold text-neutral-600 outline-none cursor-pointer"
                                    >
                                        <option value="">{t(TEXT.APPOINTMENTS.LIST.BULK.CHANGE_STATUS)}</option>
                                        {Object.values(AppointmentStatus).map((status) => (
                                            <option key={status} value={status}>{statusConfig[status]?.label || status}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleBulkStatusChange}
                                        disabled={!bulkTargetStatus || isBulkPending}
                                        className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-primary-dark transition-colors"
                                    >
                                        {isBulkPending ? <Loader2 size={12} className="animate-spin" /> : null}
                                        {t(TEXT.APPOINTMENTS.LIST.BULK.APPLY)}
                                    </button>
                                </div>
                            )}

                            <Table
                                columns={[
                                    { header: '', accessor: 'select' },
                                    { header: t(TEXT.APPOINTMENTS.LIST.COLUMNS.PATIENT), accessor: 'patient' },
                                    { header: t(TEXT.APPOINTMENTS.LIST.COLUMNS.SPECIALTY), accessor: 'type' },
                                    { header: t(TEXT.APPOINTMENTS.LIST.COLUMNS.DATE_TIME), accessor: 'date' },
                                    { header: t(TEXT.APPOINTMENTS.LIST.COLUMNS.STATUS), accessor: 'status' },
                                    { header: '', accessor: 'actions' },
                                ] as any}
                                data={appointments.map(appointment => {
                                    const dotStyle = getTypeDotStyle(appointment.typeColor);
                                    const specialityBar = getSpecialityBarStyle(appointment.typeSpeciality);

                                    return {
                                        ...appointment,
                                        select: (
                                            <button
                                                onClick={(event) => { event.stopPropagation(); toggleSelectAppointment(appointment.id); }}
                                                className="p-1 text-neutral-400 hover:text-primary transition-colors"
                                            >
                                                {selectedIds.has(appointment.id)
                                                    ? <CheckSquare size={16} className="text-primary" />
                                                    : <Square size={16} />}
                                            </button>
                                        ),
                                        patient: (
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-app-sm flex items-center justify-center text-[11px] font-black text-white shrink-0"
                                                    style={{ backgroundColor: appointment.typeColor || DEFAULT_TYPE_COLOR }}
                                                >
                                                    {appointment.patient.charAt(0)}
                                                </div>
                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-700 truncate">
                                                        {appointment.patient}
                                                    </Typography>
                                                    {appointment.notes && (
                                                        <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400 truncate max-w-[200px] italic">
                                                            {appointment.notes}
                                                        </Typography>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                        type: (
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-2 h-2 rounded-full shrink-0" style={dotStyle} />
                                                        <Typography variant={TypographyVariant.CAPTION} className="text-xs text-neutral-700 font-semibold">
                                                            {appointment.type}
                                                        </Typography>
                                                    </div>
                                                    {specialityBar && (
                                                        <div className="flex items-center gap-1.5 ml-3.5">
                                                            <div className="w-8 h-0.5 rounded-full" style={specialityBar} />
                                                            <Typography variant={TypographyVariant.CAPTION} className="text-[9px] text-neutral-400">
                                                                {appointment.typeSpeciality}
                                                            </Typography>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                        date: (
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2 text-neutral-700">
                                                    <Clock size={12} className="text-secondary" />
                                                    <Typography variant={TypographyVariant.CAPTION} className="font-bold">{appointment.time}</Typography>
                                                </div>
                                                <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 text-[10px]">
                                                    {format(appointment.date, 'dd MMMM, yyyy', { locale: es })}
                                                </Typography>
                                            </div>
                                        ),
                                        status: (
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${appointment.statusColor}`}>
                                                {appointment.statusLabel}
                                            </span>
                                        ),
                                        actions: (
                                            <button className="p-2 hover:bg-neutral-100 rounded-app-sm text-neutral-300 hover:text-primary transition-all">
                                                <ArrowRight size={16} />
                                            </button>
                                        ),
                                    };
                                })}
                                onRowClick={(row) => setSelectedAppointment(row as AppointmentUI)}
                                totalRows={appointments.length}
                                itemsPerPage={15}
                                currentPage={1}
                                onPageChange={() => { }}
                            />
                        </div>
                    )}
                </div>

                {selectedAppointment && (
                    <AppointmentDetailPanel
                        appointment={selectedAppointment}
                        onClose={() => setSelectedAppointment(null)}
                    />
                )}
            </div>
        </div>
    );
};
