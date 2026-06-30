import React from 'react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import {
    UserPlus,
    CalendarPlus,
    Activity,
    Archive,
    ChevronRight,
    CalendarDays,
    Clock,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { useDashboard } from './use-dashboard';

export const DashboardContainer: React.FC = () => {
    const { userName, todayFormatted, appointments, doctorMetrics, actions, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
                <div className="lg:col-span-8 space-y-6">
                    <div className="h-12 bg-neutral-100 rounded-lg w-1/3" />
                    <div className="h-24 bg-neutral-100 rounded-app-md" />
                    <div className="h-96 bg-neutral-100 rounded-app-md" />
                </div>
                <div className="lg:col-span-4 space-y-4">
                    {[1, 2, 3, 4].map((index) => <div key={index} className="h-24 bg-neutral-100 rounded-app-md" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* COLUMNA PRINCIPAL */}
            <div className="lg:col-span-8 space-y-6">

                {/* Cabecera Minimalista */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <Typography variant={TypographyVariant.HEADER} className="text-2xl font-bold text-neutral-900">
                            Buen día, {userName}
                        </Typography>
                        <div className="flex items-center gap-2 text-neutral-500 mt-1">
                            <CalendarDays size={14} className="text-primary" />
                            <Typography variant={TypographyVariant.CAPTION} className="capitalize font-medium">
                                {todayFormatted}
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* TARJETAS DE MÉTRICAS DEL MÉDICO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Próxima cita */}
                    <div className="bg-white border border-neutral-100 rounded-app-md p-5 shadow-sm flex items-start gap-4">
                        <div className="h-10 w-10 rounded-app-sm bg-primary-soft text-primary flex items-center justify-center shrink-0">
                            <Clock size={18} />
                        </div>
                        <div className="min-w-0">
                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 uppercase tracking-widest text-[9px] font-bold">
                                Próxima cita
                            </Typography>
                            {doctorMetrics.nextAppointment ? (
                                <>
                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-800 text-sm truncate">
                                        {doctorMetrics.nextAppointment.patient}
                                    </Typography>
                                    <Typography variant={TypographyVariant.CAPTION} className="text-primary font-bold text-xs">
                                        {doctorMetrics.nextAppointment.time}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-400 text-sm">
                                    Sin citas pendientes
                                </Typography>
                            )}
                        </div>
                    </div>

                    {/* Pacientes atendidos esta semana */}
                    <div className="bg-white border border-neutral-100 rounded-app-md p-5 shadow-sm flex items-start gap-4">
                        <div className="h-10 w-10 rounded-app-sm bg-success/10 text-success flex items-center justify-center shrink-0">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 uppercase tracking-widest text-[9px] font-bold">
                                Atendidos esta semana
                            </Typography>
                            <Typography variant={TypographyVariant.HEADER} className="text-2xl font-black text-neutral-800">
                                {doctorMetrics.completedThisWeek}
                            </Typography>
                            <Typography variant={TypographyVariant.CAPTION} className="text-success font-medium text-[10px]">
                                últimos 7 días
                            </Typography>
                        </div>
                    </div>

                    {/* Pendientes de confirmar */}
                    <div className="bg-white border border-neutral-100 rounded-app-md p-5 shadow-sm flex items-start gap-4">
                        <div className="h-10 w-10 rounded-app-sm bg-warning/10 text-warning flex items-center justify-center shrink-0">
                            <AlertCircle size={18} />
                        </div>
                        <div>
                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 uppercase tracking-widest text-[9px] font-bold">
                                Por confirmar
                            </Typography>
                            <Typography variant={TypographyVariant.HEADER} className="text-2xl font-black text-neutral-800">
                                {doctorMetrics.pendingConfirmation}
                            </Typography>
                            <Typography variant={TypographyVariant.CAPTION} className="text-warning font-medium text-[10px]">
                                citas tentativas/pendientes
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* Lista de Citas */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-4 rounded-app-sm border border-neutral-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-soft p-2 rounded-lg">
                                <Activity size={18} className="text-primary" />
                            </div>
                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-neutral-800">
                                Próximas citas de hoy
                            </Typography>
                        </div>
                        <Button
                            variant={ButtonVariant.CANCEL}
                            className="py-2 px-4 text-xs bg-transparent border-none text-primary hover:bg-primary-soft font-bold"
                            onClick={actions.viewAgenda}
                        >
                            Ver agenda completa
                        </Button>
                    </div>

                    <div className="bg-white rounded-app-md border border-neutral-100 shadow-sm overflow-hidden divide-y divide-neutral-50">
                        {appointments.length > 0 ? (
                            appointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    onClick={() => actions.manageAppointment(appointment.id)}
                                    className="p-6 flex items-center justify-between hover:bg-neutral-50/50 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-10 flex-1">
                                        <div className="flex flex-col min-w-[85px] border-r border-neutral-100">
                                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-neutral-900 text-xl tracking-tight">
                                                {appointment.time}
                                            </Typography>
                                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-medium">
                                                {appointment.endTime ? `Fin: ${appointment.endTime}` : 'Inicio'}
                                            </Typography>
                                        </div>

                                        <div className="space-y-1">
                                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-neutral-800 group-hover:text-primary transition-colors text-lg">
                                                {appointment.patient}
                                            </Typography>
                                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-500 font-medium">
                                                {appointment.description}
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${appointment.statusColor}`}>
                                            {appointment.statusLabel}
                                        </span>
                                        <div className="h-9 w-9 rounded-full flex items-center justify-center bg-neutral-50 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center bg-neutral-50/20">
                                <Typography variant={TypographyVariant.HELPER} className="text-neutral-400">
                                    No hay citas programadas para el resto del día.
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* COLUMNA LATERAL */}
            <div className="lg:col-span-4 space-y-6">
                <Typography variant={TypographyVariant.OVERLINE} className="px-1 text-neutral-400 font-bold tracking-widest">
                    Acciones rápidas
                </Typography>
                <div className="grid grid-cols-1 gap-4">
                    <QuickLink
                        icon={<UserPlus size={20} />}
                        title="Nuevo Paciente"
                        desc="Registrar ingreso al sistema"
                        onClick={actions.createPatient}
                    />
                    <QuickLink
                        icon={<CalendarPlus size={20} />}
                        title="Agendar Cita"
                        desc="Asignar espacio en calendario"
                        onClick={actions.createAppointment}
                    />
                    <QuickLink
                        icon={<Activity size={20} />}
                        title="Realizar Prueba"
                        desc="Iniciar estudio audiológico"
                        onClick={actions.goTests}
                    />
                    <QuickLink
                        icon={<Archive size={20} />}
                        title="Inventario"
                        desc="Control de stock y audífonos"
                        onClick={actions.goInventory}
                    />
                </div>
            </div>
        </div>
    );
};

interface QuickLinkProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    onClick: () => void;
}

const QuickLink: React.FC<QuickLinkProps> = ({ icon, title, desc, onClick }) => (
    <Button
        variant={ButtonVariant.CANCEL}
        onClick={onClick}
        className="w-full !p-5 bg-white border border-neutral-100 rounded-app-md hover:bg-neutral-50 hover:shadow-md hover:border-primary/20 transition-all group flex items-center justify-start text-left h-auto shadow-sm"
    >
        <div className="h-11 w-11 shrink-0 rounded-app-sm bg-neutral-50 text-neutral-500 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all mr-4">
            {icon}
        </div>
        <div>
            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-neutral-800 group-hover:text-neutral-900 text-base leading-none">
                {title}
            </Typography>
            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-normal mt-1 leading-tight">
                {desc}
            </Typography>
        </div>
    </Button>
);
