import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import {
    User, Mail, Lock, ShieldCheck, Briefcase,
    Camera, UploadCloud, Check, X,
    GraduationCap, FileText, Loader2
} from 'lucide-react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { UserRole } from '@/types/auth/auth';
import { useSession } from '@/hooks/use-session';
import { useUpdateUserMutation } from '@/shared/api/mutations/users/update-user-mutation';
import { useUploadSignatureMutation } from '@/shared/api/mutations/identity/use-upload-signature-mutation';
import { toast } from 'sonner';

// --- COMPONENTES ATÓMICOS REUTILIZABLES ---

const FormField = ({ label, icon: Icon, error, children }: {
    label: string;
    icon: React.ElementType;
    error?: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-2 w-full group">
        <Typography variant={TypographyVariant.OVERLINE} className="ml-1 !text-slate-400 !text-[10px] uppercase font-bold group-focus-within:!text-[#1E3A8A] transition-colors">
            {label}
        </Typography>
        <div className="relative">
            <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors" />
            {children}
        </div>
        {error && <span className="text-[10px] text-red-500 ml-1 font-medium">{error}</span>}
    </div>
);

const inputStyles = "w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50/50 transition-all text-slate-700 shadow-sm";

// --- COMPONENTE PRINCIPAL ---

const ProfileSettingsPage: React.FC = () => {
    const { t } = useTranslation();
    const { user, isLoading: isSessionLoading } = useSession();
    const { executeUpdateUser, isPending, isSuccess, error } = useUpdateUserMutation();
    const { uploadSignature, isPending: isUploadingSignature } = useUploadSignatureMutation(user?.uuid ?? '');
    const [activeTab, setActiveTab] = useState<'general' | 'medical'>('general');

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [signatureUrl, setSignatureUrl] = useState('');

    const [avatar, setAvatar] = useState<string | null>(null);
    const avatarRef = useRef<HTMLInputElement>(null);
    const signatureRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName ?? '');
            setPhoneNumber(user.phoneNumber ?? '');
            setSpecialty(user.specialty ?? '');
            setSignatureUrl(user.signatureUrl ?? '');
        }
    }, [user]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Perfil actualizado correctamente');
        }
    }, [isSuccess]);

    useEffect(() => {
        if (error) {
            toast.error('Error al actualizar el perfil');
        }
    }, [error]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
        const file = event.target.files?.[0];
        if (file) setter(URL.createObjectURL(file));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!user?.uuid) return;

        executeUpdateUser({
            uuid: user.uuid,
            fullName: fullName || undefined,
            phoneNumber: phoneNumber || undefined,
            specialty: specialty || undefined,
            signatureUrl: signatureUrl || null,
        });
    };

    return (
        <>
            <Head><title>Perfil</title></Head>
            <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title="Configuración de Perfil">

                <div className="max-w-5xl mx-auto pb-20">

                    {/* NAVEGACIÓN TIPO PÍLDORA */}
                    <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-[2rem] w-fit border border-slate-200">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`px-8 py-3 rounded-[1.7rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-white text-[#1E3A8A] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Información de Cuenta
                        </button>
                        <button
                            onClick={() => setActiveTab('medical')}
                            className={`px-8 py-3 rounded-[1.7rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'medical' ? 'bg-white text-[#1E3A8A] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Perfil Médico
                        </button>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-[3.5rem] p-3 md:p-8">
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">

                            <form className="p-8 md:p-12" onSubmit={handleSubmit}>

                                {activeTab === 'general' && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        {/* Avatar Section */}
                                        <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                                            <div className="relative group">
                                                <div className="h-28 w-28 bg-white rounded-[2.2rem] border-2 border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
                                                    {avatar ? (
                                                        <img src={avatar} className="h-full w-full object-cover" alt="Profile" />
                                                    ) : (
                                                        <User size={40} className="text-slate-200" />
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => avatarRef.current?.click()}
                                                    className="absolute -bottom-2 -right-2 p-2.5 bg-[#1E3A8A] text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <Camera size={16} />
                                                </button>
                                                <input type="file" ref={avatarRef} className="hidden" onChange={(event) => handleFileChange(event, setAvatar)} />
                                            </div>
                                            <div className="text-center md:text-left">
                                                <Typography variant={TypographyVariant.ACCENT} className="!text-lg">Fotografía de Perfil</Typography>
                                                <Typography variant={TypographyVariant.HELPER}>Esta imagen será visible en el directorio del staff.</Typography>
                                            </div>
                                        </div>

                                        {/* Formulario de Usuario */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <FormField label={t('users.create.form.fullName')} icon={User}>
                                                <input
                                                    className={inputStyles}
                                                    placeholder={isSessionLoading ? 'Cargando...' : t('users.create.form.fullNamePlaceholder')}
                                                    value={fullName}
                                                    onChange={(event) => setFullName(event.target.value)}
                                                />
                                            </FormField>

                                            <FormField label={t('users.create.form.email')} icon={Mail}>
                                                <input
                                                    type="email"
                                                    className={`${inputStyles} cursor-not-allowed opacity-60`}
                                                    placeholder={t('users.create.form.emailPlaceholder')}
                                                    defaultValue={user?.email ?? ''}
                                                    key={user?.email}
                                                    readOnly
                                                    disabled
                                                />
                                            </FormField>

                                            <FormField label={t('users.create.form.password')} icon={Lock}>
                                                <input type="password" className={inputStyles} placeholder="••••••••" />
                                            </FormField>

                                            <FormField label={t('users.create.form.role')} icon={ShieldCheck}>
                                                <select className={`${inputStyles} cursor-not-allowed opacity-60`} defaultValue={user?.role ?? ''} key={user?.role} disabled>
                                                    <option value={UserRole.DOCTOR}>{t('users.create.roles.DOCTOR')}</option>
                                                    <option value={UserRole.STAFF}>{t('users.create.roles.STAFF')}</option>
                                                    <option value={UserRole.ADMIN}>{t('users.create.roles.ADMIN')}</option>
                                                </select>
                                            </FormField>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'medical' && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <FormField label={t('users.create.form.specialty')} icon={Briefcase}>
                                                <input
                                                    className={inputStyles}
                                                    placeholder={t('users.create.form.specialtyPlaceholder')}
                                                    value={specialty}
                                                    onChange={(event) => setSpecialty(event.target.value)}
                                                />
                                            </FormField>

                                            <FormField label="Cédula Profesional" icon={ShieldCheck}>
                                                <input className={inputStyles} placeholder="Ej. 1234567" />
                                            </FormField>

                                            <FormField label="Universidad" icon={GraduationCap}>
                                                <input className={inputStyles} placeholder="Institución de Egreso" />
                                            </FormField>

                                            <FormField label="Sub-especialidad" icon={FileText}>
                                                <input className={inputStyles} placeholder="Ej. Audiología Pediátrica" />
                                            </FormField>
                                        </div>

                                        {/* Firma Section */}
                                        <div className="space-y-4 pt-4 col-span-full">
                                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 !text-slate-400 !text-[10px] uppercase font-bold">
                                                Firma Digitalizada para Recetas
                                            </Typography>
                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <FormField label="URL de firma (imagen pública)" icon={UploadCloud}>
                                                        <input
                                                            type="url"
                                                            className={inputStyles}
                                                            placeholder="https://ejemplo.com/mi-firma.png"
                                                            value={signatureUrl}
                                                            onChange={(event) => setSignatureUrl(event.target.value)}
                                                        />
                                                    </FormField>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={isUploadingSignature || !user?.uuid}
                                                    onClick={() => signatureRef.current?.click()}
                                                    className="mt-6 px-4 py-3.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0 disabled:opacity-50"
                                                >
                                                    {isUploadingSignature ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                                                    Subir
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={signatureRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file || !user?.uuid) return;
                                                        try {
                                                            const result = await uploadSignature(file);
                                                            setSignatureUrl(result.url);
                                                            toast.success('Firma subida correctamente');
                                                        } catch {
                                                            toast.error('Error al subir la firma');
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {signatureUrl && (
                                                <div className="relative border border-slate-200 rounded-[2rem] bg-slate-50 h-36 flex items-center justify-center overflow-hidden">
                                                    <img src={signatureUrl} className="h-full object-contain p-4 mix-blend-multiply" alt="Firma" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                    <button
                                                        type="button"
                                                        onClick={() => setSignatureUrl('')}
                                                        className="absolute top-3 right-3 p-2 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                            <input type="file" ref={signatureRef} className="hidden" accept="image/png" onChange={(event) => { const file = event.target.files?.[0]; if (file) setSignatureUrl(URL.createObjectURL(file)); }} />
                                        </div>
                                    </div>
                                )}

                                {/* BOTONES DE ACCIÓN */}
                                <div className="flex items-center justify-end gap-4 mt-16 pt-8 border-t border-slate-50">
                                    <button type="button" className="px-8 py-3 text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest transition-all">
                                        Descartar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending || isSessionLoading}
                                        className="bg-[#1E3A8A] text-white px-10 py-4 rounded-[1.5rem] shadow-xl shadow-blue-200 hover:bg-[#152a63] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isPending ? (
                                            <Loader2 size={18} strokeWidth={3} className="animate-spin" />
                                        ) : (
                                            <Check size={18} strokeWidth={3} />
                                        )}
                                        <span className="text-xs font-black uppercase tracking-widest">
                                            Actualizar Perfil
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default ProfileSettingsPage;
