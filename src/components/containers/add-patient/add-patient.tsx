import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Listbox, Transition } from '@headlessui/react';
import {
    CheckIcon, ChevronUpDownIcon, UserIcon, PhoneIcon,
    EnvelopeIcon, CalendarIcon, IdentificationIcon, MapPinIcon,
} from "@heroicons/react/24/outline";

import { usePatientForm } from './use-patient-form';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';

export function PatientForm({ onShowSuccess }: { onShowSuccess: () => void }) {
    const { initialValues, validationSchema, handleSubmit, isLoading, today } = usePatientForm(onShowSuccess);

    const inputClasses = "w-full pl-11 pr-4 py-3 bg-neutral-50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-app-md outline-none transition-all font-semibold text-neutral-700 text-sm";
    const labelClasses = "ml-1 mb-1 block";

    const handlePhoneKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '+', ' ', '-'];
        if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
            event.preventDefault();
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-8 p-4">
            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-app-2xl overflow-hidden border border-neutral-100">

                <div className="bg-neutral-50/50 px-10 py-8 border-b border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary p-3 rounded-app-md shadow-lg shadow-primary-dark/20">
                            <UserIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <Typography variant={TypographyVariant.SUBTITLE} textColor="text-neutral-800">
                                Registro de Paciente
                            </Typography>
                            <Typography variant={TypographyVariant.HELPER}>
                                Ingrese los datos oficiales para el expediente clínico.
                            </Typography>
                        </div>
                    </div>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    validateOnBlur
                    validateOnChange={false}
                >
                    {({ values, setFieldValue, setFieldTouched }) => (
                        <Form className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                                {/* Nombre */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Nombre</Typography>
                                    <div className="relative group">
                                        <Field
                                            name="firstName"
                                            maxLength={60}
                                            className={inputClasses}
                                            placeholder="Ej. Andrés"
                                        />
                                        <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <ErrorMessage name="firstName" render={msg => <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>} />
                                </div>

                                {/* Apellido */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Apellido</Typography>
                                    <div className="relative group">
                                        <Field
                                            name="lastName"
                                            maxLength={60}
                                            className={inputClasses}
                                            placeholder="Ej. Iniesta Luján"
                                        />
                                        <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <ErrorMessage name="lastName" render={msg => <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>} />
                                </div>

                                {/* Cédula / ID */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Cédula / ID</Typography>
                                    <div className="relative group">
                                        <Field
                                            name="documentId"
                                            maxLength={20}
                                            className={inputClasses}
                                            placeholder="0-0000-0000"
                                        />
                                        <IdentificationIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary" />
                                    </div>
                                    <ErrorMessage name="documentId" render={msg => <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>} />
                                </div>

                                {/* Fecha de Nacimiento */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>F. de Nacimiento</Typography>
                                    <div className="relative group">
                                        <Field
                                            name="birthDate"
                                            type="date"
                                            max={today}
                                            className={inputClasses}
                                        />
                                        <CalendarIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary" />
                                    </div>
                                    <ErrorMessage name="birthDate" render={msg => <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>} />
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
                                        <PhoneIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary" />
                                    </div>
                                    <ErrorMessage name="phone" render={msg => <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>} />
                                </div>

                                {/* Género con Listbox */}
                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Género</Typography>
                                    <Listbox
                                        value={values.gender}
                                        onChange={(value) => {
                                            setFieldValue('gender', value);
                                            setFieldTouched('gender', true);
                                        }}
                                    >
                                        <div className="relative">
                                            <Listbox.Button className={`${inputClasses} flex justify-between items-center text-left pl-4`}>
                                                <span>{values.gender ? (values.gender === 'male' ? 'Masculino' : 'Femenino') : 'Seleccionar...'}</span>
                                                <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" />
                                            </Listbox.Button>
                                            <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                <Listbox.Options className="absolute z-20 mt-2 w-full bg-white border border-neutral-100 shadow-2xl rounded-app-md py-2 focus:outline-none">
                                                    <Listbox.Option value="male" className={({ active }) => `cursor-pointer py-3 px-5 text-sm ${active ? 'bg-primary-soft text-primary' : 'text-neutral-700'}`}>Masculino</Listbox.Option>
                                                    <Listbox.Option value="female" className={({ active }) => `cursor-pointer py-3 px-5 text-sm ${active ? 'bg-primary-soft text-primary' : 'text-neutral-700'}`}>Femenino</Listbox.Option>
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                    <ErrorMessage name="gender" render={msg => <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>} />
                                </div>

                                {/* Correo */}
                                <div className="md:col-span-2">
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Correo Electrónico</Typography>
                                    <div className="relative group">
                                        <Field
                                            name="email"
                                            type="email"
                                            className={inputClasses}
                                            placeholder="paciente@ejemplo.com"
                                        />
                                        <EnvelopeIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary" />
                                    </div>
                                    <ErrorMessage name="email" render={msg => <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>} />
                                </div>

                                {/* Dirección */}
                                <div className="md:col-span-2">
                                    <Typography variant={TypographyVariant.OVERLINE} className={labelClasses}>Dirección</Typography>
                                    <div className="relative group">
                                        <Field
                                            name="address"
                                            maxLength={120}
                                            className={inputClasses}
                                            placeholder="Ej. San José, Barrio Escalante, 200m norte del parque"
                                        />
                                        <MapPinIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-primary" />
                                    </div>
                                    <ErrorMessage name="address" render={msg => <Typography variant={TypographyVariant.CAPTION} textColor="text-danger" className="ml-2 mt-1">{msg}</Typography>} />
                                </div>
                            </div>

                            <div className="mt-12">
                                <Button
                                    variant={ButtonVariant.PRIMARY}
                                    type="submit"
                                    className="w-full py-4 rounded-app-md text-base shadow-xl shadow-primary-dark/10"
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
