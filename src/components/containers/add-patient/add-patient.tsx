import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Listbox, Transition } from '@headlessui/react';
import {
    CheckIcon,
    ChevronUpDownIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon,
    IdentificationIcon,
    BriefcaseIcon
} from "@heroicons/react/24/outline";
// Importamos el hook que creamos antes
import { usePatientForm } from './use-patient-form';

type PatientFormProps = {
    onShowSuccess: () => void;
};

export function PatientForm({ onShowSuccess }: PatientFormProps) {
    // Extraemos todo del hook, pasándole el callback de éxito
    const { initialValues, validationSchema, handleSubmit } = usePatientForm(onShowSuccess);

    return (
        <div className="max-w-2xl mx-auto my-8">
            <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden border border-slate-100">

                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
                    <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        Registro de Paciente
                    </h1>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                                {/* Nombre Completo */}
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nombre Completo</label>
                                    <div className="relative">
                                        <Field name="name" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-semibold text-slate-700" placeholder="Ej. Andrés Iniesta" />
                                        <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    </div>
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-[10px] font-bold mt-1 ml-2" />
                                </div>

                                {/* Cédula / ID */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Cédula / ID</label>
                                    <div className="relative">
                                        <Field name="id" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-semibold text-slate-700" placeholder="0-0000-0000" />
                                        <IdentificationIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    </div>
                                </div>

                                {/* Fecha de Nacimiento */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">F. de Nacimiento</label>
                                    <div className="relative">
                                        <Field name="dob" type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-semibold text-slate-700" />
                                        <CalendarIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    </div>
                                </div>

                                {/* Teléfono */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Teléfono Móvil</label>
                                    <div className="relative">
                                        <Field name="phone" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-semibold text-slate-700" placeholder="6000 0000" />
                                        <PhoneIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    </div>
                                </div>

                                {/* Área de Empleo */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Área de Empleo</label>
                                    <div className="relative">
                                        <Field name="employmentArea" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-semibold text-slate-700" placeholder="Ej. Administración" />
                                        <BriefcaseIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    </div>
                                </div>

                                {/* Correo */}
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                    <div className="relative">
                                        <Field name="email" type="email" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-semibold text-slate-700" placeholder="paciente@correo.com" />
                                        <EnvelopeIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    </div>
                                </div>

                                {/* Género */}
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Género</label>
                                    <Listbox value={values.gender} onChange={(val) => setFieldValue('gender', val)}>
                                        <div className="relative">
                                            <Listbox.Button className="w-full text-left pl-4 pr-10 py-3 bg-slate-50 rounded-2xl font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/5 outline-none flex justify-between items-center transition-all">
                                                <span>{values.gender ? (values.gender === 'male' ? 'Masculino' : 'Femenino') : 'Seleccionar género...'}</span>
                                                <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
                                            </Listbox.Button>
                                            <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                <Listbox.Options className="absolute z-10 mt-2 w-full bg-white border border-slate-100 shadow-2xl rounded-2xl py-2 overflow-hidden focus:outline-none sm:text-sm">
                                                    <Listbox.Option value="male" className={({ active }) => `cursor-pointer select-none py-3 px-5 ${active ? 'bg-blue-600 text-white' : 'text-slate-900'}`}>Masculino</Listbox.Option>
                                                    <Listbox.Option value="female" className={({ active }) => `cursor-pointer select-none py-3 px-5 ${active ? 'bg-blue-600 text-white' : 'text-slate-900'}`}>Femenino</Listbox.Option>
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                </div>

                            </div>

                            <div className="mt-10">
                                <button type="submit" className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                                    Guardar Registro
                                    <CheckIcon className="h-5 w-5 stroke-[3px]" />
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}