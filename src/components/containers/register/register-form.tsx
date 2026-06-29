import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import {
  AudioWaveform,
  ArrowRight,
  Store,
  User,
  Mail,
  Phone,
  Key,
  CheckCircle,
  Stethoscope,
  CreditCard,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { routesPublic } from '@/shared/navigation/routes';
import { useRegister, REGISTER_INITIAL_VALUES, RegisterFormValues } from './use-register';
import { BusinessType } from '@/types/auth/auth';

interface RegisterInputProps {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  icon: LucideIcon;
  error?: boolean;
  touched?: boolean;
}

const RegisterInput = ({
  name,
  label,
  placeholder,
  type = 'text',
  icon: Icon,
  error,
  touched,
}: RegisterInputProps) => (
  <div className="relative">
    <Icon className="absolute left-4 top-[38px] text-slate-300" size={18} />
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">
      {label}
    </label>
    <Field
      name={name}
      type={type}
      placeholder={placeholder}
      className={`w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-semibold text-sm ${
        error && touched
          ? 'border-red-100 focus:border-red-500'
          : 'border-transparent focus:border-blue-500 focus:bg-white'
      }`}
    />
    <ErrorMessage
      name={name}
      component="p"
      className="text-red-500 text-[10px] mt-1 ml-2 font-bold italic"
    />
  </div>
);

const BUSINESS_TYPE_OPTIONS: {
  value: BusinessType;
  label: string;
  description: string;
  icon: string;
}[] = [
  { value: BusinessType.AUDIOLOGY, label: 'Audiología', description: 'Audición y lenguaje', icon: '🎧' },
  { value: BusinessType.DENTAL, label: 'Odontología', description: 'Salud dental', icon: '🦷' },
  { value: BusinessType.GENERAL, label: 'General', description: 'Medicina general', icon: '🏥' },
  { value: BusinessType.OTHER, label: 'Otra', description: 'Otra especialidad', icon: '⚕️' },
];

export const PaymentStep = ({ onNext }: { onNext: () => void }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-500">
    <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
          Plan Seleccionado
        </p>
        <h4 className="text-xl font-bold italic tracking-tight">Zynka</h4>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-black">$49.00</span>
          <span className="text-xs opacity-80">/ mes</span>
        </div>
      </div>
      <ShieldCheck className="absolute right-[-10px] bottom-[-10px] h-32 w-32 opacity-10 rotate-12" />
    </div>

    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">
          Nombre en la tarjeta
        </label>
        <input
          defaultValue="JUAN PEREZ"
          className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-semibold"
        />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">
          Número de Tarjeta
        </label>
        <div className="relative">
          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            defaultValue="4242 4242 4242 4242"
            className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-semibold"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">
            Vencimiento
          </label>
          <input
            defaultValue="12/28"
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-semibold"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">
            CVC
          </label>
          <input
            defaultValue="123"
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition-all text-sm font-semibold"
          />
        </div>
      </div>
    </div>

    <button
      onClick={onNext}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-3 mt-4"
    >
      <Lock size={18} /> Confirmar Suscripción
    </button>
  </div>
);

const validationSchema = Yup.object({
  businessName: Yup.string().required('Obligatorio'),
  businessType: Yup.string().required('Obligatorio'),
  ownerName: Yup.string().required('Obligatorio'),
  phone: Yup.string().optional(),
  email: Yup.string().email('Email inválido').required('Obligatorio'),
  password: Yup.string()
    .min(8, 'Mínimo 8 caracteres')
    .matches(/[A-Z]/, 'Debe incluir al menos una mayúscula')
    .matches(/[0-9]/, 'Debe incluir al menos un número')
    .required('Obligatorio'),
  isSpecialist: Yup.boolean(),
  specialty: Yup.string().when('isSpecialist', {
    is: true,
    then: (schema) => schema.required('La especialidad es obligatoria'),
    otherwise: (schema) => schema.optional(),
  }),
});

export const RegisterForm: React.FC = () => {
  const { step, handleAccountInfo, isLoading, error, nextStep } = useRegister();

  return (
    <div className="max-w-[520px] w-full bg-white rounded-[3rem] shadow-2xl p-10 sm:p-12 border border-slate-100">
      {/* Cabecera */}
      <div className="mb-10 text-center">
        <div className="inline-flex bg-blue-600 p-3.5 rounded-2xl mb-6 shadow-lg shadow-blue-100">
          <AudioWaveform className="h-6 w-6 text-white" />
        </div>

        {/* Step Dots */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                step === s
                  ? 'w-8 bg-blue-600'
                  : step > s
                  ? 'w-2.5 bg-emerald-500'
                  : 'w-2.5 bg-slate-100'
              }`}
            />
          ))}
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {step === 1 && 'Crear Cuenta'}
          {step === 2 && 'Plan y Pago'}
          {step === 3 && 'Confirmación'}
        </h2>
      </div>

      {step === 1 && (
        <Formik
          initialValues={REGISTER_INITIAL_VALUES}
          validationSchema={validationSchema}
          onSubmit={handleAccountInfo}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-5">
              {/* Sección: La organización */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3">
                  Tu clínica u organización
                </p>
                <RegisterInput
                  name="businessName"
                  label="Nombre de la Clínica"
                  placeholder="Ej. Centro Auditivo Norte"
                  icon={Store}
                  error={!!errors.businessName}
                  touched={touched.businessName}
                />

                {/* Selector de tipo de clínica */}
                <div className="mt-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                    Tipo de Especialidad
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUSINESS_TYPE_OPTIONS.map((option) => {
                      const isSelected = values.businessType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFieldValue('businessType', option.value)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-transparent bg-slate-50 text-slate-600 hover:border-slate-200'
                          }`}
                        >
                          <span className="text-lg">{option.icon}</span>
                          <div>
                            <p className="text-xs font-black">{option.label}</p>
                            <p className="text-[10px] opacity-60">{option.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <ErrorMessage
                    name="businessType"
                    component="p"
                    className="text-red-500 text-[10px] mt-1 ml-2 font-bold italic"
                  />
                </div>
              </div>

              {/* Sección: El administrador */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 mt-2">
                  Tu cuenta de acceso
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <RegisterInput
                    name="ownerName"
                    label="Nombre completo"
                    placeholder="Dr. Juan Pérez"
                    icon={User}
                    error={!!errors.ownerName}
                    touched={touched.ownerName}
                  />
                  <RegisterInput
                    name="phone"
                    label="Teléfono (opcional)"
                    placeholder="55 1234 5678"
                    icon={Phone}
                    error={!!errors.phone}
                    touched={touched.phone}
                  />
                </div>
                <div className="mt-4 space-y-4">
                  <RegisterInput
                    name="email"
                    label="Email Corporativo"
                    placeholder="admin@miclinica.com"
                    icon={Mail}
                    error={!!errors.email}
                    touched={touched.email}
                  />
                  <RegisterInput
                    name="password"
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    icon={Key}
                    error={!!errors.password}
                    touched={touched.password}
                  />
                </div>
              </div>

              {/* Toggle: ¿También eres especialista? */}
              <div
                className={`rounded-2xl border-2 p-4 transition-all cursor-pointer ${
                  values.isSpecialist
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-slate-100 bg-slate-50'
                }`}
                onClick={() => setFieldValue('isSpecialist', !values.isSpecialist)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Stethoscope
                      size={18}
                      className={values.isSpecialist ? 'text-blue-600' : 'text-slate-400'}
                    />
                    <div>
                      <p
                        className={`text-sm font-black ${
                          values.isSpecialist ? 'text-blue-700' : 'text-slate-700'
                        }`}
                      >
                        También soy especialista en esta clínica
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Actívalo si atiendes pacientes directamente
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full transition-all relative ${
                      values.isSpecialist ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                        values.isSpecialist ? 'left-5' : 'left-1'
                      }`}
                    />
                  </div>
                </div>

                {values.isSpecialist && (
                  <div className="mt-3" onClick={(event) => event.stopPropagation()}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">
                      Mi especialidad
                    </label>
                    <Field
                      name="specialty"
                      placeholder="Ej. Audiólogo, Odontólogo general..."
                      className={`w-full px-4 py-3 bg-white border-2 rounded-xl outline-none transition-all font-semibold text-sm ${
                        errors.specialty && touched.specialty
                          ? 'border-red-200 focus:border-red-500'
                          : 'border-slate-100 focus:border-blue-500'
                      }`}
                    />
                    <ErrorMessage
                      name="specialty"
                      component="p"
                      className="text-red-500 text-[10px] mt-1 ml-2 font-bold italic"
                    />
                  </div>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-xs text-center font-bold bg-red-50 py-3 rounded-2xl">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl transition-all mt-2 flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {isLoading ? 'Procesando...' : 'Continuar al Pago'}
                <ArrowRight size={18} />
              </button>

              <p className="text-center text-xs text-slate-400 mt-2">
                ¿Ya tienes cuenta?{' '}
                <Link href={routesPublic.login} className="text-blue-600 font-bold hover:underline">
                  Inicia sesión
                </Link>
              </p>
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
          <Link
            href={routesPublic.login}
            className="block w-full bg-slate-900 text-white font-black py-4 rounded-2xl mt-10 shadow-xl"
          >
            Comenzar Ahora
          </Link>
        </div>
      )}
    </div>
  );
};
