import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneOff, CheckCircle2, Phone, ChevronLeft, Trash2 } from 'lucide-react';
import { Typography, TypographyVariant } from "@/components/common/typography/typography";
import { Button, ButtonVariant } from "@/components/common/button/button";
import { useManageAppointment } from './use-manage-appointment';
import { TEXT } from '@/static/texts/i18n';

export const ManageAppointmentContainer: React.FC<{ id: string }> = ({ id }) => {
    const { t } = useTranslation();
    const {
        formData, setFormData, isLoading, isPending, isDeleting, isConfirmed,
        callAttempts, handleNoAnswer, handleConfirm, handleDelete, navigation,
    } = useManageAppointment(id);

    if (isLoading) return <div className="max-w-3xl mx-auto py-6 animate-pulse h-96 bg-neutral-100 rounded-[40px]" />;

    return (
        <div className="max-w-3xl mx-auto py-6">
            <button onClick={navigation.common.back} className="flex items-center gap-2 text-neutral-400 mb-8 group">
                <ChevronLeft size={20} />
                <Typography variant={TypographyVariant.BODY_SEMIBOLD}>{t(TEXT.APPOINTMENTS.MANAGE.BACK)}</Typography>
            </button>

            <div className="bg-white border border-neutral-100 rounded-[40px] p-10 shadow-sm space-y-10">

                {/* ESTADO ACTUAL - ALERTA */}
                {isConfirmed ? (
                    <div className="bg-success/10 border border-success/20 p-6 rounded-app-lg flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-success-dark shrink-0" />
                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-success-dark">
                            {t(TEXT.APPOINTMENTS.MANAGE.LOCKED_CONFIRMED)}
                        </Typography>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-app-lg flex items-center justify-between">
                        <div>
                            <Typography variant={TypographyVariant.BODY_BOLD} className="text-amber-700">{t(TEXT.APPOINTMENTS.MANAGE.STATUS_ALERT.TITLE)}</Typography>
                            <Typography variant={TypographyVariant.CAPTION} className="text-amber-600">{t(TEXT.APPOINTMENTS.MANAGE.STATUS_ALERT.SUBTITLE)}</Typography>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant={ButtonVariant.CANCEL}
                                className="bg-white text-danger border-danger/10 gap-2"
                                onClick={handleNoAnswer}
                                disabled={isPending}
                            >
                                <PhoneOff size={16} /> {t(TEXT.APPOINTMENTS.MANAGE.ACTIONS.NO_ANSWER)}
                            </Button>
                            <Button
                                variant={ButtonVariant.PRIMARY}
                                className="bg-success hover:bg-success/90 gap-2"
                                onClick={handleConfirm}
                                disabled={isPending}
                            >
                                <CheckCircle2 size={16} /> {t(TEXT.APPOINTMENTS.MANAGE.ACTIONS.CONFIRM)}
                            </Button>
                        </div>
                    </div>
                )}

                {/* HISTORIAL DE INTENTOS DE LLAMADA */}
                {callAttempts.length > 0 && (
                    <div className="space-y-3">
                        <Typography variant={TypographyVariant.OVERLINE} className="font-bold flex items-center gap-2">
                            <Phone size={14} /> {t(TEXT.APPOINTMENTS.MANAGE.CALL_HISTORY.TITLE)} ({callAttempts.length})
                        </Typography>
                        <div className="bg-neutral-50 border border-neutral-100 rounded-app-lg p-4 space-y-2">
                            {callAttempts.map((attempt) => (
                                <div key={attempt.line} className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 w-16 shrink-0">
                                        #{attempt.attemptNumber}
                                    </span>
                                    <span className="text-xs font-mono text-neutral-500">{attempt.timestamp}</span>
                                    <span className="text-xs text-danger font-semibold ml-auto">{t(TEXT.APPOINTMENTS.MANAGE.CALL_HISTORY.NO_ANSWER_LABEL)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FORMULARIO DE EDICIÓN */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Typography variant={TypographyVariant.OVERLINE} className="font-bold">{t(TEXT.APPOINTMENTS.MANAGE.FORM.ADJUST_DATE)}</Typography>
                        <input
                            type="date"
                            disabled={isConfirmed}
                            className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-app-md disabled:opacity-50 disabled:cursor-not-allowed"
                            value={formData.date}
                            onChange={(event) => setFormData({ ...formData, date: event.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Typography variant={TypographyVariant.OVERLINE} className="font-bold">{t(TEXT.APPOINTMENTS.MANAGE.FORM.ADJUST_TIME)}</Typography>
                        <input
                            type="time"
                            disabled={isConfirmed}
                            className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-app-md disabled:opacity-50 disabled:cursor-not-allowed"
                            value={formData.startTime}
                            onChange={(event) => setFormData({ ...formData, startTime: event.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Typography variant={TypographyVariant.OVERLINE} className="font-bold">{t(TEXT.APPOINTMENTS.MANAGE.FORM.FOLLOW_UP_LOG)}</Typography>
                    <textarea
                        rows={4}
                        disabled={isConfirmed}
                        className="w-full p-5 bg-neutral-50 border border-neutral-100 rounded-app-lg outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={t(TEXT.APPOINTMENTS.MANAGE.FORM.FOLLOW_UP_LOG_PLACEHOLDER)}
                        value={formData.notes}
                        onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                    />
                </div>

                <hr className="border-neutral-100" />

                <div className="flex justify-end">
                    <Button
                        variant={ButtonVariant.CANCEL}
                        className="bg-white text-danger border-danger/20 hover:bg-danger/5 gap-2"
                        disabled={isDeleting}
                        onClick={() => {
                            if (window.confirm(t(TEXT.APPOINTMENTS.MANAGE.DELETE.CONFIRM))) {
                                handleDelete();
                            }
                        }}
                    >
                        <Trash2 size={16} /> {t(TEXT.APPOINTMENTS.MANAGE.DELETE.BUTTON)}
                    </Button>
                </div>
            </div>
        </div>
    );
};
