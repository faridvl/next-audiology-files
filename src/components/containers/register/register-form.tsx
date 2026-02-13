import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { UserPlusIcon, BeakerIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { routesPublic } from '@/shared/navigation/routes';
import { useRegister } from './use-register';

export const RegisterForm: React.FC = () => {
    const { handleRegisterSubmit: onSubmit, isLoading, error: externalError } = useRegister();

    const validationSchema = Yup.object({
        businessName: Yup.string().required('El nombre de la clínica es obligatorio'),
        ownerName: Yup.string().required('El nombre del propietario es obligatorio'),
        email: Yup.string().email('Email inválido').required('El email es obligatorio'),
        password: Yup.string().min(8, 'Mínimo 8 caracteres').required('La contraseña es obligatoria'),
    });

    return (
        <div className="max-w-[520px] w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-10 sm:p-12 border border-slate-100">
            {/* Header del Formulario */}
            <div className="mb-8 text-center">
                <div className="inline-flex bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100 mb-5">
                    <BeakerIcon className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Crear Cuenta</h2>
                <p className="text-slate-500 mt-2 font-medium">Únete a la gestión audiológica inteligente.</p>
            </div>

            {/* Alerta de Error Externo */}
            {externalError && (
                <div className="mb-6 p-4 bg-red-50 border-l-[5px] border-red-500 rounded-r-xl flex items-center gap-3 text-red-700 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-4">
                    <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                    {externalError}
                </div>
            )}

            <Formik
                initialValues={{ businessName: '', ownerName: '', email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="space-y-5">
                        <div className="space-y-4">
                            {/* Campo: Clínica */}
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1.5 ml-1 block">Nombre de la Clínica</label>
                                <Field
                                    name="businessName"
                                    className={`w-full px-5 py-3.5 rounded-2xl border-2 transition-all outline-none font-semibold text-slate-900 ${errors.businessName && touched.businessName
                                        ? 'border-red-100 bg-red-50/30 focus:border-red-500'
                                        : 'border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500'
                                        }`}
                                    placeholder="Ej. Clínica Audiológica Central"
                                />
                                <ErrorMessage name="businessName" component="p" className="text-red-500 text-[10px] mt-1.5 ml-2 font-bold italic" />
                            </div>

                            {/* Campo: Propietario */}
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1.5 ml-1 block">Nombre del Propietario</label>
                                <Field
                                    name="ownerName"
                                    className={`w-full px-5 py-3.5 rounded-2xl border-2 transition-all outline-none font-semibold text-slate-900 ${errors.ownerName && touched.ownerName
                                        ? 'border-red-100 bg-red-50/30 focus:border-red-500'
                                        : 'border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500'
                                        }`}
                                    placeholder="Ej. Dr. Roberto Gómez"
                                />
                                <ErrorMessage name="ownerName" component="p" className="text-red-500 text-[10px] mt-1.5 ml-2 font-bold italic" />
                            </div>

                            {/* Campo: Email */}
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1.5 ml-1 block">Email Corporativo</label>
                                <Field
                                    name="email"
                                    type="email"
                                    className={`w-full px-5 py-3.5 rounded-2xl border-2 transition-all outline-none font-semibold text-slate-900 ${errors.email && touched.email
                                        ? 'border-red-100 bg-red-50/30 focus:border-red-500'
                                        : 'border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500'
                                        }`}
                                    placeholder="correo@clinica.com"
                                />
                                <ErrorMessage name="email" component="p" className="text-red-500 text-[10px] mt-1.5 ml-2 font-bold italic" />
                            </div>

                            {/* Campo: Password */}
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1.5 ml-1 block">Contraseña</label>
                                <Field
                                    name="password"
                                    type="password"
                                    className={`w-full px-5 py-3.5 rounded-2xl border-2 transition-all outline-none font-semibold text-slate-900 ${errors.password && touched.password
                                        ? 'border-red-100 bg-red-50/30 focus:border-red-500'
                                        : 'border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <ErrorMessage name="password" component="p" className="text-red-500 text-[10px] mt-1.5 ml-2 font-bold italic" />
                            </div>
                        </div>

                        {/* Botón de Acción */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4.5 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-3 disabled:opacity-70 text-base py-4"
                        >
                            {isLoading ? 'Registrando Clínica...' : 'Crear Cuenta Corporativa'}
                            {!isLoading && <UserPlusIcon className="h-5 w-5 stroke-[2.5px]" />}
                        </button>
                    </Form>
                )}
            </Formik>

            {/* Footer de Navegación */}
            <div className="mt-8 text-center border-t border-slate-50 pt-6">
                <p className="text-sm text-slate-500 font-medium">
                    ¿Ya eres parte de AudiologyFiles?{' '}
                    <Link href={routesPublic.login} className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                        Inicia Sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};