import React from 'react';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import {
    ChevronLeft, Edit, Mail, Phone,
    Briefcase, Stethoscope,
    Building2, Loader2
} from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';
import { useGetUserQuery } from '@/shared/api/querys/get-user-query';

const UserDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const navigation = useNavigation();

    const userUuid = typeof id === 'string' ? id : '';
    const { data: userDetail, isLoading } = useGetUserQuery(userUuid);

    if (isLoading) {
        return (
            <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Expediente de Personal">
                <div className="h-screen flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            </DashboardLayout>
        );
    }

    if (!userDetail) {
        return (
            <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Expediente de Personal">
                <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
                    <Typography variant={TypographyVariant.HELPER} className="text-slate-400">
                        No se encontró información del usuario.
                    </Typography>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Expediente de Personal">
            <div className="max-w-[1200px] mx-auto px-6 pb-20">

                {/* Navegación Superior */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigation.users.list()}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-all group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Regresar al listado
                    </button>

                    <Button
                        variant={ButtonVariant.PRIMARY}
                        className="!rounded-2xl shadow-lg shadow-blue-100"
                        onClick={() => navigation.users.edit(userUuid)}
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
                                    {userDetail.fullName.charAt(0)}
                                </div>
                                <Typography variant={TypographyVariant.SUBTITLE}>{userDetail.fullName}</Typography>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                        {userDetail.role}
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
                                            <p className="text-sm font-medium text-slate-700 truncate">{userDetail.email}</p>
                                        </div>
                                    </div>

                                    {userDetail.phoneNumber && (
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Teléfono</p>
                                                <p className="text-sm font-medium text-slate-700">{userDetail.phoneNumber}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Profesional (8/12) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Card: Rol y Especialidad */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Rol en Sistema</p>
                                        <p className="text-sm font-bold text-slate-800">{userDetail.role}</p>
                                        <p className="text-xs text-slate-400">
                                            Miembro desde {new Date(userDetail.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                {userDetail.specialty && (
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <Stethoscope size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Especialidad Médica</p>
                                            <p className="text-sm font-bold text-slate-800">{userDetail.specialty}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Card: Identificador */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">UUID de Usuario</p>
                                    <p className="text-sm font-mono text-slate-700">{userDetail.uuid}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default UserDetailPage;
