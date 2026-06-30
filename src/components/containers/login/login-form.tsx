import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronLeft, Mail, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { routesPublic } from '@/shared/navigation/routes';
import Image from '@/components/common/Image/image';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { TEXT } from '@/static/texts/i18n';

type View = 'login' | 'forgot' | 'success';

interface LoginInputProps {
    name: string;
    label: string;
    type?: string;
    placeholder: string;
    error?: boolean;
    touched?: boolean;
}

const LoginInput = ({ name, label, type = 'text', placeholder, error, touched }: LoginInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <Field
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    className={`w-full px-6 py-4.5 rounded-app-md border-2 transition-all duration-300 outline-none font-semibold text-neutral-900 ${
                        error && touched
                            ? 'border-danger/20 bg-danger/5 focus:border-danger'
                            : 'border-neutral-100 bg-neutral-50 focus:bg-white focus:border-[#14B8A6] shadow-sm focus:shadow-[#14B8A6]/10'
                    }`}
                />
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-300 hover:text-[#14B8A6] transition-colors focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                    </button>
                )}
            </div>
            <ErrorMessage
                name={name}
                component="p"
                className="text-danger text-[10px] mt-2 ml-2 font-bold italic"
            />
        </div>
    );
};

export const LoginForm: React.FC<{ onSubmit: (values: { email: string; password: string }, actions: { setSubmitting: (isSubmitting: boolean) => void }) => void; isLoading: boolean; externalError: string | null }> = ({
    onSubmit,
    isLoading,
    externalError,
}) => {
    const { t } = useTranslation();
    const [view, setView] = useState<View>('login');

    const loginSchema = Yup.object({
        email: Yup.string().email(t(TEXT.AUTH.ERRORS.EMAIL_INVALID)).required(t(TEXT.AUTH.ERRORS.REQUIRED)),
        password: Yup.string().required(t(TEXT.AUTH.ERRORS.REQUIRED)),
    });

    return (
        <div className="max-w-[1200px] w-full bg-white rounded-app-2xl shadow-[0_40px_100px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex min-h-[780px] border border-neutral-100">

            {/* IZQUIERDA — BRANDING */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-20 text-white bg-[#0B3C5D] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/login-bg.jpg" alt="Clinic" className="h-full w-full object-cover opacity-20 animate-slow-zoom" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B3C5D]/60 via-[#0B3C5D] to-[#0B3C5D]" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-24">
                        <Image src="/zynka-logo.png" alt="Zynka Logo" width={36} height={36} className="object-contain" />
                        <span className="text-xl font-bold tracking-tight text-white">Zynka</span>
                    </div>
                    <h1 className="text-5xl font-black leading-[1.1] tracking-tight">
                        Tu clínica organizada, <br />
                        simple y <br />
                        <span className="text-[#14B8A6] underline decoration-[#14B8A6]/30 underline-offset-8">
                            profesional.
                        </span>
                    </h1>
                    <p className="mt-8 text-neutral-300 font-medium text-lg max-w-xs leading-relaxed">
                        Digitaliza tu clínica sin complicaciones.
                    </p>
                </div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-neutral-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-300">
                        Plataforma para clínicas independientes
                    </span>
                </div>
            </div>

            {/* DERECHA — FORMULARIO */}
            <div className="w-full lg:w-1/2 p-8 sm:p-24 flex flex-col justify-center bg-gradient-to-br from-white to-neutral-50">
                <div className="max-w-[380px] mx-auto w-full">

                    {view === 'login' && (
                        <div>
                            <div className="mb-10 text-left">
                                <Typography variant={TypographyVariant.HEADER} className="text-3xl font-black text-neutral-900 mb-2">
                                    {t(TEXT.AUTH.LOGIN.TITLE)}
                                </Typography>
                                <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-medium italic">
                                    {t(TEXT.AUTH.LOGIN.SUBTITLE)}
                                </Typography>
                            </div>

                            {externalError && (
                                <div className="mb-6 p-4 bg-danger/10 border-l-4 border-danger/50 rounded-r-xl flex items-start gap-3">
                                    <span className="text-danger mt-0.5 text-base leading-none">⚠</span>
                                    <Typography variant={TypographyVariant.CAPTION} className="text-danger-dark text-xs font-bold">
                                        {externalError}
                                    </Typography>
                                </div>
                            )}

                            <Formik
                                initialValues={{ email: '', password: '' }}
                                validationSchema={loginSchema}
                                onSubmit={onSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form className="space-y-6">
                                        <LoginInput
                                            name="email"
                                            label={t(TEXT.AUTH.LOGIN.EMAIL_LABEL)}
                                            placeholder={t(TEXT.AUTH.LOGIN.EMAIL_PLACEHOLDER)}
                                            error={!!errors.email}
                                            touched={touched.email}
                                        />
                                        <div>
                                            <div className="flex justify-between items-center mb-2 px-1">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
                                                    {t(TEXT.AUTH.LOGIN.PASSWORD_LABEL)}
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setView('forgot')}
                                                    className="text-[10px] font-bold text-[#14B8A6] hover:opacity-80 uppercase tracking-tighter transition-colors"
                                                >
                                                    {t(TEXT.AUTH.LOGIN.FORGOT_PASSWORD)}
                                                </button>
                                            </div>
                                            <LoginInput
                                                name="password"
                                                label=""
                                                type="password"
                                                placeholder={t(TEXT.AUTH.LOGIN.PASSWORD_PLACEHOLDER)}
                                                error={!!errors.password}
                                                touched={touched.password}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#0B3C5D] hover:bg-[#14B8A6] text-white font-black py-4.5 rounded-app-md shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 text-sm"
                                        >
                                            {isLoading ? t(TEXT.AUTH.LOGIN.SUBMITTING) : t(TEXT.AUTH.LOGIN.SUBMIT_BUTTON)}
                                            {!isLoading && <ArrowRight size={18} />}
                                        </button>
                                    </Form>
                                )}
                            </Formik>

                            <div className="mt-12 pt-8 border-t border-neutral-100 text-center">
                                <Typography variant={TypographyVariant.CAPTION} className="text-sm text-neutral-400 font-medium italic">
                                    {t(TEXT.AUTH.LOGIN.NO_ACCOUNT)}{' '}
                                    <Link
                                        href={routesPublic.register}
                                        className="text-[#14B8A6] font-black hover:opacity-80 transition-colors ml-1 not-italic tracking-tight"
                                    >
                                        {t(TEXT.AUTH.LOGIN.REGISTER_LINK)}
                                    </Link>
                                </Typography>
                            </div>
                        </div>
                    )}

                    {view === 'forgot' && (
                        <div>
                            <button
                                onClick={() => setView('login')}
                                className="flex items-center gap-2 text-neutral-400 hover:text-[#14B8A6] font-black text-[10px] uppercase tracking-widest mb-10 transition-colors"
                            >
                                <ChevronLeft size={14} /> {t(TEXT.AUTH.FORGOT.BACK_BUTTON)}
                            </button>
                            <Typography variant={TypographyVariant.HEADER} className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">
                                {t(TEXT.AUTH.FORGOT.TITLE)}
                            </Typography>
                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-medium text-sm mb-10 leading-relaxed italic">
                                {t(TEXT.AUTH.FORGOT.SUBTITLE)}
                            </Typography>
                            <div className="p-5 bg-warning/10 border border-warning/30 rounded-app-md text-center space-y-2">
                                <p className="text-sm font-black text-warning">Recuperación de contraseña</p>
                                <p className="text-xs text-warning leading-relaxed">
                                    Esta función estará disponible próximamente. Por ahora, contacta al administrador de tu clínica para restablecer tu contraseña.
                                </p>
                                <button
                                    onClick={() => setView('login')}
                                    className="mt-3 text-[10px] font-black text-warning uppercase tracking-widest hover:opacity-80 transition-colors"
                                >
                                    Volver al login
                                </button>
                            </div>
                        </div>
                    )}

                    {view === 'success' && (
                        <div className="text-center">
                            <div className="h-20 w-20 bg-success/10 text-success rounded-app-xl flex items-center justify-center mx-auto mb-8 border border-success/20 shadow-sm">
                                <CheckCircle size={36} strokeWidth={2.5} />
                            </div>
                            <Typography variant={TypographyVariant.HEADER} className="text-2xl font-black text-neutral-900 mb-4 tracking-tight italic">
                                {t(TEXT.AUTH.SUCCESS.TITLE)}
                            </Typography>
                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-500 text-sm mb-10 leading-relaxed">
                                {t(TEXT.AUTH.SUCCESS.SUBTITLE)}
                            </Typography>
                            <button
                                onClick={() => setView('login')}
                                className="w-full bg-[#0B3C5D] hover:bg-[#14B8A6] text-white font-black py-4.5 rounded-app-md transition-all"
                            >
                                {t(TEXT.AUTH.SUCCESS.BACK_BUTTON)}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes slow-zoom {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 30s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};
