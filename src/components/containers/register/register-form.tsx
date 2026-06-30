import React from 'react';
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
    <Icon className="absolute left-4 top-[38px] text-neutral-300" size={18} />
    <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1 block">
      {label}
    </Typography>
    <Field
      name={name}
      type={type}
      placeholder={placeholder}
      className={`w-full pl-12 pr-5 py-3.5 bg-neutral-50 border-2 rounded-app-md outline-none transition-all font-semibold text-sm ${
        error && touched
          ? 'border-danger/20 focus:border-danger'
          : 'border-transparent focus:border-primary focus:bg-white'
      }`}
    />
    <ErrorMessage
      name={name}
      component="p"
      className="text-danger text-[10px] mt-1 ml-2 font-bold italic"
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
  const { handleAccountInfo, isLoading, error } = useRegister();

  return (
    <div className="max-w-[520px] w-full bg-white rounded-app-2xl shadow-2xl p-10 sm:p-12 border border-neutral-100">
      {/* Cabecera */}
      <div className="mb-10 text-center">
        <div className="inline-flex bg-primary p-3.5 rounded-app-md mb-6 shadow-lg shadow-primary-soft">
          <AudioWaveform className="h-6 w-6 text-white" />
        </div>

          <Typography variant={TypographyVariant.SUBTITLE} as="h2" className="text-3xl font-black text-neutral-900 tracking-tight">Crear Cuenta</Typography>
      </div>

      <Formik
          initialValues={REGISTER_INITIAL_VALUES}
          validationSchema={validationSchema}
          onSubmit={handleAccountInfo}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-5">
              {/* Sección: La organización */}
              <div>
                <Typography variant={TypographyVariant.OVERLINE} className="ml-1 mb-3">
                  Tu clínica u organización
                </Typography>
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
                  <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-2 block">
                    Tipo de Especialidad
                  </Typography>
                  <div className="grid grid-cols-2 gap-2">
                    {BUSINESS_TYPE_OPTIONS.map((option) => {
                      const isSelected = values.businessType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFieldValue('businessType', option.value)}
                          className={`flex items-center gap-3 p-3 rounded-app-md border-2 text-left transition-all ${
                            isSelected
                              ? 'border-primary bg-primary-soft text-primary-dark'
                              : 'border-transparent bg-neutral-50 text-neutral-600 hover:border-neutral-200'
                          }`}
                        >
                          <span className="text-lg">{option.icon}</span>
                          <div>
                            <Typography variant={TypographyVariant.CAPTION} className="text-xs font-black">{option.label}</Typography>
                            <Typography variant={TypographyVariant.CAPTION} className="opacity-60">{option.description}</Typography>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <ErrorMessage
                    name="businessType"
                    component="p"
                    className="text-danger text-[10px] mt-1 ml-2 font-bold italic"
                  />
                </div>
              </div>

              {/* Sección: El administrador */}
              <div>
                <Typography variant={TypographyVariant.OVERLINE} className="ml-1 mb-3 mt-2">
                  Tu cuenta de acceso
                </Typography>
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
                className={`rounded-app-md border-2 p-4 transition-all cursor-pointer ${
                  values.isSpecialist
                    ? 'border-primary-soft bg-primary-soft'
                    : 'border-neutral-100 bg-neutral-50'
                }`}
                onClick={() => setFieldValue('isSpecialist', !values.isSpecialist)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Stethoscope
                      size={18}
                      className={values.isSpecialist ? 'text-primary' : 'text-neutral-400'}
                    />
                    <div>
                      <Typography
                        variant={TypographyVariant.BODY_BOLD}
                        className={`text-sm font-black ${values.isSpecialist ? 'text-primary-dark' : 'text-neutral-700'}`}
                      >
                        También soy especialista en esta clínica
                      </Typography>
                      <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 mt-0.5">
                        Actívalo si atiendes pacientes directamente
                      </Typography>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full transition-all relative ${
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
                  <div className="mt-3" onClick={(event) => event.stopPropagation()}>
                    <Typography variant={TypographyVariant.OVERLINE} as="label" className="ml-1 mb-1 block">
                      Mi especialidad
                    </Typography>
                    <Field
                      name="specialty"
                      placeholder="Ej. Audiólogo, Odontólogo general..."
                      className={`w-full px-4 py-3 bg-white border-2 rounded-app-sm outline-none transition-all font-semibold text-sm ${
                        errors.specialty && touched.specialty
                          ? 'border-danger/30 focus:border-danger'
                          : 'border-neutral-100 focus:border-primary'
                      }`}
                    />
                    <ErrorMessage
                      name="specialty"
                      component="p"
                      className="text-danger text-[10px] mt-1 ml-2 font-bold italic"
                    />
                  </div>
                )}
              </div>

              {error && (
                <Typography variant={TypographyVariant.CAPTION} className="text-danger text-xs text-center font-bold bg-danger/10 py-3 rounded-app-md block">
                  {error}
                </Typography>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-neutral-900 hover:bg-primary text-white font-black py-4 rounded-app-md shadow-xl transition-all mt-2 flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                <ArrowRight size={18} />
              </button>

              <Typography variant={TypographyVariant.CAPTION} className="text-center text-neutral-400 mt-2 block">
                ¿Ya tienes cuenta?{' '}
                <Link href={routesPublic.login} className="text-primary font-bold hover:underline">
                  Inicia sesión
                </Link>
              </Typography>
            </Form>
          )}
        </Formik>
    </div>
  );
};
