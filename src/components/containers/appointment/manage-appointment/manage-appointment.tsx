import React from 'react';
import { PhoneOff, CheckCircle2, Calendar, Clock, Save, ChevronLeft } from 'lucide-react';
import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import { Button, ButtonVariant } from "@/components/common/button/button";
import { useManageAppointment } from './use-manage-appointment';

export const ManageAppointmentContainer: React.FC<{ id: string }> = ({ id }) => {
    const { formData, setFormData, loading, handleNoAnswer, handleConfirm, navigation } = useManageAppointment(id);

    return (
        <div className="max-w-3xl mx-auto py-6">
            <button onClick={navigation.common.back} className="flex items-center gap-2 text-slate-400 mb-8 group">
                <ChevronLeft size={20} />
                <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Volver</Typography>
            </button>

            <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm space-y-10">

                {/* ESTADO ACTUAL - ALERTA */}
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-center justify-between">
                    <div>
                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-amber-700">Estado: Tentativa</Typography>
                        <Typography variant={TypographyVariant.CAPTION} className="text-amber-600">Pendiente de confirmar llamada con el paciente.</Typography>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant={ButtonVariant.CANCEL}
                            className="bg-white text-red-500 border-red-100 gap-2"
                            onClick={handleNoAnswer}
                        >
                            <PhoneOff size={16} /> No contestó
                        </Button>
                        <Button
                            variant={ButtonVariant.PRIMARY}
                            className="bg-green-600 hover:bg-green-700 gap-2"
                            onClick={handleConfirm}
                        >
                            <CheckCircle2 size={16} /> Confirmar Cita
                        </Button>
                    </div>
                </div>

                {/* FORMULARIO DE EDICIÓN */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Typography variant={TypographyVariant.OVERLINE} className="font-bold">Ajustar Fecha</Typography>
                        <input
                            type="date"
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Typography variant={TypographyVariant.OVERLINE} className="font-bold">Ajustar Hora</Typography>
                        <input
                            type="time"
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Typography variant={TypographyVariant.OVERLINE} className="font-bold">Bitácora de Seguimiento</Typography>
                    <textarea
                        rows={4}
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none"
                        placeholder="Ej: Se llamó 3 veces, el paciente indica que confirmará en la tarde..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
};