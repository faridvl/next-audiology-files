import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Listbox, Disclosure } from '@headlessui/react';
import { CheckIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import * as Yup from 'yup';

export function PatientForm() {
    const initialValues = {
        name: '',
        id: '',
        employmentArea: '',
        phone: '',
        email: '',
        dob: '',
        gender: '',
        earInfections: false,
        surgeries: [],
        conditions: [],
        symptoms: {
            allergies: false,
            rhinitis: false,
            vertigo: false,
            dizziness: false,
            headache: false,
            earBlockage: false,
            tinnitus: {
                present: false,
                tone: ''
            }
        },
        exploration: {
            od: '',
            oi: '',
            observations: ''
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        id: Yup.string().required('Required'),
        employmentArea: Yup.string().required('Required'),
        phone: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        dob: Yup.date().required('Required'),
        gender: Yup.string().oneOf(['male', 'female']).required('Required'),
    });

    const handleSubmit = (values: any) => {
        console.log(values);
    };

    return (
        <div className=" bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Registro de Pacientes</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                            <Field name="name" type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium text-gray-700">Cédula</label>
                            <Field name="id" type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            <ErrorMessage name="id" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <label htmlFor="employmentArea" className="block text-sm font-medium text-gray-700">Área de Empleo</label>
                            <Field name="employmentArea" type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            <ErrorMessage name="employmentArea" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <Field name="phone" type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
                            <Field name="email" type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                            <Field name="dob" type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            <ErrorMessage name="dob" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género</label>
                            <Listbox value={values.gender} onChange={(value) => setFieldValue('gender', value)}>
                                {({ open }) => (
                                    <>
                                        <Listbox.Button className="mt-1 relative w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <span className="block truncate">{values.gender ? (values.gender === 'male' ? 'Masculino' : 'Femenino') : 'Seleccionar género'}</span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            <Listbox.Option value="male" className="cursor-default select-none relative py-2 pl-3 pr-9">
                                                {({ selected, active }) => (
                                                    <>
                                                        <span className={selected ? 'font-semibold' : 'font-normal'}>Masculino</span>
                                                        {selected ? (
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                            <Listbox.Option value="female" className="cursor-default select-none relative py-2 pl-3 pr-9">
                                                {({ selected, active }) => (
                                                    <>
                                                        <span className={selected ? 'font-semibold' : 'font-normal'}>Femenino</span>
                                                        {selected ? (
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        </Listbox.Options>
                                    </>
                                )}
                            </Listbox>
                            <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Antecedentes</h3>
                            <div className="mt-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <Field name="earInfections" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="earInfections" className="font-medium text-gray-700">Infecciones de oído</label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-md leading-6 font-medium text-gray-900">Cirugías</h4>
                                {['nariz', 'garganta', 'oido'].map((surgery) => (
                                    <div key={surgery} className="flex items-start mt-2">
                                        <div className="flex items-center h-5">
                                            <Field name="surgeries" type="checkbox" value={surgery} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="surgeries" className="font-medium text-gray-700 capitalize">{surgery}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <h4 className="text-md leading-6 font-medium text-gray-900">Padecimientos</h4>
                                {['diabetes', 'colesterol', 'presion alta'].map((condition) => (
                                    <div key={condition} className="flex items-start mt-2">
                                        <div className="flex items-center h-5">
                                            <Field name="conditions" type="checkbox" value={condition} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="conditions" className="font-medium text-gray-700 capitalize">{condition}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <h4 className="text-md leading-6 font-medium text-gray-900">Síntomas</h4>
                                {['alergias', 'rinitis', 'vertigo', 'mareo', 'cefalea', 'sesacion de oido tapado'].map((symptom) => (
                                    <div key={symptom} className="flex items-start mt-2">
                                        <div className="flex items-center h-5">
                                            <Field name={`symptoms.${symptom}`} type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={`symptoms.${symptom}`} className="font-medium text-gray-700 capitalize">{symptom}</label>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-start mt-2">
                                    <div className="flex items-center h-5">
                                        <Field name="symptoms.tinnitus.present" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="symptoms.tinnitus.present" className="font-medium text-gray-700">Aucifeno</label>
                                    </div>
                                </div>
                                {values.symptoms.tinnitus.present && (
                                    <div className="mt-2">
                                        <label htmlFor="symptoms.tinnitus.tone" className="block text-sm font-medium text-gray-700">Tonalidad</label>
                                        <Field name="symptoms.tinnitus.tone" type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Agregar Paciente
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
