import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button'; // Integración de componente estándar
import {
    Clock, User, ChevronRight, Calendar as CalendarIcon,
    Search, Plus, X, Phone, FileText
} from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';

// --- MOCK DATA EXTENDIDO ---
const MOCK_APPOINTMENTS = [
    { id: '1', date: '2026-02-14', time: '08:00 AM', patient: 'Farid Villacis', type: 'Evaluación Inicial', status: 'Confirmado', phone: '+593 999 999 999', notes: 'Paciente reporta tinnitus leve.' },
    { id: '2', date: '2026-02-14', time: '09:30 AM', patient: 'Maria Gomez', type: 'Audiometría Tonal', status: 'En Espera', phone: '+593 888 888 888', notes: 'Seguimiento post-operatorio.' },
    { id: '3', date: '2026-02-15', time: '11:00 AM', patient: 'Juan Perez', type: 'Ajuste de Audífonos', status: 'Pendiente', phone: '+593 777 777 777', notes: 'Cambio de moldes.' },
    { id: '4', date: '2026-02-16', time: '10:00 AM', patient: 'Andres Lopez', type: 'Limpieza', status: 'Confirmado', phone: '+593 666 666 666', notes: 'Cita de rutina.' },
];

// --- COMPONENTES AUXILIARES ---

const WeeklyCalendarHeader = ({ selectedDate, onDateSelect }: any) => {
    /* TODO(Farid): Generar esta semana dinámicamente con date-fns */
    const days = [
        { d: 'Lun', n: '14', full: '2026-02-14' },
        { d: 'Mar', n: '15', full: '2026-02-15' },
        { d: 'Mie', n: '16', full: '2026-02-16' },
        { d: 'Jue', n: '17', full: '2026-02-17' },
        { d: 'Vie', n: '18', full: '2026-02-18' },
        { d: 'Sab', n: '19', full: '2026-02-19' },
    ];

    return (
        <div className="grid grid-cols-6 gap-2 mb-6 animate-in fade-in zoom-in-95 duration-300">
            {days.map((day) => (
                <button
                    key={day.full}
                    onClick={() => onDateSelect(day.full)}
                    className={`flex flex-col items-center p-3 rounded-2xl transition-all ${selectedDate === day.full
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                        : 'bg-white border border-slate-100 text-slate-400 hover:border-blue-200'
                        }`}
                >
                    <Typography variant={TypographyVariant.OVERLINE} className={selectedDate === day.full ? 'text-white' : 'text-slate-400'}>
                        {day.d}
                    </Typography>
                    <Typography variant={TypographyVariant.ACCENT} className={selectedDate === day.full ? 'text-white' : 'text-slate-800'}>
                        {day.n}
                    </Typography>
                </button>
            ))}
        </div>
    );
};

