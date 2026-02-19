import React from 'react';
import {
    Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Plus, Search,
    ChevronDown, ArrowRight, Clock
} from 'lucide-react';
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
    ALL_STATUSES
} from './use-appointment-list-container';

export const AppointmentsView: React.FC = () => {
    const navigation = useNavigation();
    const {
        viewMode, setViewMode, weekRangeLabel, moveWeek, daysOfCurrentWeek,
        appointments, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
        selectedAppointment, setSelectedAppointment, loading
    } = useAppointmentsContainer();

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-4 p-2 overflow-hidden relative">

            {/* HEADER CON FILTROS DINÁMICOS */}
            <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
                        <button
                            onClick={() => setViewMode(ViewMode.WEEKLY)}
                            className={`p-2 rounded-lg transition-all ${viewMode === ViewMode.WEEKLY ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <CalendarIcon size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode(ViewMode.TABLE)}
                            className={`p-2 rounded-lg transition-all ${viewMode === ViewMode.TABLE ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>

                    {viewMode === ViewMode.WEEKLY && (
                        <div className="flex items-center gap-3 border-l pl-4 border-slate-100">
                            <div className="flex gap-1">
                                <button onClick={() => moveWeek('prev')} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 transition-colors"><ChevronLeft size={18} /></button>
                                <button onClick={() => moveWeek('next')} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 transition-colors"><ChevronRight size={18} /></button>
                            </div>
                            <Typography variant={TypographyVariant.BODY_BOLD} className="text-slate-700 text-sm whitespace-nowrap min-w-[120px]">
                                {weekRangeLabel}
                            </Typography>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar paciente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all"
                        />
                    </div>

                    {/* SELECT DINÁMICO */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none cursor-pointer hover:border-blue-300 transition-colors"
                        >
                            {Object.entries(statusConfig).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <Button variant={ButtonVariant.PRIMARY} className="rounded-xl h-10 shadow-lg shadow-blue-500/10" onClick={navigation.appointments.create}>
                        <Plus size={18} /> <span className="hidden lg:inline ml-1">Nueva Cita</span>
                    </Button>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex gap-4 overflow-hidden">
                <div className={`flex-1 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col ${loading ? 'opacity-60 cursor-wait' : ''}`}>
                    {viewMode === ViewMode.WEEKLY ? (
                        <div className="grid grid-cols-7 h-full divide-x divide-slate-100 overflow-y-auto scrollbar-hide">
                            {daysOfCurrentWeek.map((day, i) => (
                                <div key={i} className={`flex flex-col min-w-[140px] ${isSameDay(day, new Date()) ? 'bg-blue-50/5' : ''}`}>
                                    <div className={`p-4 border-b border-slate-50 text-center sticky top-0 bg-white/80 backdrop-blur-sm z-10 ${isSameDay(day, new Date()) ? 'border-b-blue-100' : ''}`}>
                                        <Typography variant={TypographyVariant.CAPTION} className={`uppercase font-black text-[10px] tracking-widest ${isSameDay(day, new Date()) ? 'text-blue-500' : 'text-slate-300'}`}>
                                            {format(day, 'eee', { locale: es })}
                                        </Typography>
                                        <Typography variant={TypographyVariant.BODY_BOLD} className={`text-xl ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-slate-600'}`}>
                                            {format(day, 'dd')}
                                        </Typography>
                                    </div>
                                    <div className="p-3 space-y-3 flex-1 overflow-y-auto scrollbar-hide">
                                        {appointments.filter(app => isSameDay(app.date, day)).map(app => (
                                            <div
                                                key={app.id}
                                                onClick={() => setSelectedAppointment(app)}
                                                className="p-3 rounded-2xl bg-white border border-slate-100 cursor-pointer hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all group shadow-sm"
                                            >
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                    <Typography variant={TypographyVariant.CAPTION} className="font-black text-blue-500 text-[10px]">{app.time}</Typography>
                                                </div>
                                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-[12px] leading-tight text-slate-800 mb-1 line-clamp-2">
                                                    {app.patient}
                                                </Typography>
                                                <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400 font-medium truncate">
                                                    {app.type}
                                                </Typography>
                                                <div className={`mt-2 h-1 w-full rounded-full opacity-30 ${app.statusColor.split(' ')[0]}`}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto">
                            <Table
                                columns={[
                                    { header: 'Paciente', accessor: 'patient' },
                                    { header: 'Especialidad / Servicio', accessor: 'type' },
                                    { header: 'Fecha y Hora', accessor: 'date' },
                                    { header: 'Estado', accessor: 'status' },
                                    { header: '', accessor: 'actions' },
                                ] as any}
                                data={appointments.map(app => ({
                                    ...app,
                                    patient: (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[#1E3A8A]/5 text-[#1E3A8A] flex items-center justify-center text-[11px] font-black">{app.patient.charAt(0)}</div>
                                            <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-slate-700">{app.patient}</Typography>
                                        </div>
                                    ),
                                    date: (
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Clock size={12} className="text-blue-500" />
                                                <Typography variant={TypographyVariant.CAPTION} className="font-bold">{app.time}</Typography>
                                            </div>
                                            <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 text-[10px]">{format(app.date, 'dd MMMM, yyyy', { locale: es })}</Typography>
                                        </div>
                                    ),
                                    status: (
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${app.statusColor}`}>
                                            {app.statusLabel}
                                        </span>
                                    ),
                                    actions: <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-300 hover:text-blue-600 transition-all"><ArrowRight size={16} /></button>
                                }))}
                                onRowClick={(row) => setSelectedAppointment(row as any)}
                                totalRows={appointments.length}
                                itemsPerPage={15}
                                currentPage={1}
                                onPageChange={() => { }}
                            />
                        </div>
                    )}
                </div>

                {selectedAppointment && (
                    <AppointmentDetailPanel appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
                )}
            </div>
        </div>
    );
};