import React from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import {
    ChevronLeft, Edit, Mail, Phone, MapPin,
    Briefcase, Stethoscope, Users as UsersIcon,
    History, CheckCircle2, Building2, ExternalLink
} from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';

const UserDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const nav = useNavigation();

    // Mock de datos extendido
    const user = {
        id: id,
        name: 'Dr. Roberto Gómez',
        role: 'Médico Especialista',
        email: 'roberto.g@clinica.com',
        phone: '+52 55 1234 5678',
        address: 'Av. Insurgentes Sur 123, Ciudad de México',
        workplace: 'Sede Central - Consultorio 402',
        speciality: 'Audiología Clínica y Otoneurología',
        joinedAt: '12 de Octubre, 2023',
        status: 'active',
        // Historial de pacientes recientes
        patientHistory: [
            { id: 'p1', name: 'Juan Pérez', lastVisit: '15 Feb 2024', type: 'Audiometría' },
            { id: 'p2', name: 'María García', lastVisit: '14 Feb 2024', type: 'Control' },
            { id: 'p3', name: 'Ricardo Luna', lastVisit: '12 Feb 2024', type: 'Limpieza' },
        ]
    };

    return (
        <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Expediente de Personal">
            <div className="max-w-[1200px] mx-auto px-6 pb-20">

                {/* Navegación Superior */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => nav.users.list()}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-all group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Regresar al listado
                    </button>

                    <Button
                        variant={ButtonVariant.PRIMARY}
                        className="!rounded-2xl shadow-lg shadow-blue-100"
                        onClick={() => nav.users.edit(1)} // Redirección a edición
                    >
                        <Edit size={16} className="mr-2" /> Editar Información
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* COLUMNA IZQUIERDA: Contacto y Perfil (4/12) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                            <div className="text-center mb-8">
                                <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-700 text-white text-3xl font-black flex items-center justify-center mx-auto mb-4 shadow-xl">
                                    {user.name.charAt(0)}
                                </div>
                                <Typography variant={TypographyVariant.SUBTITLE}>{user.name}</Typography>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-xs uppercase tracking-widest text-slate-400">
                                    Información de Contacto
                                </Typography>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Mail size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                                            <p className="text-sm font-medium text-slate-700 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Teléfono</p>
                                            <p className="text-sm font-medium text-slate-700">{user.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Dirección Personal</p>
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{user.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Profesional y Pacientes (8/12) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Card: Lugar de Trabajo y Especialidad */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Centro de Trabajo</p>
                                        <p className="text-sm font-bold text-slate-800">{user.workplace}</p>
                                        <p className="text-xs text-slate-400">Sede Principal habilitada</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <Stethoscope size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Especialidad Médica</p>
                                        <p className="text-sm font-bold text-slate-800">{user.speciality}</p>
                                        <p className="text-xs text-slate-400">Cédula Profesional Activa</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card: Historial de Pacientes Atendidos */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                                        <UsersIcon size={18} />
                                    </div>
                                    <Typography variant={TypographyVariant.BODY_BOLD}>Historial de Pacientes Atendidos</Typography>
                                </div>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                                    Total: 142
                                </span>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {user.patientHistory.map((patient) => (
                                    <div key={patient.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{patient.name}</p>
                                                <p className="text-[11px] text-slate-400 font-medium">{patient.type} • {patient.lastVisit}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => nav.patients.detail(patient.id)}
                                            className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 text-center bg-slate-50/20">
                                <button className="text-[11px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                                    Ver historial completo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDetailPage;