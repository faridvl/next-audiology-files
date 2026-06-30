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
import { TEXT } from '@/static/texts/i18n';
import { useUpdateUserMutation } from '@/shared/api/mutations/users/update-user-mutation';
import { useUploadSignatureMutation } from '@/shared/api/mutations/identity/use-upload-signature-mutation';
import { useUploadAvatarMutation } from '@/shared/api/mutations/identity/use-upload-avatar-mutation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// --- COMPONENTES ATÓMICOS REUTILIZABLES ---

const FormField = ({ label, icon: Icon, error, children }: {
    label: string;
    icon: React.ElementType;
    error?: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-2 w-full group">
        <Typography variant={TypographyVariant.OVERLINE} className="ml-1 !text-neutral-400 !text-[10px] uppercase font-bold group-focus-within:!text-primary transition-colors">
            {label}
        </Typography>
        <div className="relative">
            <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary transition-colors" />
            {children}
        </div>
        {error && <span className="text-[10px] text-danger ml-1 font-medium">{error}</span>}
    </div>
);

const inputStyles = "w-full pl-12 pr-5 py-3.5 bg-white border border-neutral-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-neutral-700 shadow-sm";

// --- COMPONENTE PRINCIPAL ---

const ProfileSettingsPage: React.FC = () => {
    const { t } = useTranslation();
    const { user, isLoading: isSessionLoading } = useSession();
    const { executeUpdateUser, isPending, isSuccess, error } = useUpdateUserMutation();
    const { uploadSignature, isPending: isUploadingSignature } = useUploadSignatureMutation(user?.uuid ?? '');
    const { uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatarMutation(user?.uuid ?? '');
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'general' | 'medical'>('general');

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [signatureUrl, setSignatureUrl] = useState('');

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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
            toast.success(t(TEXT.PROFILE.TOASTS.UPDATE_SUCCESS));
        }
    }, [isSuccess]);

    useEffect(() => {
        if (error) {
            toast.error(t(TEXT.PROFILE.TOASTS.UPDATE_ERROR));
        }
    }, [error]);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user?.uuid) return;
        setAvatarPreview(URL.createObjectURL(file));
        try {
            await uploadAvatar(file);
            queryClient.invalidateQueries({ queryKey: ['auth-me'] });
            toast.success(t(TEXT.PROFILE.AVATAR.UPLOAD_SUCCESS));
        } catch {
            setAvatarPreview(null);
            toast.error(t(TEXT.PROFILE.AVATAR.UPLOAD_ERROR));
        }
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
            <Head><title>{t(TEXT.PROFILE.PAGE_TITLE)}</title></Head>
            <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title={t(TEXT.PROFILE.LAYOUT_TITLE)}>

                <div className="max-w-5xl mx-auto pb-20">

                    {/* NAVEGACIÓN TIPO PÍLDORA */}
                    <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-[2rem] w-fit border border-neutral-200">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`px-8 py-3 rounded-[1.7rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-white text-[#1E3A8A] shadow-md' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            {t(TEXT.PROFILE.TABS.GENERAL)}
                        </button>
                        <button
                            onClick={() => setActiveTab('medical')}
                            className={`px-8 py-3 rounded-[1.7rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'medical' ? 'bg-white text-[#1E3A8A] shadow-md' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            {t(TEXT.PROFILE.TABS.MEDICAL)}
                        </button>
                    </div>

                    <div className="bg-slate-50 border border-neutral-200 rounded-[3.5rem] p-3 md:p-8">
                        <div className="bg-white rounded-[3rem] shadow-sm border border-neutral-100 overflow-hidden">

                            <form className="p-8 md:p-12" onSubmit={handleSubmit}>

                                {activeTab === 'general' && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        {/* Avatar Section */}
                                        <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-neutral-100">
                                            <div className="relative group">
                                                <div className="h-28 w-28 bg-white rounded-[2.2rem] border-2 border-neutral-200 overflow-hidden flex items-center justify-center shadow-inner">
                                                    {avatarPreview || user?.avatarUrl ? (
                                                        <img src={avatarPreview ?? user?.avatarUrl ?? ''} className="h-full w-full object-cover" alt="Profile" />
                                                    ) : (
                                                        <User size={40} className="text-neutral-200" />
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => avatarRef.current?.click()}
                                                    disabled={isUploadingAvatar}
                                                    className="absolute -bottom-2 -right-2 p-2.5 bg-[#1E3A8A] text-white rounded-xl shadow-lg hover:scale-110 transition-transform disabled:opacity-60"
                                                >
                                                    {isUploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                                </button>
                                                <input type="file" ref={avatarRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                            </div>
                                            <div className="text-center md:text-left">
                                                <Typography variant={TypographyVariant.ACCENT} className="!text-lg">{t(TEXT.PROFILE.AVATAR.TITLE)}</Typography>
                                                <Typography variant={TypographyVariant.HELPER}>{t(TEXT.PROFILE.AVATAR.SUBTITLE)}</Typography>
                                            </div>
                                        </div>

                                        {/* Formulario de Usuario */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <FormField label={t('users.create.form.fullName')} icon={User}>
                                                <input
                                                    className={inputStyles}
                                                    placeholder={isSessionLoading ? t(TEXT.PROFILE.FIELDS.LOADING_PLACEHOLDER) : t('users.create.form.fullNamePlaceholder')}
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
                                                <input type="password" className={inputStyles} placeholder={t(TEXT.PROFILE.FIELDS.PASSWORD_PLACEHOLDER)} />
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

                                            <FormField label={t(TEXT.PROFILE.FIELDS.PROFESSIONAL_ID)} icon={ShieldCheck}>
                                                <input className={inputStyles} placeholder={t(TEXT.PROFILE.FIELDS.PROFESSIONAL_ID_PLACEHOLDER)} />
                                            </FormField>

                                            <FormField label={t(TEXT.PROFILE.FIELDS.UNIVERSITY)} icon={GraduationCap}>
                                                <input className={inputStyles} placeholder={t(TEXT.PROFILE.FIELDS.UNIVERSITY_PLACEHOLDER)} />
                                            </FormField>

                                            <FormField label={t(TEXT.PROFILE.FIELDS.SUB_SPECIALTY)} icon={FileText}>
                                                <input className={inputStyles} placeholder={t(TEXT.PROFILE.FIELDS.SUB_SPECIALTY_PLACEHOLDER)} />
                                            </FormField>
                                        </div>

                                        {/* Firma Section */}
                                        <div className="space-y-4 pt-4 col-span-full">
                                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 !text-neutral-400 !text-[10px] uppercase font-bold">
                                                {t(TEXT.PROFILE.SIGNATURE.SECTION_LABEL)}
                                            </Typography>
                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <FormField label={t(TEXT.PROFILE.SIGNATURE.URL_LABEL)} icon={UploadCloud}>
                                                        <input
                                                            type="url"
                                                            className={inputStyles}
                                                            placeholder={t(TEXT.PROFILE.SIGNATURE.URL_PLACEHOLDER)}
                                                            value={signatureUrl}
                                                            onChange={(event) => setSignatureUrl(event.target.value)}
                                                        />
                                                    </FormField>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={isUploadingSignature || !user?.uuid}
                                                    onClick={() => signatureRef.current?.click()}
                                                    className="mt-6 px-4 py-3.5 bg-slate-100 text-neutral-600 rounded-2xl hover:bg-slate-200 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0 disabled:opacity-50"
                                                >
                                                    {isUploadingSignature ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                                                    {t(TEXT.PROFILE.SIGNATURE.UPLOAD_BUTTON)}
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
                                                            toast.success(t(TEXT.PROFILE.SIGNATURE.UPLOAD_SUCCESS));
                                                        } catch {
                                                            toast.error(t(TEXT.PROFILE.SIGNATURE.UPLOAD_ERROR));
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {signatureUrl && (
                                                <div className="relative border border-neutral-200 rounded-[2rem] bg-slate-50 h-36 flex items-center justify-center overflow-hidden">
                                                    <img src={signatureUrl} className="h-full object-contain p-4 mix-blend-multiply" alt="Firma" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                    <button
                                                        type="button"
                                                        onClick={() => setSignatureUrl('')}
                                                        className="absolute top-3 right-3 p-2 bg-red-100 text-danger rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* BOTONES DE ACCIÓN */}
                                <div className="flex items-center justify-end gap-4 mt-16 pt-8 border-t border-neutral-50">
                                    <button type="button" className="px-8 py-3 text-neutral-400 hover:text-neutral-600 font-bold text-[10px] uppercase tracking-widest transition-all">
                                        {t(TEXT.PROFILE.BUTTONS.DISCARD)}
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
                                            {t(TEXT.PROFILE.BUTTONS.SAVE)}
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
