import React from 'react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import {
    UserPlus,
    CalendarPlus,
    Activity,
    Archive,
    ChevronRight,
    Clock
} from 'lucide-react';
import { useDashboard } from './use-dashboard';

export const DashboardContainer: React.FC = () => {
    const { userName, todayFormatted, appointments, actions, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
                <div className="lg:col-span-8 space-y-6">
                    <div className="h-40 bg-slate-100 rounded-xl" />
                    <div className="h-64 bg-slate-100 rounded-xl" />
                </div>
                <div className="lg:col-span-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* IZQUIERDA */}
            <div className="lg:col-span-8 space-y-8">

                {/* Bienvenida */}
                <div className="p-8 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <Typography
                        variant={TypographyVariant.OVERLINE}
                        className="text-[#1E3A8A]"
                    >
                        Panel Zynka
                    </Typography>

                    <Typography
                        variant={TypographyVariant.HEADER}
                        className="mt-2"
                    >
                        Hola, {userName}
                    </Typography>

                    <Typography
                        variant={TypographyVariant.BODY}
                        className="mt-3 text-slate-500"
                    >
                        {todayFormatted} · Tienes{' '}
                        <span className="text-[#1E3A8A] font-semibold">
                            {appointments.length} citas
                        </span>{' '}
                        programadas hoy.
                    </Typography>
                </div>

                {/* Agenda */}
                <div className="space-y-4">

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-slate-400" />
                            <Typography variant={TypographyVariant.OVERLINE}>
                                Próximas citas
                            </Typography>
                        </div>

                        <button
                            onClick={actions.viewAgenda}
                            className="text-sm text-[#1E3A8A] font-medium hover:underline"
                        >
                            Ver agenda
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100">

                        {appointments.length > 0 ? (
                            appointments.map((cita, i) => (
                                <div
                                    key={i}
                                    className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-6">

                                        <div className="text-center w-14">
                                            <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                                                {cita.time}
                                            </Typography>
                                            <Typography variant={TypographyVariant.CAPTION}>
                                                AM
                                            </Typography>
                                        </div>

                                        <div>
                                            <Typography
                                                variant={TypographyVariant.BODY_SEMIBOLD}
                                                className="group-hover:text-[#1E3A8A] transition-colors"
                                            >
                                                {cita.patient}
                                            </Typography>

                                            <Typography
                                                variant={TypographyVariant.CAPTION}
                                            >
                                                {cita.desc}
                                            </Typography>
                                        </div>
                                    </div>

                                    <ChevronRight
                                        size={18}
                                        className="text-slate-300 group-hover:text-[#1E3A8A] transition-all group-hover:translate-x-1"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <Typography variant={TypographyVariant.HELPER}>
                                    No hay citas programadas para hoy.
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DERECHA */}
            <div className="lg:col-span-4 space-y-6">

                <Typography variant={TypographyVariant.OVERLINE}>
                    Acciones rápidas
                </Typography>

                <div className="space-y-4">
                    <QuickLink
                        icon={<UserPlus size={18} />}
                        title="Nuevo Paciente"
                        desc="Crear expediente clínico"
                        onClick={actions.createPatient}
                    />
                    <QuickLink
                        icon={<CalendarPlus size={18} />}
                        title="Agendar Cita"
                        desc="Programar en agenda"
                        onClick={actions.createAppointment}
                    />
                    <QuickLink
                        icon={<Activity size={18} />}
                        title="Realizar Prueba"
                        desc="Iniciar estudio clínico"
                        onClick={actions.goTests}
                    />
                    <QuickLink
                        icon={<Archive size={18} />}
                        title="Inventario"
                        desc="Consultar stock"
                        onClick={actions.goInventory}
                    />
                </div>
            </div>
        </div>
    );
};


const QuickLink = ({
    icon,
    title,
    desc,
    onClick
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className="flex items-center gap-4 w-full p-5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group text-left"
    >
        <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-[#1E3A8A] group-hover:text-white flex items-center justify-center transition-colors">
            {icon}
        </div>

        <div>
            <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                {title}
            </Typography>

            <Typography variant={TypographyVariant.CAPTION}>
                {desc}
            </Typography>
        </div>
    </button>
);
