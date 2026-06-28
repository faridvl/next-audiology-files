import { useMemo } from 'react';
import { format } from 'date-fns';
import { AppointmentUI } from '@/types/appointments/appointment-ui.types';
import { HistoryNote } from '@/types/appointments/history-note.types';
import { useAppointmentByPatientQuery } from '@/shared/api/querys/get-appoinment-by-patient-query';

export const useAppointmentDetail = (appointment: AppointmentUI) => {
  const { data, isLoading } = useAppointmentByPatientQuery(appointment.patientUUID);

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

  const handleWhatsAppRedirect = (): void => {
    const appointmentDate = appointment.date instanceof Date ? appointment.date : new Date();
    const message = `Hola ${appointment.patient}, confirmamos tu cita de ${appointment.type} para el ${format(appointmentDate, 'dd/MM/yyyy')}.`;

    const phone = patientInfo?.phone || appointment.phone || '88165808';
    const cleanPhone = phone.replace(/\D/g, '');

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const generateCalendarLink = (): void => {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const title = encodeURIComponent(`Cita Médica: ${appointment.type}`);
    const details = encodeURIComponent(`Paciente: ${appointment.patient}`);
    window.open(`${baseUrl}&text=${title}&details=${details}`, '_blank');
  };

  return {
    isLoading,
    patientInfo,
    historyNotes,
    handleWhatsAppRedirect,
    generateCalendarLink,
  };
};
