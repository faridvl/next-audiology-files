import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Listbox, Transition } from '@headlessui/react';
import {
    CheckIcon, ChevronUpDownIcon, UserIcon, PhoneIcon,
    EnvelopeIcon, CalendarIcon, IdentificationIcon,
    BriefcaseIcon, GlobeAltIcon
} from "@heroicons/react/24/outline";

import { usePatientForm } from './use-patient-form';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';

export function PatientForm({ onShowSuccess }: { onShowSuccess: () => void }) {
    const { initialValues, validationSchema, handleSubmit, isLoading } = usePatientForm(onShowSuccess);

    const inputClasses = "w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-semibold text-slate-700 text-sm";
    const labelClasses = "ml-1 mb-1 block";

    return (
        <div className="max-w-3xl mx-auto my-8 p-4">
            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3rem] overflow-hidden border border-slate-100">

                {/* Cabecera con Typography */}
                <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#1E3A8A] p-3 rounded-2xl shadow-lg shadow-blue-900/20">
                            <UserIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <Typography variant={TypographyVariant.SUBTITLE} textColor="text-slate-800">
                                Registro de Paciente
                            </Typography>
                            <Typography variant={TypographyVariant.HELPER}>
                                Ingrese los datos oficiales para el expediente clínico.
                            </Typography>
                        </div>
                    </div>
                </div>

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }) => (
                        <Form className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                                {/* Nombre Completo */}
                                <div className="md:col-span-2">
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Nombre Completo</Typography>
                                    <div className="relative group">
                                        <Field name="name" className={inputClasses} placeholder="Ej. Andrés Iniesta Luján" />
                                        <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <ErrorMessage name="name" render={msg => <Typography variant={TypographyVariant.CAPTION} textColor="text-red-500" className="ml-2 mt-1">{msg}</Typography>} />
                                </div>

                                {/* Cédula / ID */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Cédula / ID</Typography>
                                    <div className="relative group">
                                        <Field name="id" className={inputClasses} placeholder="0-0000-0000" />
                                        <IdentificationIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                                    </div>
                                    <ErrorMessage name="id" render={msg => <Typography variant={TypographyVariant.CAPTION} textColor="text-red-500" className="ml-2 mt-1">{msg}</Typography>} />
                                </div>

                                {/* Fecha de Nacimiento */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>F. de Nacimiento</Typography>
                                    <div className="relative group">
                                        <Field name="dob" type="date" className={inputClasses} />
                                        <CalendarIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                                    </div>
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Teléfono Móvil</Typography>
                                    <div className="relative group">
                                        <Field name="phone" className={inputClasses} placeholder="+506 0000 0000" />
                                        <PhoneIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                                    </div>
                                </div>

                                {/* Nacionalidad */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Nacionalidad</Typography>
                                    <div className="relative group">
                                        <Field name="nationality" className={inputClasses} placeholder="Costa Rica" />
                                        <GlobeAltIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                                    </div>
                                </div>

                                {/* Área de Empleo */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Área de Empleo</Typography>
                                    <div className="relative group">
                                        <Field name="employmentArea" className={inputClasses} placeholder="Ej. Gerencia" />
                                        <BriefcaseIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                                    </div>
                                </div>

                                {/* Género con Listbox */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Género</Typography>
                                    <Listbox value={values.gender} onChange={(val) => setFieldValue('gender', val)}>
                                        <div className="relative">
                                            <Listbox.Button className={`${inputClasses} flex justify-between items-center text-left pl-4`}>
                                                <span>{values.gender ? (values.gender === 'male' ? 'Masculino' : 'Femenino') : 'Seleccionar...'}</span>
                                                <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
                                            </Listbox.Button>
                                            <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                <Listbox.Options className="absolute z-20 mt-2 w-full bg-white border border-slate-100 shadow-2xl rounded-2xl py-2 focus:outline-none">
                                                    <Listbox.Option value="male" className={({ active }) => `cursor-pointer py-3 px-5 text-sm ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}>Masculino</Listbox.Option>
                                                    <Listbox.Option value="female" className={({ active }) => `cursor-pointer py-3 px-5 text-sm ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}>Femenino</Listbox.Option>
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                </div>

                                {/* Correo Full Width */}
                                <div className="md:col-span-2">
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Correo Electrónico</Typography>
                                    <div className="relative group">
                                        <Field name="email" type="email" className={inputClasses} placeholder="paciente@ejemplo.com" />
                                        <EnvelopeIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12">
                                <Button
                                    variant={ButtonVariant.PRIMARY}
                                    type="submit"
                                    className="w-full py-4 rounded-2xl text-base shadow-xl shadow-blue-900/10"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Procesando...' : 'Finalizar Registro del Paciente'}
                                    {!isLoading && <CheckIcon className="h-5 w-5 stroke-[3px]" />}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}