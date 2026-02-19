import React from 'react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import {
    UserPlus,
    CalendarPlus,
    Activity,
    Archive,
    ChevronRight,
    CalendarDays
} from 'lucide-react';
import { useDashboard, DashboardAppointment } from './use-dashboard';

export const DashboardContainer: React.FC = () => {
    const { userName, todayFormatted, appointments, actions, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
                <div className="lg:col-span-8 space-y-6">
                    <div className="h-12 bg-slate-100 rounded-lg w-1/3" />
                    <div className="h-96 bg-slate-100 rounded-2xl" />
                </div>
                <div className="lg:col-span-4 space-y-4">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-slate-100 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* COLUMNA PRINCIPAL */}
            <div className="lg:col-span-8 space-y-6">

                {/* Cabecera Minimalista (Reemplaza al Banner pesado) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                    <div>
                        <Typography variant={TypographyVariant.HEADER} className="text-2xl font-bold text-slate-900">
                            Buen día, {userName}
                        </Typography>
                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                            <CalendarDays size={14} className="text-[#1E3A8A]" />
                            <Typography variant={TypographyVariant.CAPTION} className="capitalize font-medium">
                                {todayFormatted}
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* Lista de Citas */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <Activity size={18} className="text-[#1E3A8A]" />
                            </div>
                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-slate-800">
                                Próximas citas de hoy
                            </Typography>
                        </div>
                        <Button
                            variant={ButtonVariant.CANCEL}
                            className="py-2 px-4 text-xs bg-transparent border-none text-[#1E3A8A] hover:bg-blue-50 font-bold"
                            onClick={actions.viewAgenda}
                        >
                            Ver agenda completa
                        </Button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                        {appointments.length > 0 ? (
                            appointments.map((cita) => (
                                <div
                                    key={cita.id}
                                    onClick={() => actions.manageAppointment(cita.id)}
                                    className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-10 flex-1">
                                        <div className="flex flex-col min-w-[85px] border-r border-slate-100">
                                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-slate-900 text-xl tracking-tight">
                                                {cita.time}
                                            </Typography>
                                            <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 font-medium">
                                                {cita.endTime ? `Fin: ${cita.endTime}` : 'Inicio'}
                                            </Typography>
                                        </div>

                                        <div className="space-y-1">
                                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-slate-800 group-hover:text-[#1E3A8A] transition-colors text-lg">
                                                {cita.patient}
                                            </Typography>
                                            <Typography variant={TypographyVariant.CAPTION} className="text-slate-500 font-medium">
                                                {cita.desc}
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${cita.statusColor}`}>
                                            {cita.statusLabel}
                                        </span>
                                        <div className="h-9 w-9 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-[#1E3A8A] group-hover:text-white transition-all shadow-sm">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center bg-slate-50/20">
                                <Typography variant={TypographyVariant.HELPER} className="text-slate-400">
                                    No hay citas programadas para el resto del día.
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* COLUMNA LATERAL */}
            <div className="lg:col-span-4 space-y-6">
                <Typography variant={TypographyVariant.OVERLINE} className="px-1 text-slate-400 font-bold tracking-widest">
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
        className="w-full !p-5 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 hover:shadow-md hover:border-blue-200 transition-all group flex items-center justify-start text-left h-auto shadow-sm"
    >
        <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-[#1E3A8A] group-hover:text-white flex items-center justify-center transition-all mr-4">
            {icon}
        </div>
        <div>
            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-slate-800 group-hover:text-slate-900 text-base leading-none">
                {title}
            </Typography>
            <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 font-normal mt-1 leading-tight">
                {desc}
            </Typography>
        </div>
    </Button>
);