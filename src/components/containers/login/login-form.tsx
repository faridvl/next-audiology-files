import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { ArrowRightIcon, BeakerIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { routesPublic } from '@/shared/navigation/routes';

interface LoginFormProps {
    onSubmit: (values: any, actions: any) => Promise<void>;
    isLoading: boolean;
    externalError: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, externalError }) => {
    const validationSchema = Yup.object({
        email: Yup.string().email('Email inválido').required('El email es obligatorio'),
        password: Yup.string().required('La contraseña es obligatoria'),
    });

    return (
        <div className="max-w-[1200px] w-full bg-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex min-h-[750px] transition-all duration-500">
            {/* Lado Izquierdo: Branding con Animación */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-20 text-white bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/login-bg.jpg"
                        alt="Background"
                        className="h-full w-full object-cover opacity-50 scale-110 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/90 to-slate-900" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20 shadow-xl">
                            <BeakerIcon className="h-10 w-10 text-blue-400" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter italic">AudiologyFiles</span>
                    </div>
                    <h1 className="text-6xl font-black leading-[1.1] tracking-tight">
                        Tu clínica, <br />
                        <span className="text-blue-400">evolucionada.</span>
                    </h1>
                    <p className="mt-6 text-lg text-slate-300 max-w-md font-medium leading-relaxed">
                        La plataforma definitiva para la gestión de pacientes y estudios audiológicos de alta precisión.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-6">
                    <div className="h-[1px] w-12 bg-blue-500/50"></div>
                    <p className="text-xs font-bold opacity-60 uppercase tracking-[0.3em]">Precision Health Suite v2.0</p>
                </div>
            </div>

            {/* Lado Derecho: Formulario */}
            <div className="w-full lg:w-1/2 p-10 sm:p-20 flex flex-col justify-center bg-white">
                <div className="max-w-[420px] mx-auto w-full">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-slate-900 mb-3">Iniciar Sesión</h2>
                        <p className="text-slate-500 font-medium text-lg">Accede a tu panel de control clínico.</p>
                    </div>

                    {externalError && (
                        <div className="mb-8 p-5 bg-red-50 border-l-[6px] border-red-500 rounded-xl flex items-center gap-4 text-red-700 text-sm font-bold shadow-sm animate-shake">
                            <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0" />
                            {externalError}
                        </div>
                    )}

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-2.5 ml-1">Email Corporativo</label>
                                    <Field
                                        name="email"
                                        type="email"
                                        className={`w-full px-6 py-5 rounded-[1.25rem] border-2 transition-all duration-300 outline-none font-semibold text-slate-900 ${errors.email && touched.email
                                            ? 'border-red-100 bg-red-50/50 focus:border-red-500'
                                            : 'border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/10'
                                            }`}
                                        placeholder="ejemplo@clinica.com"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-[11px] mt-2 ml-2 font-bold italic" />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2.5 ml-1">
                                        <label className="block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Contraseña</label>
                                        <Link href="#" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter">¿Olvidaste tu contraseña?</Link>
                                    </div>
                                    <Field
                                        name="password"
                                        type="password"
                                        className={`w-full px-6 py-5 rounded-[1.25rem] border-2 transition-all duration-300 outline-none font-semibold text-slate-900 ${errors.password && touched.password
                                            ? 'border-red-100 bg-red-50/50 focus:border-red-500'
                                            : 'border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 focus:shadow-xl focus:shadow-blue-500/10'
                                            }`}
                                        placeholder="••••••••••••"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-[11px] mt-2 ml-2 font-bold italic" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-5 rounded-[1.25rem] shadow-xl hover:shadow-blue-500/30 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-8 text-lg"
                                >
                                    {isLoading ? 'Autenticando...' : 'Entrar al Sistema'}
                                    {!isLoading && <ArrowRightIcon className="h-6 w-6 stroke-[3px]" />}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    {/* Botón de Registro */}
                    <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 font-medium mb-4">¿No tienes una cuenta aún?</p>
                        <Link
                            href={routesPublic.register}
                            className="inline-flex items-center justify-center px-8 py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all duration-300 active:scale-95"
                        >
                            Crear cuenta corporativa
                        </Link>
                    </div>
                </div>
            </div>

            {/* Animación personalizada para Tailwind (añadir en tailwind.config.js o globals.css) */}
            <style jsx>{`
                @keyframes slow-zoom {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s infinite ease-in-out;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </div>
    );
};