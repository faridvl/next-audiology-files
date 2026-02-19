import React from 'react';
import { X, StickyNote, MessageSquare, CalendarCheck, ExternalLink, Mail, Fingerprint, Loader2 } from 'lucide-react';
import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import { Button, ButtonVariant } from "@/components/common/button/button";
import { useAppointmentDetail } from './use-appointment-detail-panel';
import { AppointmentUI } from '../appointment-list/use-appointment-list-container';
import { useNavigation } from '@/hooks/use-navigation';

interface Props {
    appointment: AppointmentUI;
    onClose: () => void;
}

export const AppointmentDetailPanel: React.FC<Props> = ({ appointment, onClose }) => {
    const {
        historyNotes,
        handleWhatsAppRedirect,
        generateCalendarLink,
        patientInfo,
        isLoading
    } = useAppointmentDetail(appointment);
    const navigation = useNavigation();
    return (
        <div className="w-96 bg-white border border-slate-200 rounded-[32px] shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300 overflow-y-auto max-h-[calc(100vh-140px)]">

            {/* Header: Identidad */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1 w-full">
                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-xl text-slate-800">
                        {appointment.patient}
                    </Typography>

                    {isLoading ? (
                        <div className="space-y-2 mt-2">
                            <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded" />
                            <div className="h-3 w-3/4 bg-slate-100 animate-pulse rounded" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 text-slate-400">
                            <div className="flex items-center gap-2">
                                <MessageSquare size={14} className="text-slate-300" />
                                <Typography variant={TypographyVariant.CAPTION} className="font-medium">
                                    {patientInfo?.phone || appointment.phone || 'Sin teléfono'}
                                </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-slate-300" />
                                <Typography variant={TypographyVariant.CAPTION} className="font-medium">
                                    {patientInfo?.email || 'paciente@email.com'}
                                </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <Fingerprint size={14} className="text-slate-300" />
                                <Typography variant={TypographyVariant.CAPTION} className="font-medium">
                                    {patientInfo?.idNumber || 'N/A'}
                                </Typography>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-300 outline-none">
                    <X size={20} />
                </button>
            </div>

            <hr className="border-slate-50" />

            {/* Nota de la Cita Actual */}
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <StickyNote size={14} />
                    <Typography variant={TypographyVariant.CAPTION} className="font-black uppercase text-[10px]">Nota de esta sesión</Typography>
                </div>
                <Typography variant={TypographyVariant.CAPTION} className="text-slate-600 leading-relaxed italic">
                    "{appointment.notes || 'Sin observaciones para hoy.'}"
                </Typography>
            </div>

            {/* Historial Rápido de Notas */}
            <div className="space-y-3">
                <Typography variant={TypographyVariant.CAPTION} className="font-black uppercase text-[10px] text-slate-400 px-1">Antecedentes Recientes</Typography>

                {isLoading ? (
                    <div className="flex justify-center p-6"><Loader2 className="animate-spin text-slate-200" /></div>
                ) : (
                    <div className="space-y-2">
                        {historyNotes.length > 0 ? historyNotes.map((note) => (
                            <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-bold text-blue-400 mb-1 block">{note.date}</Typography>
                                <Typography variant={TypographyVariant.CAPTION} className="text-slate-500 text-[11px] leading-tight line-clamp-2">{note.text}</Typography>
                            </div>
                        )) : (
                            <div className="text-center py-4 border-2 border-dashed border-slate-50 rounded-xl">
                                <Typography variant={TypographyVariant.CAPTION} className="text-slate-300 italic">No hay citas previas</Typography>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-2 pt-4 mt-auto">
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        className="rounded-xl py-3 flex-1 gap-2 bg-[#25D366] hover:bg-[#20bd5a] border-none shadow-none text-white"
                        onClick={handleWhatsAppRedirect}
                    >
                        <MessageSquare size={16} /> WhatsApp
                    </Button>
                    <Button
                        variant={ButtonVariant.CANCEL}
                        className="rounded-xl py-3 flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none"
                        onClick={generateCalendarLink}
                    >
                        <CalendarCheck size={16} /> Calendario
                    </Button>
                </div>

                <Button
                    variant={ButtonVariant.CANCEL}
                    className="w-full py-3 rounded-xl border-none bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all font-bold uppercase text-[10px] tracking-wider gap-2"
                    onClick={() => navigation.appointments.manage(appointment.id)}
                >
                    <ExternalLink size={14} /> Gestionar Cita
                </Button>
            </div>
        </div>
    );
};