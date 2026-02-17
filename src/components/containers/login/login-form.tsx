import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, Mail, CheckCircle } from 'lucide-react';
import { routesPublic } from '@/shared/navigation/routes';
import { Field, ErrorMessage } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import Image from '@/components/common/Image/image';

type View = 'login' | 'forgot' | 'success';

interface LoginInputProps {
    name: string;
    label: string;
    type?: string;
    placeholder: string;
    error?: boolean;
    touched?: boolean;
}

export const LoginInput = ({ name, label, type = "text", placeholder, error, touched }: LoginInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                    {label}
                </label>
            )}

            <div className="relative group">
                <Field
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    className={`w-full px-6 py-4.5 rounded-2xl border-2 transition-all duration-300 outline-none font-semibold text-slate-900 ${error && touched
                        ? 'border-red-100 bg-red-50/50 focus:border-red-500'
                        : 'border-slate-100 bg-slate-50 focus:bg-white focus:border-[#14B8A6] shadow-sm focus:shadow-[#14B8A6]/10'
                        }`}
                />

                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-[#14B8A6] transition-colors focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                    </button>
                )}
            </div>

            <ErrorMessage
                name={name}
                component="p"
                className="text-red-500 text-[10px] mt-2 ml-2 font-bold italic"
            />
        </div>
    );
};

export const LoginForm: React.FC<any> = ({ onSubmit, isLoading, externalError }) => {
    const [view, setView] = useState<View>('login');

    const loginSchema = Yup.object({
        email: Yup.string().email('Email inválido').required('Requerido'),
        password: Yup.string().required('Requerido'),
    });

    return (
        <div className="max-w-[1200px] w-full bg-white rounded-[3.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex min-h-[780px] border border-slate-100">

            {/* IZQUIERDA — BRANDING ZYNKA */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-20 text-white bg-[#0B3C5D] overflow-hidden">

                <div className="absolute inset-0 z-0">
                    <img src="/images/login-bg.jpg" alt="Clinic" className="h-full w-full object-cover opacity-20 animate-slow-zoom" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B3C5D]/60 via-[#0B3C5D] to-[#0B3C5D]" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-24">
                        <Image
                            src="/zynka-logo.png"
                            alt="Zynka Logo"
                            width={36}
                            height={36}
                            className="object-contain"
                        />
                        <span className="text-xl font-bold tracking-tight text-white">Zynka</span>
                    </div>

                    <h1 className="text-5xl font-black leading-[1.1] tracking-tight">
                        Tu clínica organizada, <br />
                        simple y <br />
                        <span className="text-[#14B8A6] underline decoration-[#14B8A6]/30 underline-offset-8">
                            profesional.
                        </span>
                    </h1>

                    <p className="mt-8 text-slate-300 font-medium text-lg max-w-xs leading-relaxed">
                        Digitaliza tu clínica sin complicaciones.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-slate-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
                        Plataforma para clínicas independientes
                    </span>
                </div>
            </div>

            {/* DERECHA — FORMULARIO */}
            <div className="w-full lg:w-1/2 p-8 sm:p-24 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50">
                <div className="max-w-[380px] mx-auto w-full">

                    {view === 'login' && (
                        <div>
                            <div className="mb-10 text-left">
                                <h2 className="text-3xl font-black text-slate-900 mb-2">Iniciar Sesión</h2>
                                <p className="text-slate-400 font-medium italic">
                                    Accede a tu panel de control clínico.
                                </p>
                            </div>

                            {externalError && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-xl">
                                    {externalError}
                                </div>
                            )}

                            <Formik
                                initialValues={{ email: 'admin@audioflow.com', password: 'Password1' }}
                                validationSchema={loginSchema}
                                onSubmit={onSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form className="space-y-6">
                                        <LoginInput
                                            name="email"
                                            label="Email Corporativo"
                                            placeholder="nombre@clinica.com"
                                            error={!!errors.email}
                                            touched={touched.email}
                                        />

                                        <div>
                                            <div className="flex justify-between items-center mb-2 px-1">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                                                    Contraseña
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setView('forgot')}
                                                    className="text-[10px] font-bold text-[#14B8A6] hover:opacity-80 uppercase tracking-tighter transition-colors"
                                                >
                                                    ¿Olvidaste la clave?
                                                </button>
                                            </div>

                                            <LoginInput
                                                name="password"
                                                label=""
                                                type="password"
                                                placeholder="••••••••"
                                                error={!!errors.password}
                                                touched={touched.password}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#0B3C5D] hover:bg-[#14B8A6] text-white font-black py-4.5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 text-sm"
                                        >
                                            {isLoading ? 'Autenticando...' : 'Entrar al Sistema'}
                                            {!isLoading && <ArrowRight size={18} />}
                                        </button>
                                    </Form>
                                )}
                            </Formik>

                            <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                                <p className="text-sm text-slate-400 font-medium italic">
                                    ¿No tienes una cuenta aún?{' '}
                                    <Link
                                        href={routesPublic.register}
                                        className="text-[#14B8A6] font-black hover:opacity-80 transition-colors ml-1 not-italic tracking-tight"
                                    >
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}

                    {view === 'forgot' && (
                        <div>
                            <button
                                onClick={() => setView('login')}
                                className="flex items-center gap-2 text-slate-400 hover:text-[#14B8A6] font-black text-[10px] uppercase tracking-widest mb-10 transition-colors"
                            >
                                <ChevronLeft size={14} /> Volver
                            </button>

                            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                                Recuperar Acceso
                            </h2>

                            <p className="text-slate-400 font-medium text-sm mb-10 leading-relaxed italic">
                                Te enviaremos un código para restablecer tu cuenta.
                            </p>

                            <Formik initialValues={{ email: 'admin@audioflow.com', password: 'Password1' }} onSubmit={() => setView('success')}>
                                <Form className="space-y-6">
                                    <LoginInput
                                        name="email"
                                        label="Email de registro"
                                        placeholder="tu@email.com"
                                    />

                                    <button
                                        type="submit"
                                        className="w-full bg-[#14B8A6] hover:opacity-90 text-white font-black py-4.5 rounded-2xl shadow-lg flex items-center justify-center gap-3"
                                    >
                                        Enviar Instrucciones <Mail size={18} />
                                    </button>
                                </Form>
                            </Formik>
                        </div>
                    )}

                    {view === 'success' && (
                        <div className="text-center">
                            <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm">
                                <CheckCircle size={36} strokeWidth={2.5} />
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight italic">
                                Correo Enviado
                            </h2>

                            <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                                Revisa tu bandeja de entrada para continuar.
                            </p>

                            <button
                                onClick={() => setView('login')}
                                className="w-full bg-[#0B3C5D] hover:bg-[#14B8A6] text-white font-black py-4.5 rounded-2xl transition-all"
                            >
                                Regresar al Inicio
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
