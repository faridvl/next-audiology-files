import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TagIcon, ClockIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAppointmentTypeForm } from './use-appointment-type-form';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';

const COLORS = [
  { name: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-500' },
  { name: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
  { name: 'indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-500' },
  { name: 'amber', bg: 'bg-amber-500', ring: 'ring-amber-500' },
  { name: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-500' },
  { name: 'teal', bg: 'bg-teal-500', ring: 'ring-teal-500' },
];

export const AppointmentTypeForm: React.FC = () => {
  const { initialValues, validationSchema, handleSubmit, isLoading } = useAppointmentTypeForm();
  const navigation = useNavigation();

  const inputClasses =
    'w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-[1.5rem] outline-none transition-all font-medium text-slate-700 text-sm shadow-sm';
  const labelClasses = 'ml-2 mb-2 block text-slate-400 font-bold tracking-widest text-[10px] uppercase';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-5 mb-10">
          <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-200">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div>
            <Typography variant={TypographyVariant.SUBTITLE} className="text-xl">
              Nuevo Tipo de Cita
            </Typography>
            <Typography variant={TypographyVariant.HELPER}>
              Define el nombre, duración, color y especialidad del tipo de cita.
            </Typography>
          </div>
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue }) => (
            <Form className="flex flex-col gap-8">
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Nombre del Servicio</label>
                  <div className="relative group">
                    <Field name="name" className={inputClasses} placeholder="Ej. Consulta de Valoración" />
                    <TagIcon className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <ErrorMessage
                    name="name"
                    render={(msg) => <p className="text-red-500 text-[10px] ml-4 mt-1 font-bold italic">{msg}</p>}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Duración Estimada</label>
                  <div className="relative group">
                    <Field name="duration" type="number" className={inputClasses} placeholder="Minutos" />
                    <ClockIcon className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                    <span className="absolute right-4 top-4 text-xs font-bold text-slate-400">MIN</span>
                  </div>
                  <ErrorMessage
                    name="duration"
                    render={(msg) => <p className="text-red-500 text-[10px] ml-4 mt-1 font-bold italic">{msg}</p>}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Color Identificador</label>
                  <div className="flex gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setFieldValue('color', color.name)}
                        className={`w-10 h-10 rounded-xl ${color.bg} transition-all duration-300 border-4 ${
                          values.color === color.name
                            ? `border-white scale-110 shadow-lg ring-2 ${color.ring}`
                            : 'border-transparent opacity-40 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  variant={ButtonVariant.PRIMARY}
                  type="submit"
                  className="w-full py-5 rounded-[1.5rem] shadow-xl shadow-blue-500/20 text-base font-bold gap-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Guardando...' : 'Guardar Servicio'}
                  {!isLoading && <CheckIcon className="h-5 w-5 stroke-[3px]" />}
                </Button>

                <Button
                  variant={ButtonVariant.CANCEL}
                  onClick={navigation.appointmentType.list}
                  className="w-full py-4 rounded-[1.5rem] border-none text-slate-400 hover:text-red-500 transition-colors font-semibold"
                >
                  Cancelar y Volver
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