const AppointmentRow = ({ appointment, onClick, isSelected }: any) => (
    <div
        onClick={() => onClick(appointment)}
        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/10' : 'bg-white border-slate-100 hover:bg-slate-50'
            }`}
    >
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-center min-w-[70px]">
                <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-slate-800">
                    {appointment.time}
                </Typography>
                <Clock size={14} className="text-slate-300" />
            </div>
            <div className="h-10 w-px bg-slate-100" />
            <div>
                <Typography variant={TypographyVariant.ACCENT} className="text-sm flex items-center gap-2">
                    <User size={14} className="text-slate-400" /> {appointment.patient}
                </Typography>
                <Typography variant={TypographyVariant.HELPER} className="text-xs">
                    {appointment.type}
                </Typography>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${appointment.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                {appointment.status}
            </span>
            <ChevronRight size={18} className={`transition-colors ${isSelected ? 'text-blue-500' : 'text-slate-300'}`} />
        </div>
    </div>
);

// --- MAIN PAGE ---

const Appointments: React.FC = () => {
    const navigation = useNavigation()
    const [view, setView] = useState<'day' | 'week'>('day');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('2026-02-14');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    // Lógica de filtrado
    const filteredAppointments = useMemo(() => {
        return MOCK_APPOINTMENTS.filter(app => {
            const matchesSearch = app.patient.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDate = app.date === selectedDate;
            return matchesSearch && matchesDate;
        });
    }, [searchTerm, selectedDate]);

    return (
        <>
            <Head>
                <title>Agenda | AudiologyFiles</title>
            </Head>
            <DashboardLayout
                isMainPage
                contentStyle={BoxedLayoutStyle.FULL}
                title="Agenda Médica"
            >
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">

                    {/* LADO IZQUIERDO: LISTADO */}
                    <div className="flex-1 space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Typography variant={TypographyVariant.ACCENT}>
                                    {selectedDate === '2026-02-14' ? 'Lunes, 14 de Febrero' : selectedDate}
                                </Typography>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button onClick={() => setView('day')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'day' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Día</button>
                                    <button onClick={() => setView('week')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'week' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Semana</button>
                                </div>
                            </div>

                            {/* Cambio: Uso de componente Button estandarizado */}
                            <Button
                                variant={ButtonVariant.PRIMARY}
                                onClick={navigation.appointments.create}
                            >
                                <Plus size={18} strokeWidth={3} />
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-white">
                                    Nueva Cita
                                </Typography>
                            </Button>
                        </div>

                        {/* Buscador y Selector de Fecha */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar paciente por nombre..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="date"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none shadow-sm"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {view === 'week' && (
                                <WeeklyCalendarHeader
                                    selectedDate={selectedDate}
                                    onDateSelect={setSelectedDate}
                                />
                            )}

                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1">
                                {filteredAppointments.length} Citas Encontradas
                            </Typography>

                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map(app => (
                                    <AppointmentRow
                                        key={app.id}
                                        appointment={app}
                                        onClick={setSelectedAppointment}
                                        isSelected={selectedAppointment?.id === app.id}
                                    />
                                ))
                            ) : (
                                <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <Typography variant={TypographyVariant.HELPER}>No hay citas para los criterios seleccionados.</Typography>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* LADO DERECHO: DETALLE */}
                    {selectedAppointment && (
                        <div className="w-full lg:w-80 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm h-fit animate-in fade-in slide-in-from-right-4 duration-300 lg:sticky lg:top-6">
                            <div className="flex justify-between items-start mb-6">
                                <Typography variant={TypographyVariant.ACCENT}>Detalle</Typography>
                                <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE}>Paciente</Typography>
                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-blue-600 block">{selectedAppointment.patient}</Typography>
                                    <div className="flex items-center gap-2 mt-1 text-slate-500">
                                        <Phone size={14} /> <Typography variant={TypographyVariant.CAPTION}>{selectedAppointment.phone}</Typography>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Typography variant={TypographyVariant.OVERLINE}>Hora</Typography>
                                        <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm">{selectedAppointment.time}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant={TypographyVariant.OVERLINE}>Estado</Typography>
                                        <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm text-emerald-600">{selectedAppointment.status}</Typography>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE}>Procedimiento</Typography>
                                    <div className="flex items-center gap-2 mt-1">
                                        <FileText size={14} className="text-slate-400" />
                                        <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm">{selectedAppointment.type}</Typography>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <Typography variant={TypographyVariant.OVERLINE}>Notas</Typography>
                                    <Typography variant={TypographyVariant.HELPER} className="mt-1 text-xs leading-relaxed italic">
                                        "{selectedAppointment.notes}"
                                    </Typography>
                                </div>

                                {/* Cambio: Botón Ver Expediente con navegación dinámica */}
                                <Button
                                    variant={ButtonVariant.PRIMARY}
                                    className="w-full bg-slate-900 shadow-slate-200 hover:bg-black"
                                    onClick={() => navigation.patients.detail(selectedAppointment.id)}
                                >
                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-white">
                                        Ver Expediente
                                    </Typography>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default Appointments;

/* =============================================================================
SUGERENCIA DE ESTRUCTURA DE BASE DE DATOS - MÓDULO DE AGENDA
=============================================================================

Para que la agenda sea 100% funcional y escalable, se recomienda el siguiente 
esquema relacional (PostgreSQL / MySQL):

1. TABLA: patients (Pacientes)
   - id: uuid (PK)
   - first_name: varchar(100)
   - last_name: varchar(100)
   - phone: varchar(20)
   - email: varchar(100)
   - document_id: varchar(50) -- DNI, Cédula, etc.
   - birth_date: date

2. TABLA: appointment_types (Catálogo de Procedimientos)
   - id: serial (PK)
   - name: varchar(100) -- Ej: "Audiometría Tonal", "Limpieza"
   - default_duration: integer -- Duración en minutos
   - hex_color: varchar(7) -- Color para la UI (ej: #3b82f6)
   - cost: decimal(10,2)

3. TABLA: appointments (Citas Médicas)
   - id: uuid (PK)
   - patient_id: uuid (FK -> patients.id)
   - type_id: integer (FK -> appointment_types.id)
   - doctor_id: uuid (FK -> users.id) -- El profesional asignado
   - date: date -- Fecha de la cita
   - start_time: time -- Hora de inicio
   - end_time: time -- Hora calculada de fin
   - status: enum ('PENDING', 'CONFIRMED', 'IN_WAITING', 'CANCELLED', 'COMPLETED')
   - notes: text -- Observaciones internas
   - created_at: timestamp
   - updated_at: timestamp

-----------------------------------------------------------------------------
VISTA RECOMENDADA (Para el listado de la UI):
-----------------------------------------------------------------------------
SELECT 
    a.id,
    a.date,
    a.start_time,
    concat(p.first_name, ' ', p.last_name) as patient_name,
    p.phone as patient_phone,
    at.name as procedure_name,
    a.status,
    a.notes
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN appointment_types at ON a.type_id = at.id
WHERE a.date = :selectedDate
ORDER BY a.start_time ASC;
=============================================================================
*/