import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
    TagIcon,
    ClockIcon,
    CurrencyDollarIcon,
    CheckIcon,
    DocumentTextIcon,
    BeakerIcon,
    SparklesIcon,
    ListBulletIcon,
    PresentationChartLineIcon,
    PencilSquareIcon
} from "@heroicons/react/24/outline";

import { useAppointmentTypeForm, Speciality, RecordTemplate } from './use-appointment-type-form';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';

const COLORS = [
    { name: 'Blue', hex: '#3B82F6', ring: 'ring-blue-500' },
    { name: 'Emerald', hex: '#10B981', ring: 'ring-emerald-500' },
    { name: 'Indigo', hex: '#6366F1', ring: 'ring-indigo-500' },
    { name: 'Amber', hex: '#F59E0B', ring: 'ring-amber-500' },
    { name: 'Rose', hex: '#F43F5E', ring: 'ring-rose-500' },
    { name: 'Slate', hex: '#64748B', ring: 'ring-slate-500' },
];

export const AppointmentTypeForm: React.FC = () => {
    const { initialValues, validationSchema, handleSubmit, isLoading } = useAppointmentTypeForm(() => { });

    const inputClasses = "w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-[1.5rem] outline-none transition-all font-medium text-slate-700 text-sm shadow-sm";
    const labelClasses = "ml-2 mb-2 block text-slate-400 font-bold tracking-widest text-[10px] uppercase";

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">

                {/* Cabecera compacta */}
                <div className="flex items-center gap-5 mb-10">
                    <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-200">
                        <SparklesIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <Typography variant={TypographyVariant.SUBTITLE} className="text-xl">Nuevo Servicio</Typography>
                        <Typography variant={TypographyVariant.HELPER}>Define las herramientas de registro clínico.</Typography>
                    </div>
                </div>

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }) => (
                        <Form className="flex flex-col gap-8">

                            {/* Sección 1: Identificación */}
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClasses}>Nombre del Servicio</label>
                                    <div className="relative group">
                                        <Field name="name" className={inputClasses} placeholder="Ej. Consulta de Valoración" />
                                        <TagIcon className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <ErrorMessage name="name" render={msg => <p className="text-red-500 text-[10px] ml-4 mt-1 font-bold italic">{msg}</p>} />
                                </div>

                                <div>
                                    <label className={labelClasses}>Especialidad Asignada</label>
                                    <div className="relative group">
                                        <Field as="select" name="speciality" className="w-full pl-11 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-semibold text-slate-700 text-sm appearance-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all">
                                            <option value="">Selecciona...</option>
                                            <option value={Speciality.GENERAL}>Medicina General</option>
                                            <option value={Speciality.AUDIOLOGY}>Audiología</option>
                                            <option value={Speciality.DENTAL}>Odontología</option>
                                        </Field>
                                        <BeakerIcon className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                                        <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Módulos de Pantalla (Template) */}
                            <div className="space-y-4">
                                <label className={labelClasses}>Herramienta de Registro</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: RecordTemplate.STANDARD, label: 'Nota Clínica', icon: PencilSquareIcon, desc: 'Texto libre' },
                                        { id: RecordTemplate.GRAPHIC, label: 'Gráfico/Panel', icon: PresentationChartLineIcon, desc: 'Esquemas visuales' },
                                        { id: RecordTemplate.PROCEDURE, label: 'Protocolo', icon: ListBulletIcon, desc: 'Checklists' },
                                    ].map((module) => (
                                        <button
                                            key={module.id}
                                            type="button"
                                            onClick={() => setFieldValue('recordTemplate', module.id)}
                                            className={`flex flex-col items-center p-4 rounded-[1.5rem] border-2 transition-all ${values.recordTemplate === module.id
                                                ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                                                : 'border-slate-100 bg-white hover:border-slate-200'
                                                }`}
                                        >
                                            <module.icon className={`h-6 w-6 mb-2 ${values.recordTemplate === module.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${values.recordTemplate === module.id ? 'text-blue-700' : 'text-slate-500'}`}>
                                                {module.label}
                                            </span>
                                            <span className="text-[9px] text-slate-400 mt-1 text-center leading-tight">{module.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sección 2: Operativa */}
                            <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClasses}>Duración Estimada</label>
                                        <div className="relative group">
                                            <Field name="duration" type="number" className={inputClasses} placeholder="Minutos" />
                                            <ClockIcon className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                                            <span className="absolute right-4 top-4 text-xs font-bold text-slate-400">MIN</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClasses}>Precio</label>
                                        <div className="relative group">
                                            <Field name="price" className={inputClasses} placeholder="0.00" />
                                            <CurrencyDollarIcon className="absolute left-4 top-4 h-5 w-5 text-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>Color Identificador</label>
                                    <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                        {COLORS.map((color) => (
                                            <button
                                                key={color.hex}
                                                type="button"
                                                onClick={() => setFieldValue('color', color.hex)}
                                                className={`w-10 h-10 rounded-xl transition-all duration-300 border-4 ${values.color === color.hex
                                                    ? `border-white scale-110 shadow-lg ${color.ring}`
                                                    : 'border-transparent opacity-40 hover:opacity-100'
                                                    }`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sección 3: Descripción */}
                            <div>
                                <label className={labelClasses}>Notas Internas</label>
                                <div className="relative group">
                                    <Field as="textarea" name="description" rows={2} className={`${inputClasses} pl-11 pt-4 resize-none`} placeholder="Instrucciones del servicio..." />
                                    <DocumentTextIcon className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                                </div>
                            </div>

                            {/* Footer de Acciones */}
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
                                    onClick={() => { }}
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