import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import {
    User, Mail, Lock, ShieldCheck, Briefcase,
    Stethoscope, Camera, UploadCloud, Check, X,
    GraduationCap, FileText
} from 'lucide-react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { UserRole } from '@/types/auth/auth';

// --- COMPONENTES ATÓMICOS REUTILIZABLES ---

const FormField = ({ label, icon: Icon, error, children }: any) => (
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
    const [activeTab, setActiveTab] = useState<'general' | 'medical'>('general');

    // Estados funcionales para archivos
    const [avatar, setAvatar] = useState<string | null>(null);
    const [signature, setSignature] = useState<string | null>(null);
    const avatarRef = useRef<HTMLInputElement>(null);
    const signatureRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
        const file = e.target.files?.[0];
        if (file) setter(URL.createObjectURL(file));
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

                            <form className="p-8 md:p-12">

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
                                                <input type="file" ref={avatarRef} className="hidden" onChange={(e) => handleFileChange(e, setAvatar)} />
                                            </div>
                                            <div className="text-center md:text-left">
                                                <Typography variant={TypographyVariant.ACCENT} className="!text-lg">Fotografía de Perfil</Typography>
                                                <Typography variant={TypographyVariant.HELPER}>Esta imagen será visible en el directorio del staff.</Typography>
                                            </div>
                                        </div>

                                        {/* Formulario Unificado de Usuario */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <FormField label={t('users.create.form.fullName')} icon={User}>
                                                <input className={inputStyles} placeholder={t('users.create.form.fullNamePlaceholder')} />
                                            </FormField>

                                            <FormField label={t('users.create.form.email')} icon={Mail}>
                                                <input type="email" className={inputStyles} placeholder={t('users.create.form.emailPlaceholder')} />
                                            </FormField>

                                            <FormField label={t('users.create.form.password')} icon={Lock}>
                                                <input type="password" className={inputStyles} placeholder="••••••••" />
                                            </FormField>

                                            <FormField label={t('users.create.form.role')} icon={ShieldCheck}>
                                                <select className={inputStyles}>
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
                                                <input className={inputStyles} placeholder={t('users.create.form.specialtyPlaceholder')} />
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
                                        <div className="space-y-4 pt-4">
                                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 !text-slate-400 !text-[10px] uppercase font-bold">
                                                Firma Digitalizada para Recetas
                                            </Typography>
                                            <div
                                                onClick={() => signatureRef.current?.click()}
                                                className="group relative border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 h-48 flex flex-col items-center justify-center hover:bg-white hover:border-[#1E3A8A]/30 transition-all cursor-pointer overflow-hidden"
                                            >
                                                {signature ? (
                                                    <>
                                                        <img src={signature} className="h-full object-contain p-4 mix-blend-multiply" alt="Firma" />
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSignature(null); }}
                                                            className="absolute top-4 right-4 p-2 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform text-[#1E3A8A]">
                                                            <UploadCloud size={24} />
                                                        </div>
                                                        <Typography variant={TypographyVariant.CAPTION} className="!text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cargar archivo PNG</Typography>
                                                    </div>
                                                )}
                                                <input type="file" ref={signatureRef} className="hidden" accept="image/png" onChange={(e) => handleFileChange(e, setSignature)} />
                                            </div>
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
                                        className="bg-[#1E3A8A] text-white px-10 py-4.5 rounded-[1.5rem] shadow-xl shadow-blue-200 hover:bg-[#152a63] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3"
                                    >
                                        <Check size={18} strokeWidth={3} />
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