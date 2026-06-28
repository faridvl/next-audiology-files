import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ArrowLeft, UserIcon } from 'lucide-react';
import { UserIcon as HeroUserIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { usePatientEdit } from './use-patient-edit';

interface Props {
  patientUuid: string;
}

export const PatientEditContainer: React.FC<Props> = ({ patientUuid }) => {
  const {
    initialValues,
    isLoadingPatient,
    isSaving,
    handleSubmit,
    handleCancel,
    validationSchema,
  } = usePatientEdit(patientUuid);

  const inputClasses =
    'w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-semibold text-slate-700 text-sm';
  const labelClasses = 'ml-1 mb-1 block';

  const handlePhoneKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '+', ' ', '-'];
    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  if (isLoadingPatient) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-4 animate-pulse space-y-4">
        <div className="h-8 bg-slate-100 rounded w-1/3" />
        <div className="h-64 bg-slate-100 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 p-4">
      <button
        onClick={handleCancel}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-medium text-xs uppercase tracking-widest transition-all mb-6"
      >
        <ArrowLeft size={14} /> Volver al expediente
      </button>

      <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3rem] overflow-hidden border border-slate-100">
        <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex items-center gap-4">
          <div className="bg-[#1E3A8A] p-3 rounded-2xl shadow-lg shadow-blue-900/20">
            <UserIcon size={24} className="text-white" />
          </div>
          <div>
            <Typography variant={TypographyVariant.SUBTITLE} textColor="text-slate-800">
              Editar Paciente
            </Typography>
            <Typography variant={TypographyVariant.HELPER}>
              Actualice los datos del expediente clínico.
            </Typography>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnBlur
          validateOnChange={false}
        >
          {() => (
            <Form className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                {/* Nombre */}
                <div>
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Nombre</Typography>
                  <div className="relative group">
                    <Field name="firstName" maxLength={60} className={inputClasses} placeholder="Nombre" />
                    <HeroUserIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <ErrorMessage name="firstName" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-red-500" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>

                {/* Apellido */}
                <div>
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Apellido</Typography>
                  <div className="relative group">
                    <Field name="lastName" maxLength={60} className={inputClasses} placeholder="Apellido" />
                    <HeroUserIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <ErrorMessage name="lastName" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-red-500" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>

                {/* Teléfono */}
                <div>
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Teléfono Móvil</Typography>
                  <div className="relative group">
                    <Field
                      name="phone"
                      maxLength={15}
                      className={inputClasses}
                      placeholder="+506 8888-8888"
                      onKeyDown={handlePhoneKeyDown}
                    />
                    <PhoneIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                  </div>
                  <ErrorMessage name="phone" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-red-500" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>

                {/* Género */}
                <div>
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Género</Typography>
                  <Field
                    as="select"
                    name="gender"
                    className={`${inputClasses} pl-4`}
                  >
                    <option value="">Sin especificar</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </Field>
                </div>

                {/* Correo */}
                <div className="md:col-span-2">
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Correo Electrónico</Typography>
                  <div className="relative group">
                    <Field name="email" type="email" className={inputClasses} placeholder="paciente@ejemplo.com" />
                    <EnvelopeIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                  </div>
                  <ErrorMessage name="email" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-red-500" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                  <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Dirección</Typography>
                  <div className="relative group">
                    <Field name="address" maxLength={120} className={inputClasses} placeholder="Ej. San José, Barrio Escalante..." />
                    <MapPinIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                  </div>
                  <ErrorMessage name="address" render={(msg) => (
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-red-500" className="ml-2 mt-1">{msg}</Typography>
                  )} />
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <Button
                  variant={ButtonVariant.SECONDARY}
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  variant={ButtonVariant.PRIMARY}
                  type="submit"
                  className="flex-1 py-4 rounded-2xl text-base shadow-xl shadow-blue-900/10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
