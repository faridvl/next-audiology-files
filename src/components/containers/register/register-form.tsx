import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import {
  AudioWaveform,
  ArrowRight,
  Store,
  User,
  Mail,
  Phone,
  Key,
  Stethoscope,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { routesPublic } from '@/shared/navigation/routes';
import { useRegister, REGISTER_INITIAL_VALUES, RegisterFormValues } from './use-register';
import { BusinessType, UserSpecialty } from '@/types/auth/auth';

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
}: RegisterInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative">
      <Icon className="absolute left-4 top-[38px] text-neutral-300" size={16} />
      <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
        {label}
      </Typography>
      <Field
        name={name}
        type={inputType}
        placeholder={placeholder}
        className={`w-full pl-11 pr-10 py-3.5 bg-neutral-50 border-2 rounded-app-md outline-none transition-all font-semibold text-sm text-neutral-800 placeholder:font-normal placeholder:text-neutral-400 ${
          error && touched
            ? 'border-danger/30 bg-danger/5 focus:border-danger'
            : 'border-neutral-100 focus:border-primary focus:bg-white focus:shadow-sm'
        }`}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[38px] p-1 text-neutral-300 hover:text-primary transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
      <ErrorMessage
        name={name}
        component="p"
        className="text-danger text-[10px] mt-1 ml-2 font-bold italic"
      />
    </div>
  );
};

const BUSINESS_TYPE_OPTIONS: {
  value: BusinessType;
  label: string;
  icon: string;
}[] = [
  { value: BusinessType.AUDIOLOGY, label: 'Audiología', icon: '🎧' },
  { value: BusinessType.DENTAL, label: 'Odontología', icon: '🦷' },
  { value: BusinessType.GENERAL, label: 'General', icon: '🏥' },
  { value: BusinessType.OTHER, label: 'Otra', icon: '⚕️' },
];

const SPECIALTY_OPTIONS: { value: UserSpecialty; label: string }[] = [
  { value: UserSpecialty.AUDIOLOGY, label: 'Audiólogo / Fonoaudiólogo' },
  { value: UserSpecialty.DENTAL, label: 'Odontólogo' },
  { value: UserSpecialty.GENERAL, label: 'Médico General' },
];

const PASSWORD_RULES = [
  { regex: /.{8,}/, label: 'Mínimo 8 caracteres' },
  { regex: /[A-Z]/, label: 'Al menos una mayúscula' },
  { regex: /[a-z]/, label: 'Al menos una minúscula' },
  { regex: /[0-9]/, label: 'Al menos un número' },
  { regex: /[^A-Za-z0-9]/, label: 'Al menos un símbolo' },
];

const PasswordField: React.FC = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Key className="absolute left-4 top-[38px] text-neutral-300" size={16} />
      <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
        Contraseña
      </Typography>
      <Field name="password">
        {({ field, meta }: { field: { value: string; name: string; onChange: React.ChangeEventHandler; onBlur: React.FocusEventHandler }; meta: { touched: boolean; error?: string } }) => (
          <div className="relative">
            <input
              {...field}
              type={show ? 'text' : 'password'}
              placeholder="Crea una contraseña segura"
              className={`w-full pl-11 pr-10 py-3.5 bg-neutral-50 border-2 rounded-app-md outline-none transition-all font-semibold text-sm text-neutral-800 placeholder:font-normal placeholder:text-neutral-400 ${
                meta.touched && meta.error
                  ? 'border-danger/30 bg-danger/5 focus:border-danger'
                  : 'border-neutral-100 focus:border-primary focus:bg-white focus:shadow-sm'
              }`}
            />
            <button
              type="button"
              onClick={() => setShow((previous) => !previous)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-300 hover:text-primary transition-colors"
              tabIndex={-1}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        )}
      </Field>
      <ErrorMessage name="password" component="p" className="text-danger text-[10px] mt-1 ml-2 font-bold italic" />
    </div>
  );
};

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  if (!password) return null;
  const passed = PASSWORD_RULES.filter((rule) => rule.regex.test(password));
  const strength = passed.length;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {PASSWORD_RULES.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all ${
              index < strength
                ? strength <= 2
                  ? 'bg-danger'
                  : strength <= 3
                  ? 'bg-warning'
                  : 'bg-success'
                : 'bg-neutral-100'
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {PASSWORD_RULES.map((rule) => (
          <Typography
            key={rule.label}
            variant={TypographyVariant.CAPTION}
            className={`text-[10px] font-medium ${rule.regex.test(password) ? 'text-success' : 'text-neutral-400'}`}
          >
            {rule.regex.test(password) ? '✓' : '○'} {rule.label}
          </Typography>
        ))}
      </div>
    </div>
  );
};

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
};

