import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AppointmentUI } from '@/types/appointments/appointment-ui.types';
import { HistoryNote } from '@/types/appointments/history-note.types';
import { AppointmentStatus } from '@/types/appointments/appointment';
import { useAppointmentByPatientQuery } from '@/shared/api/querys/get-appoinment-by-patient-query';
import { useUpdateAppointmentMutation } from '@/shared/api/mutations/appointments/update-appointment-mutation';

export const useAppointmentDetail = (appointment: AppointmentUI, onStatusChange?: () => void) => {
  const { data, isLoading } = useAppointmentByPatientQuery(appointment.patientUUID);
  const { executeUpdateAppointment, isPending: isActionPending } = useUpdateAppointmentMutation();
  const [localStatus, setLocalStatus] = useState<AppointmentStatus>(appointment.status);

  const patientInfo = data?.patient || null;

  const rawAppointments = useMemo(() => data?.appointments || [], [data?.appointments]);

  const historyNotes = useMemo((): HistoryNote[] => {
    return rawAppointments
      .filter((rawEntry: Record<string, unknown>) => rawEntry.id !== appointment.id)
      .map((rawEntry: Record<string, unknown>) => {
        const schedule = rawEntry.schedule as Record<string, string> | undefined;
        return {
          id: rawEntry.id as string,
          date: schedule?.date ? format(new Date(schedule.date), 'dd MMM yyyy') : 'Fecha n/a',
          text: (rawEntry.notes as string) || 'Sin observaciones registradas.',
        };
      })
      .slice(0, 3);
  }, [rawAppointments, appointment.id]);

  const handleQuickConfirm = (): void => {
    executeUpdateAppointment(
      { uuid: appointment.id, status: AppointmentStatus.CONFIRMED },
      {
        onSuccess: () => {
          setLocalStatus(AppointmentStatus.CONFIRMED);
          toast.success('Cita confirmada');
          onStatusChange?.();
        },
        onError: () => toast.error('No se pudo confirmar la cita'),
      },
    );
  };

  const handleQuickNoAnswer = (): void => {
    executeUpdateAppointment(
      { uuid: appointment.id, status: AppointmentStatus.TENTATIVE },
      {
        onSuccess: () => {
          setLocalStatus(AppointmentStatus.TENTATIVE);
          toast.success('Registrado como no contestó');
          onStatusChange?.();
        },
        onError: () => toast.error('No se pudo actualizar la cita'),
      },
    );
  };

  const handleWhatsAppRedirect = (): void => {
    const appointmentDate = appointment.date instanceof Date ? appointment.date : new Date();
    const message = `Hola ${appointment.patient}, confirmamos tu cita de ${appointment.type} para el ${format(appointmentDate, 'dd/MM/yyyy')}.`;

    const phone = patientInfo?.phone || appointment.phone || '88165808';
    const cleanPhone = phone.replace(/\D/g, '');

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleGoogleCalendar = (): void => {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const title = encodeURIComponent(`Cita Médica: ${appointment.type}`);
    const details = encodeURIComponent(`Paciente: ${appointment.patient}`);

    const appointmentDate = appointment.date instanceof Date ? appointment.date : new Date();
    // Google Calendar uses YYYYMMDDTHHMMSSZ format
    const startDateFormatted = format(appointmentDate, "yyyyMMdd'T'HHmmss");
    // Default 1-hour duration if we have no endTime
    const endDate = new Date(appointmentDate.getTime() + 60 * 60 * 1000);
    const endDateFormatted = format(endDate, "yyyyMMdd'T'HHmmss");

    window.open(
      `${baseUrl}&text=${title}&details=${details}&dates=${startDateFormatted}/${endDateFormatted}`,
      '_blank',
    );
  };

  const handleAppleCalendarDownload = (): void => {
    const appointmentDate = appointment.date instanceof Date ? appointment.date : new Date();
    const endDate = new Date(appointmentDate.getTime() + 60 * 60 * 1000);

    const formatIcsDate = (date: Date): string => format(date, "yyyyMMdd'T'HHmmss");

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Zynka//Medical//ES',
      'BEGIN:VEVENT',
      `DTSTART:${formatIcsDate(appointmentDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:Cita Médica: ${appointment.type}`,
      `DESCRIPTION:Paciente: ${appointment.patient}`,
      `UID:${appointment.id}@zynka`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cita-${appointment.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    isLoading,
    isActionPending,
    localStatus,
    patientInfo,
    historyNotes,
    handleQuickConfirm,
    handleQuickNoAnswer,
    handleWhatsAppRedirect,
    handleGoogleCalendar,
    handleAppleCalendarDownload,
  };
};
