import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { AudioWaveform, ArrowRight, Store, User, Mail, Phone, Key, CheckCircle } from 'lucide-react';
import { routesPublic } from '@/shared/navigation/routes';
import { useRegister } from '../register/use-register';
import { LucideIcon } from 'lucide-react';
import { Field, ErrorMessage } from 'formik';

interface RegisterInputProps {
    name: string;
    label: string; // TODO: i18n key
    placeholder: string;
    type?: string;
    icon: LucideIcon;
    error?: boolean;
    touched?: boolean;
}

export const RegisterInput = ({ name, label, placeholder, type = "text", icon: Icon, error, touched }: RegisterInputProps) => (
    <div className="relative">
        <Icon className="absolute left-4 top-[38px] text-slate-300" size={18} />
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">{label}</label>
        <Field
            name={name}
            type={type}
            placeholder={placeholder}
            className={`w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-semibold text-sm ${error && touched ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-blue-500 focus:bg-white'
                }`}
        />
        <ErrorMessage name={name} component="p" className="text-red-500 text-[10px] mt-1 ml-2 font-bold italic" />
    </div>
);

import { CreditCard, Lock, ShieldCheck } from 'lucide-react';

export const PaymentStep = ({ onNext }: { onNext: () => void }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-500">
        {/* Plan Summary */}
        <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Plan Seleccionado</p>
                <h4 className="text-xl font-bold italic tracking-tight">Zynka</h4>
                <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-black">$49.00</span>
                    <span className="text-xs opacity-80">/ mes</span>
                </div>
            </div>
            <ShieldCheck className="absolute right-[-10px] bottom-[-10px] h-32 w-32 opacity-10 rotate-12" />
        </div>

        {/* Formulario de Tarjeta Simulado */}
        <div className="space-y-4">
            <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Nombre en la tarjeta</label>
                <input defaultValue="JUAN PEREZ" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-semibold" />
            </div>
            <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Número de Tarjeta</label>
                <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input defaultValue="4242 4242 4242 4242" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-semibold" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Vencimiento</label>
                    <input defaultValue="12/28" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-semibold" />
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">CVC</label>
                    <input defaultValue="123" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-semibold" />
                </div>
            </div>
        </div>

        <button
            onClick={onNext}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4.5 rounded-2xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-3 mt-4"
        >
            <Lock size={18} /> Confirmar Suscripción
        </button>
    </div>
);

export const RegisterForm: React.FC = () => {
    const { step, handleAccountInfo, isLoading, error, nextStep } = useRegister();

    // TODO: Mover a un archivo de constantes de validación
    const validationSchema = Yup.object({
        businessName: Yup.string().required('Obligatorio'),
        ownerName: Yup.string().required('Obligatorio'),
        email: Yup.string().email('Email inválido').required('Obligatorio'),
        phone: Yup.string().required('Obligatorio'),
        password: Yup.string().min(8, 'Mínimo 8').required('Obligatorio'),
    });

    return (
        <div className="max-w-[520px] w-full bg-white rounded-[3rem] shadow-2xl p-10 sm:p-12 border border-slate-100">

            {/* Cabecera / TODO: Traducir textos */}
            <div className="mb-10 text-center">
                <div className="inline-flex bg-blue-600 p-3.5 rounded-2xl mb-6 shadow-lg shadow-blue-100">
                    <AudioWaveform className="h-6 w-6 text-white" />
                </div>

                {/* Step Dots */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-2.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-blue-600' : step > s ? 'w-2.5 bg-emerald-500' : 'w-2.5 bg-slate-100'
                            }`} />
                    ))}
                </div>

                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {step === 1 && "Crear Cuenta"}
                    {step === 2 && "Plan y Pago"}
                    {step === 3 && "Confirmación"}
                </h2>
            </div>

            {/* Renderizado de Pasos */}
            {step === 1 && (
                <Formik
                    initialValues={{ businessName: '', ownerName: '', email: '', phone: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleAccountInfo}
                >
                    {({ errors, touched }) => (
                        <Form className="space-y-4">
                            <RegisterInput name="businessName" label="Nombre de la Clínica" placeholder="Ej. Zynka Central" icon={Store} error={!!errors.businessName} touched={touched.businessName} />

                            <div className="grid grid-cols-2 gap-4">
                                <RegisterInput name="ownerName" label="Propietario" placeholder="Dr. Farid" icon={User} error={!!errors.ownerName} touched={touched.ownerName} />
                                <RegisterInput name="phone" label="Teléfono" placeholder="55 1234 5678" icon={Phone} error={!!errors.phone} touched={touched.phone} />
                            </div>

                            <RegisterInput name="email" label="Email Corporativo" placeholder="admin@zynka.com" icon={Mail} error={!!errors.email} touched={touched.email} />
                            <RegisterInput name="password" label="Contraseña" type="password" placeholder="••••••••" icon={Key} error={!!errors.password} touched={touched.password} />

                            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4.5 rounded-2xl shadow-xl transition-all mt-6 flex items-center justify-center gap-3">
                                {isLoading ? 'Procesando...' : 'Continuar al Pago'}
                                <ArrowRight size={18} />
                            </button>
                        </Form>
                    )}
                </Formik>
            )}

            {step === 2 && <PaymentStep onNext={nextStep} />}

            {step === 3 && (
                <div className="text-center py-4 animate-in zoom-in-95">
                    <div className="h-24 w-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                        <CheckCircle size={48} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 italic">¡Felicidades!</h3>
                    <p className="text-slate-500 mt-3 px-4">Tu cuenta corporativa ha sido activada con éxito.</p>
                    <Link href={routesPublic.login} className="block w-full bg-slate-900 text-white font-black py-4 rounded-2xl mt-10 shadow-xl">
                        Comenzar Ahora
                    </Link>
                </div>
            )}
        </div>
    );
};