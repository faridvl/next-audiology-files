import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { ChevronLeft, Save, User, Mail, ShieldCheck, Briefcase, Loader2 } from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';
import { authorizeServerSidePage } from '@/hocs/auth';
import { useGetUserQuery } from '@/shared/api/querys/get-user-query';
import { useUpdateUserMutation } from '@/shared/api/mutations/users/update-user-mutation';
import { toast } from 'sonner';

const EditUserPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const navigation = useNavigation();

    const userUuid = typeof id === 'string' ? id : '';
    const { data: userDetail, isLoading } = useGetUserQuery(userUuid);
    const { executeUpdateUser, isPending, isSuccess, error } = useUpdateUserMutation();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: '',
        specialty: '',
        phoneNumber: '',
    });

    useEffect(() => {
        if (userDetail) {
            setFormData({
                fullName: userDetail.fullName ?? '',
                email: userDetail.email ?? '',
                role: userDetail.role ?? '',
                specialty: userDetail.specialty ?? '',
                phoneNumber: userDetail.phoneNumber ?? '',
            });
        }
    }, [userDetail]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Usuario actualizado correctamente');
            navigation.users.detail(userUuid);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (error) {
            toast.error('Error al actualizar el usuario');
        }
    }, [error]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        executeUpdateUser({
            uuid: userUuid,
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            specialty: formData.specialty,
        });
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Editar Usuario">
            <div className="max-w-3xl mx-auto px-6">

                <button
                    onClick={() => navigation.common.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6 font-bold text-sm group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Volver
                </button>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                        <div>
                            <Typography variant={TypographyVariant.SUBTITLE}>Modificar Acceso</Typography>
                            <p className="text-sm text-slate-400">Editando el perfil del ID: <span className="font-mono text-blue-600">#{userUuid}</span></p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                            {formData.fullName.charAt(0)}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Correo (solo lectura — email no es editable por PATCH /users) */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        readOnly
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm text-slate-400 outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Rol (solo lectura) */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Rol</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text"
                                        value={formData.role}
                                        readOnly
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm text-slate-400 outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Especialidad */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Especialidad</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text"
                                        value={formData.specialty}
                                        onChange={(event) => setFormData({ ...formData, specialty: event.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-slate-50">
                            <Button
                                variant={ButtonVariant.CANCEL}
                                onClick={() => navigation.common.back()}
                                type="button"
                                disabled={isPending}
                            >
                                Descartar Cambios
                            </Button>
                            <Button
                                variant={ButtonVariant.PRIMARY}
                                type="submit"
                                className="shadow-lg shadow-blue-100"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                ) : (
                                    <Save size={18} className="mr-2" />
                                )}
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default EditUserPage;
