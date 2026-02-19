import React from 'react';
import {
    ChevronLeft, UserPlus, Calendar as CalendarIcon,
    Clock, Plus, Stethoscope, Save
} from 'lucide-react';

import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import { Button, ButtonVariant } from "@/components/common/button/button";
import { useCreateAppointment } from './use-add-appointment';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';

export const CreateAppointmentContainer: React.FC = () => {
    const {
        formData, setFormData, loading, handleSubmit,
        navigation, patients, availableServices
    } = useCreateAppointment();

    return (
        <div className="max-w-3xl mx-auto py-6">
            {/* Cabecera / Volver */}
            <button
                type="button"
                onClick={navigation.common.back}
                className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Volver a la Agenda</Typography>
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm space-y-10 transition-all ${loading ? 'opacity-60 pointer-events-none scale-[0.99]' : ''}`}>

                    {/* SECCIÓN: PACIENTE */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><UserPlus size={20} /></div>
                            <Typography variant={TypographyVariant.ACCENT}>Información del Paciente</Typography>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <select
                                required
                                disabled={loading}
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                                value={formData.patientUuid}
                                onChange={(e) => setFormData({ ...formData, patientUuid: e.target.value })}
                            >
                                <option value="">Seleccionar paciente del listado...</option>
                                {patients.map(p => (
                                    <option key={p.uuid} value={p.uuid}>
                                        {p.firstName} {p.lastName}
                                    </option>
                                ))}
                            </select>

                            <div
                                onClick={() => !loading && navigation.patients.create()}
                                className="mt-2 flex items-center gap-2 text-blue-600 cursor-pointer hover:underline w-fit"
                            >
                                <Plus size={14} />
                                <Typography variant={TypographyVariant.CAPTION} className="font-bold">Nuevo Paciente</Typography>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN: ESPECIALIDAD Y SERVICIO */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="bg-purple-50 p-2 rounded-xl text-purple-600"><Stethoscope size={20} /></div>
                            <Typography variant={TypographyVariant.ACCENT}>Especialidad y Procedimiento</Typography>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Typography variant={TypographyVariant.OVERLINE} className="ml-1 mb-2 block text-slate-400 font-bold">Área Médica</Typography>
                                <select
                                    disabled={loading}
                                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-blue-600 outline-none focus:border-blue-500 transition-all cursor-pointer"
                                    value={formData.speciality}
                                    onChange={(e) => setFormData({ ...formData, speciality: e.target.value as MedicalSpeciality, typeId: '' })}
                                >
                                    <option value={MedicalSpeciality.GENERAL}>General</option>
                                    <option value={MedicalSpeciality.DENTAL}>Dental</option>
                                    <option value={MedicalSpeciality.AUDIOLOGY}>Audiología</option>
                                </select>
                            </div>

                            <div>
                                <Typography variant={TypographyVariant.OVERLINE} className="ml-1 mb-2 block text-slate-400 font-bold">Servicio</Typography>
                                <select
                                    required
                                    disabled={loading}
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                                    value={formData.typeId}
                                    onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
                                >
                                    <option value="">¿Qué realizaremos hoy?</option>
                                    {availableServices.map(s => (
                                        <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* FECHA Y HORA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400 font-bold">Fecha</Typography>
                            <div className="relative">
                                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    required
                                    type="date"
                                    disabled={loading}
                                    value={formData.date}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400 font-bold">Hora de Inicio</Typography>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    required
                                    type="time"
                                    disabled={loading}
                                    value={formData.startTime}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* NOTAS */}
                    <div className="space-y-2">
                        <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400 font-bold">Notas Adicionales</Typography>
                        <textarea
                            rows={3}
                            disabled={loading}
                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/10"
                            placeholder="Escribe aquí cualquier observación relevante..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex justify-end gap-4 pt-4 pb-10">
                    <Button
                        type="button"
                        variant={ButtonVariant.CANCEL}
                        text="Cancelar"
                        onClick={() => !loading && navigation.appointments.list()}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        variant={ButtonVariant.PRIMARY}
                        className="rounded-2xl px-10 py-4 h-auto shadow-lg shadow-blue-500/20"
                        disabled={loading}
                    >
                        <div className="flex items-center gap-2">
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-white">Procesando...</Typography>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-white">Confirmar Cita</Typography>
                                </>
                            )}
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
};