const validationSchema = Yup.object({
  businessName: Yup.string().required('Obligatorio'),
  businessType: Yup.string().required('Obligatorio'),
  ownerName: Yup.string().min(3, 'Mínimo 3 caracteres').required('Obligatorio'),
  phone: Yup.string().optional(),
  email: Yup.string().email('Ingresa un email válido').required('Obligatorio'),
  password: Yup.string()
    .min(8, 'Mínimo 8 caracteres')
    .matches(/[A-Z]/, 'Debe incluir al menos una mayúscula')
    .matches(/[a-z]/, 'Debe incluir al menos una minúscula')
    .matches(/[0-9]/, 'Debe incluir al menos un número')
    .matches(/[^A-Za-z0-9]/, 'Debe incluir al menos un símbolo')
    .required('Obligatorio'),
  isSpecialist: Yup.boolean(),
  specialty: Yup.string().when('isSpecialist', {
    is: true,
    then: (schema) => schema.required('La especialidad es obligatoria'),
    otherwise: (schema) => schema.optional(),
  }),
});

export const RegisterForm: React.FC = () => {
  const { handleAccountInfo, isLoading, error } = useRegister();

  return (
    <div className="w-full max-w-[1100px] bg-white rounded-app-2xl shadow-[0_40px_100px_-15px_rgba(0,0,0,0.18)] overflow-hidden flex min-h-[680px] border border-neutral-100">

      {/* COLUMNA IZQUIERDA — BRANDING */}
      <div className="hidden lg:flex w-[38%] flex-col justify-between p-14 bg-[#0B3C5D] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B3C5D] via-[#0B3C5D] to-[#0a2d47]" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#14B8A6]/10 blur-[60px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-[#14B8A6] p-2 rounded-app-sm">
              <AudioWaveform className="h-5 w-5 text-white" />
            </div>
            <Typography variant={TypographyVariant.BODY_BOLD} className="text-xl font-black text-white tracking-tight">
              Zynka
            </Typography>
          </div>
          <Typography variant={TypographyVariant.HEADER} as="h1" className="text-4xl font-black leading-tight text-white mb-6">
            Digitaliza tu clínica en minutos.
          </Typography>
          <Typography variant={TypographyVariant.BODY} className="text-neutral-300 text-base leading-relaxed max-w-xs">
            Crea tu cuenta gratuita y empieza a gestionar pacientes, citas y controles médicos desde el primer día.
          </Typography>
        </div>
        <div className="relative z-10 space-y-3">
          {['Sin contratos ni instalaciones', 'Datos seguros y privados', 'Soporte en español'].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
              <Typography variant={TypographyVariant.CAPTION} className="text-neutral-300 text-sm">
                {item}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* COLUMNA DERECHA — FORMULARIO */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 sm:p-12 lg:p-14">

          {/* Cabecera mobile */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="bg-primary p-2 rounded-app-sm">
              <AudioWaveform className="h-4 w-4 text-white" />
            </div>
            <Typography variant={TypographyVariant.BODY_BOLD} className="text-lg font-black text-neutral-900">Zynka</Typography>
          </div>

          <div className="mb-8">
            <Typography variant={TypographyVariant.HEADER} as="h2" className="text-2xl font-black text-neutral-900 tracking-tight">
              Crear cuenta
            </Typography>
            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 mt-1 italic">
              Configura tu clínica en menos de 2 minutos
            </Typography>
          </div>

          <Formik
            initialValues={REGISTER_INITIAL_VALUES}
            validationSchema={validationSchema}
            onSubmit={handleAccountInfo}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form className="space-y-8">

                {/* Sección 1: La clínica */}
                <div className="space-y-4">
                  <Typography variant={TypographyVariant.OVERLINE} className="text-[10px] font-black tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2 block">
                    Datos de la Clínica
                  </Typography>

                  <RegisterInput
                    name="businessName"
                    label="Nombre de la clínica u organización"
                    placeholder="Ej. Centro Auditivo Norte"
                    icon={Store}
                    error={!!errors.businessName}
                    touched={touched.businessName}
                  />

                  <div>
                    <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-2 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                      Tipo de especialidad
                    </Typography>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {BUSINESS_TYPE_OPTIONS.map((option) => {
                        const isSelected = values.businessType === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFieldValue('businessType', option.value)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-app-md border-2 text-center transition-all ${
                              isSelected
                                ? 'border-primary bg-primary-soft text-primary-dark shadow-sm'
                                : 'border-neutral-100 bg-neutral-50 text-neutral-500 hover:border-neutral-200 hover:bg-white'
                            }`}
                          >
                            <span className="text-xl">{option.icon}</span>
                            <Typography variant={TypographyVariant.CAPTION} className="text-[11px] font-black">{option.label}</Typography>
                          </button>
                        );
                      })}
                    </div>
                    <ErrorMessage name="businessType" component="p" className="text-danger text-[10px] mt-1 ml-2 font-bold italic" />
                  </div>
                </div>

                {/* Sección 2: Datos del Administrador */}
                <div className="space-y-4">
                  <Typography variant={TypographyVariant.OVERLINE} className="text-[10px] font-black tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2 block">
                    Datos del Administrador
                  </Typography>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RegisterInput
                      name="ownerName"
                      label="Nombre completo"
                      placeholder="Ej. Dr. Juan Pérez"
                      icon={User}
                      error={!!errors.ownerName}
                      touched={touched.ownerName}
                    />
                    <div className="relative">
                      <Phone className="absolute left-4 top-[38px] text-neutral-300" size={16} />
                      <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                        Teléfono (opcional)
                      </Typography>
                      <Field name="phone">
                        {({ field, form }: { field: { value: string; name: string }; form: { setFieldValue: (name: string, value: string) => void } }) => (
                          <input
                            {...field}
                            type="tel"
                            placeholder="55 1234 5678"
                            maxLength={12}
                            onChange={(event) => form.setFieldValue('phone', formatPhone(event.target.value))}
                            className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border-2 border-neutral-100 rounded-app-md outline-none transition-all font-semibold text-sm text-neutral-800 placeholder:font-normal placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:shadow-sm"
                          />
                        )}
                      </Field>
                    </div>
                  </div>

                  <RegisterInput
                    name="email"
                    label="Correo electrónico"
                    placeholder="admin@miclinica.com"
                    icon={Mail}
                    error={!!errors.email}
                    touched={touched.email}
                  />

                  <div>
                    <PasswordField />
                    <PasswordStrength password={values.password} />
                  </div>
                </div>

                {/* Toggle: ¿También eres especialista? */}
                <div
                  className={`rounded-app-md border-2 p-4 transition-all cursor-pointer ${
                    values.isSpecialist ? 'border-primary-soft bg-primary-soft' : 'border-neutral-100 bg-neutral-50'
                  }`}
                  onClick={() => setFieldValue('isSpecialist', !values.isSpecialist)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Stethoscope
                        size={17}
                        className={values.isSpecialist ? 'text-primary' : 'text-neutral-400'}
                      />
                      <div>
                        <Typography
                          variant={TypographyVariant.BODY_BOLD}
                          className={`text-sm font-black ${values.isSpecialist ? 'text-primary-dark' : 'text-neutral-700'}`}
                        >
                          También soy especialista en esta clínica
                        </Typography>
                        <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 text-[11px] mt-0.5">
                          Actívalo si atiendes pacientes directamente
                        </Typography>
                      </div>
                    </div>
                    <div
                      className={`w-10 h-6 rounded-full transition-all relative shrink-0 ${
                        values.isSpecialist ? 'bg-primary' : 'bg-neutral-200'
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
                    <div className="mt-4" onClick={(event) => event.stopPropagation()}>
                      <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1.5 block text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                        Mi especialidad
                      </Typography>
                      <div className="relative">
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none" />
                        <Field
                          as="select"
                          name="specialty"
                          className={`w-full appearance-none px-4 py-3 bg-white border-2 rounded-app-sm outline-none transition-all font-semibold text-sm text-neutral-800 ${
                            errors.specialty && touched.specialty
                              ? 'border-danger/30 focus:border-danger'
                              : 'border-neutral-100 focus:border-primary'
                          }`}
                        >
                          <option value="">Selecciona tu especialidad...</option>
                          {SPECIALTY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <ErrorMessage name="specialty" component="p" className="text-danger text-[10px] mt-1 ml-2 font-bold italic" />
                    </div>
                  )}
                </div>

                {error && (
                  <Typography variant={TypographyVariant.CAPTION} className="text-danger text-xs text-center font-bold bg-danger/10 py-3 px-4 rounded-app-md block">
                    {error}
                  </Typography>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0B3C5D] hover:bg-[#14B8A6] text-white font-black py-4 rounded-app-md shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>

                <Typography variant={TypographyVariant.CAPTION} className="text-center text-neutral-400 block">
                  ¿Ya tienes cuenta?{' '}
                  <Link href={routesPublic.login} className="text-primary font-bold hover:underline">
                    Inicia sesión
                  </Link>
                </Typography>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
