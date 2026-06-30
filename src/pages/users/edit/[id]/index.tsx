import React, { useState, useEffect } from 'react'; // useEffect needed for userDetail sync
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import {
    ChevronLeft, Save, User, Mail, ShieldCheck,
    Stethoscope, Phone, Loader2
} from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';
import { authorizeServerSidePage } from '@/hocs/auth';
import { useGetUserQuery } from '@/shared/api/querys/get-user-query';
import { useUpdateUserMutation } from '@/shared/api/mutations/users/update-user-mutation';
import { UserSpecialty } from '@/types/auth/auth';
import { toast } from 'sonner';

const SPECIALTY_OPTIONS: { value: UserSpecialty; label: string }[] = [
    { value: UserSpecialty.AUDIOLOGY, label: 'Audiología' },
    { value: UserSpecialty.DENTAL, label: 'Odontología' },
    { value: UserSpecialty.GENERAL, label: 'Medicina General' },
];

interface FieldRowProps {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    readOnly?: boolean;
}

function FieldRow({ label, icon, children, readOnly }: FieldRowProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-neutral-500">
                {label}
            </Typography>
            <div className={`relative flex items-center rounded-2xl border transition-all ${readOnly
                    ? 'bg-neutral-50 border-neutral-100'
                    : 'bg-white border-neutral-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10'
                }`}>
                <span className="absolute left-4 text-neutral-400">{icon}</span>
                {children}
            </div>
        </div>
    );
}

const inputClass = "w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-2xl text-sm outline-none text-neutral-700";
const readOnlyClass = "w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-2xl text-sm outline-none text-neutral-400 cursor-not-allowed";

const EditUserPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const navigation = useNavigation();

    const userUuid = typeof id === 'string' ? id : '';
    const { data: userDetail, isLoading } = useGetUserQuery(userUuid);
    const { executeUpdateUser, isPending } = useUpdateUserMutation();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: '',
        specialty: '' as UserSpecialty | '',
        phoneNumber: '',
    });

    useEffect(() => {
        if (userDetail) {
            setFormData({
                fullName: userDetail.fullName ?? '',
                email: userDetail.email ?? '',
                role: userDetail.role ?? '',
                specialty: (userDetail.specialty as UserSpecialty) ?? '',
                phoneNumber: userDetail.phoneNumber ?? '',
            });
        }
    }, [userDetail]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        executeUpdateUser(
            {
                uuid: userUuid,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                specialty: formData.specialty || undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Usuario actualizado correctamente');
                    navigation.users.detail(userUuid);
                },
                onError: () => {
                    toast.error('Error al actualizar el usuario');
                },
            }
        );
    };

    if (isLoading) {
        return (
            <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Editar Usuario">
                <div className="h-screen flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Editar Usuario">
            <div className="max-w-3xl mx-auto px-6 pb-20">

                <button
                    onClick={() => navigation.common.back()}
                    className="flex items-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors mb-8 font-bold text-sm group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Volver
                </button>

                {/* Card principal */}
                <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/20 overflow-hidden">

                    {/* Header de la card */}
                    <div className="px-8 pt-8 pb-6 border-b border-neutral-50 flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white text-2xl font-black flex items-center justify-center shadow-lg shadow-primary/20">
                            {formData.fullName.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                            <Typography variant={TypographyVariant.SUBTITLE} className="truncate">
                                {formData.fullName || 'Nuevo Usuario'}
                            </Typography>
                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-mono">
                                {userUuid}
                            </Typography>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Sección: Datos personales */}
                        <div>
                            <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400 uppercase tracking-widest mb-4 block">
                                Datos Personales
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FieldRow label="Nombre Completo" icon={<User size={18} />}>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                                        className={inputClass}
                                        placeholder="Nombre del usuario"
                                    />
                                </FieldRow>

                                <FieldRow label="Teléfono" icon={<Phone size={18} />}>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(event) => setFormData({ ...formData, phoneNumber: event.target.value })}
                                        className={inputClass}
                                        placeholder="+506 8888-0000"
                                    />
                                </FieldRow>
                            </div>
                        </div>

                        {/* Sección: Acceso (solo lectura) */}
                        <div>
                            <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400 uppercase tracking-widest mb-4 block">
                                Acceso al Sistema
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FieldRow label="Correo Electrónico" icon={<Mail size={18} />} readOnly>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        readOnly
                                        disabled
                                        className={readOnlyClass}
                                    />
                                </FieldRow>

                                <FieldRow label="Rol" icon={<ShieldCheck size={18} />} readOnly>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        readOnly
                                        disabled
                                        className={readOnlyClass}
                                    />
                                </FieldRow>
                            </div>
                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 mt-2 ml-1 block">
                                El correo y el rol solo pueden modificarse por un administrador de cuenta.
                            </Typography>
                        </div>

                        {/* Sección: Profesional */}
                        <div>
                            <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400 uppercase tracking-widest mb-4 block">
                                Perfil Profesional
                            </Typography>
                            <FieldRow label="Especialidad" icon={<Stethoscope size={18} />}>
                                <select
                                    value={formData.specialty}
                                    onChange={(event) => setFormData({ ...formData, specialty: event.target.value as UserSpecialty | '' })}
                                    className={`${inputClass} appearance-none`}
                                >
                                    <option value="">Sin especialidad asignada</option>
                                    {SPECIALTY_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </FieldRow>
                        </div>

                        {/* Acciones */}
                        <div className="pt-6 flex justify-end gap-3 border-t border-neutral-50">
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
                                className="shadow-lg shadow-primary/20"
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
