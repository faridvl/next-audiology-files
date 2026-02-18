import React, { useState } from 'react';
import Head from 'next/head';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button'; // Ajusta la ruta según tu estructura
import { useNavigation } from '@/hooks/use-navigation';
import {
    ChevronLeft,
    Save,
    UserPlus,
    Calendar as CalendarIcon,
    Clock,
    ClipboardList,
    AlertCircle,
    Plus
} from 'lucide-react';

const CreateAppointment: React.FC = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        patientId: '',
        typeId: '',
        date: '',
        startTime: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulación de guardado con tu lógica de navegación
        console.log("Guardando cita:", formData);

        setTimeout(() => {
            setLoading(false);
            navigation.appointments.list();
        }, 1500);
    };

    return (
        <>
            <Head>
                <title>Nueva Cita </title>
            </Head>
            <DashboardLayout
                title="Agendar Nueva Cita"
                contentStyle={BoxedLayoutStyle.FULL}
            >
                <div className="max-w-2xl mx-auto">
                    {/* Botón Volver con Hook */}
                    <button
                        onClick={navigation.common.back}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Volver a la Agenda</Typography>
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">

                            {/* Sección: Paciente */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <UserPlus size={18} className="text-blue-500" />
                                    <Typography variant={TypographyVariant.ACCENT}>Información del Paciente</Typography>
                                </div>

                                <div>
                                    <Typography variant={TypographyVariant.OVERLINE} className="mb-2 block">Seleccionar Paciente</Typography>
                                    <select
                                        required
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                                        value={formData.patientId}
                                        onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                    >
                                        <option value="">Buscar o seleccionar paciente...</option>
                                        <option value="1">Farid Villacis</option>
                                        <option value="2">Maria Gomez</option>
                                        <option value="3">Juan Perez</option>
                                    </select>

                                    {/* Link a Crear Paciente usando tu Navigation Hook */}
                                    <div
                                        onClick={navigation.patients.create}
                                        className="mt-2 flex items-center gap-1 text-blue-600 cursor-pointer hover:underline group"
                                    >
                                        <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                                        <Typography variant={TypographyVariant.CAPTION} className="text-blue-600 font-bold">
                                            O crear nuevo paciente
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            {/* Sección: Detalles */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <ClipboardList size={18} className="text-blue-500" />
                                    <Typography variant={TypographyVariant.ACCENT}>Detalles del Servicio</Typography>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Typography variant={TypographyVariant.OVERLINE} className="mb-2 block">Tipo de Procedimiento</Typography>
                                        <select
                                            required
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            value={formData.typeId}
                                            onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
                                        >
                                            <option value="">Seleccione el servicio...</option>
                                            <option value="1">Evaluación Inicial</option>
                                            <option value="2">Audiometría Tonal</option>
                                            <option value="3">Limpieza de Oído</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Typography variant={TypographyVariant.OVERLINE} className="mb-2 block">Fecha</Typography>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                required
                                                type="date"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none"
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Typography variant={TypographyVariant.OVERLINE} className="mb-2 block">Hora de Inicio</Typography>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                required
                                                type="time"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none"
                                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Typography variant={TypographyVariant.OVERLINE} className="mb-2 block">Notas u Observaciones</Typography>
                                <textarea
                                    rows={4}
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/10"
                                    placeholder="Notas adicionales..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <AlertCircle className="text-blue-500 shrink-0" size={20} />
                                <Typography variant={TypographyVariant.HELPER} className="text-blue-700">
                                    Se enviará una confirmación automática al paciente una vez agendada la cita.
                                </Typography>
                            </div>
                        </div>

                        {/* Botones usando tu componente Button */}
                        <div className="flex justify-end gap-4 pb-12">
                            <Button
                                variant={ButtonVariant.CANCEL}
                                text="Cancelar"
                                onClick={navigation.appointments.list}
                            />

                            <Button
                                variant={ButtonVariant.PRIMARY}
                                onClick={() => { }} // El submit lo maneja el form
                                className=""
                            >
                                {loading ? (
                                    'Agendando...'
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-white">
                                            Confirmar Cita
                                        </Typography>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
};

export default CreateAppointment;