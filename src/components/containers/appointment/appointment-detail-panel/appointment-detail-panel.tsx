import React from 'react';
import {
    X, StickyNote, MessageSquare, CalendarCheck, ExternalLink,
    Mail, Fingerprint, Loader2, Apple, PhoneOff, CheckCircle2, Phone
} from 'lucide-react';
import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import { Button, ButtonVariant } from "@/components/common/button/button";
import { useAppointmentDetail } from './use-appointment-detail-panel';
import { AppointmentUI } from '@/types/appointments/appointment-ui.types';
import { AppointmentStatus } from '@/types/appointments/appointment';
import { useNavigation } from '@/hooks/use-navigation';

interface Props {
    appointment: AppointmentUI;
    onClose: () => void;
    onStatusChange?: () => void;
}

const DEFAULT_TYPE_COLOR = '#6366F1';

export const AppointmentDetailPanel: React.FC<Props> = ({ appointment, onClose, onStatusChange }) => {
    const {
        historyNotes,
        handleWhatsAppRedirect,
        handleGoogleCalendar,
        handleAppleCalendarDownload,
        handleQuickConfirm,
        handleQuickNoAnswer,
        patientInfo,
        isLoading,
        isActionPending,
        localStatus,
    } = useAppointmentDetail(appointment, onStatusChange);
    const navigation = useNavigation();

    const typeColor = appointment.typeColor || DEFAULT_TYPE_COLOR;
    const isConfirmed = localStatus === AppointmentStatus.CONFIRMED;
    const isCompleted = localStatus === AppointmentStatus.COMPLETED;
    const canTakeAction = !isConfirmed && !isCompleted;

    return (
        <div className="w-96 bg-white border border-slate-200 rounded-[32px] shadow-2xl flex flex-col gap-0 animate-in slide-in-from-right duration-300 overflow-hidden max-h-[calc(100vh-140px)]">

            {/* banda de color del tipo de cita */}
            <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: typeColor }} />

            <div className="flex flex-col gap-5 p-6 overflow-y-auto flex-1">

                {/* Header: Identidad */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1 w-full">
                        {/* nombre + tipo */}
                        <div className="flex items-start gap-2">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 mt-0.5"
                                style={{ backgroundColor: typeColor }}
                            >
                                {appointment.patient.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-lg text-slate-800 leading-tight">
                                    {appointment.patient}
                                </Typography>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: typeColor }} />
                                    <Typography variant={TypographyVariant.CAPTION} className="text-[10px] font-semibold text-slate-400 truncate">
                                        {appointment.type}
                                    </Typography>
                                    {appointment.typeSpeciality && (
                                        <span className="text-slate-200 text-[10px]">·</span>
                                    )}
                                    {appointment.typeSpeciality && (
                                        <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-300 truncate">
                                            {appointment.typeSpeciality}
                                        </Typography>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="space-y-2 mt-3 ml-12">
                                <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded" />
                                <div className="h-3 w-3/4 bg-slate-100 animate-pulse rounded" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1 text-slate-400 mt-2 ml-12">
                                <div className="flex items-center gap-2">
                                    <Phone size={12} className="text-slate-300 shrink-0" />
                                    <Typography variant={TypographyVariant.CAPTION} className="font-medium text-xs">
                                        {patientInfo?.phone || appointment.phone || 'Sin teléfono'}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={12} className="text-slate-300 shrink-0" />
                                    <Typography variant={TypographyVariant.CAPTION} className="font-medium text-xs truncate">
                                        {patientInfo?.email || 'Sin email'}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Fingerprint size={12} className="text-slate-300 shrink-0" />
                                    <Typography variant={TypographyVariant.CAPTION} className="font-medium text-xs">
                                        {patientInfo?.idNumber || 'N/A'}
                                    </Typography>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-300 outline-none shrink-0"
                        type="button"
                    >
                        <X size={18} />
                    </button>
                </div>

                <hr className="border-slate-50" />

                {/* Acciones rápidas de recepcionista */}
                {canTakeAction && (
                    <div className="space-y-2">
                        <Typography variant={TypographyVariant.CAPTION} className="font-black uppercase text-[9px] text-slate-400 px-1 tracking-widest">
                            Acción rápida
                        </Typography>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handleQuickConfirm}
                                disabled={isActionPending}
                                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                                {isActionPending
                                    ? <Loader2 size={13} className="animate-spin" />
                                    : <CheckCircle2 size={13} />
                                }
                                Confirmar
                            </button>
                            <button
                                onClick={handleQuickNoAnswer}
                                disabled={isActionPending}
                                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                {isActionPending
                                    ? <Loader2 size={13} className="animate-spin" />
                                    : <PhoneOff size={13} />
                                }
                                No contestó
                            </button>
                        </div>
                    </div>
                )}

                {isConfirmed && (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl">
                        <CheckCircle2 size={14} />
                        <Typography variant={TypographyVariant.CAPTION} className="text-xs font-bold">
                            Cita confirmada
                        </Typography>
                    </div>
                )}

                {/* Nota de la cita */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                        <StickyNote size={13} />
                        <Typography variant={TypographyVariant.CAPTION} className="font-black uppercase text-[9px] tracking-widest">
                            Nota de esta sesión
                        </Typography>
                    </div>
                    <Typography variant={TypographyVariant.CAPTION} className="text-slate-600 leading-relaxed italic text-xs">
                        &quot;{appointment.notes || 'Sin observaciones para hoy.'}&quot;
                    </Typography>
                </div>

                {/* Historial rápido */}
                <div className="space-y-2">
                    <Typography variant={TypographyVariant.CAPTION} className="font-black uppercase text-[9px] text-slate-400 px-1 tracking-widest">
                        Antecedentes Recientes
                    </Typography>

                    {isLoading ? (
                        <div className="flex justify-center p-6"><Loader2 className="animate-spin text-slate-200" /></div>
                    ) : (
                        <div className="space-y-2">
                            {historyNotes.length > 0 ? historyNotes.map((note: { id: string | number; date: string; text: string }) => (
                                <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-bold text-blue-400 mb-1 block">
                                        {note.date}
                                    </Typography>
                                    <Typography variant={TypographyVariant.CAPTION} className="text-slate-500 text-[11px] leading-tight line-clamp-2">
                                        {note.text}
                                    </Typography>
                                </div>
                            )) : (
                                <div className="text-center py-4 border-2 border-dashed border-slate-50 rounded-xl">
                                    <Typography variant={TypographyVariant.CAPTION} className="text-slate-300 italic text-xs">
                                        No hay citas previas
                                    </Typography>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Acciones secundarias */}
                <div className="flex flex-col gap-2 pt-2 mt-auto">
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        className="rounded-xl py-2.5 w-full gap-2 bg-[#25D366] hover:bg-[#20bd5a] border-none shadow-none text-white text-sm"
                        onClick={handleWhatsAppRedirect}
                    >
                        <MessageSquare size={15} /> WhatsApp
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant={ButtonVariant.CANCEL}
                            className="rounded-xl py-2.5 flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none text-[11px]"
                            onClick={handleGoogleCalendar}
                        >
                            <CalendarCheck size={13} /> Google Cal
                        </Button>
                        <Button
                            variant={ButtonVariant.CANCEL}
                            className="rounded-xl py-2.5 flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none text-[11px]"
                            onClick={handleAppleCalendarDownload}
                        >
                            <Apple size={13} /> Apple Cal
                        </Button>
                    </div>
                    <Button
                        variant={ButtonVariant.CANCEL}
                        className="w-full py-2.5 rounded-xl border-none bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all font-bold uppercase text-[10px] tracking-wider gap-2"
                        onClick={() => navigation.appointments.manage(appointment.id)}
                    >
                        <ExternalLink size={13} /> Gestionar Cita
                    </Button>
                </div>
            </div>
        </div>
    );
};
