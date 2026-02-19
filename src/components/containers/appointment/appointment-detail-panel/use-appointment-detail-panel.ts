// import { useState } from 'react';
// import { AppointmentUI } from '../appointment-list/use-appointment-list-container';

// export const useAppointmentDetail = (appointment: AppointmentUI) => {
//   const [isLoading, setIsLoading] = useState(false);

//   // Notas de sesiones previas para dar contexto al doctor
//   const [historyNotes] = useState([
//     { id: 1, date: '15 Jan 2026', text: 'Se realizó limpieza profunda, reportó sensibilidad.' },
//     { id: 2, date: '02 Dec 2025', text: 'Consulta inicial por dolor en molar.' },
//   ]);

//   const handleWhatsAppRedirect = () => {
//     const message = `Hola ${appointment.patient}, confirmamos tu cita de ${appointment.type} para el ${appointment.date}.`;
//     window.open(
//       //   `https://wa.me/${appointment.phone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`,
//       `https://wa.me/88165808, '')}?text=${encodeURIComponent(message)}`,
//     );
//   };

//   const generateCalendarLink = () => {
//     // Ejemplo rápido para Google Calendar
//     const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
//     const title = encodeURIComponent(`Cita Médica: ${appointment.type}`);
//     const details = encodeURIComponent(`Paciente: ${appointment.patient}`);
//     window.open(`${baseUrl}&text=${title}&details=${details}`, '_blank');
//   };

//   return {
//     isLoading,
//     historyNotes,
//     handleWhatsAppRedirect,
//     generateCalendarLink,
//   };
// };
import { useMemo } from 'react';
import { format } from 'date-fns';
import { AppointmentUI } from '../appointment-list/use-appointment-list-container';
import { useAppointmentByPatientQuery } from '@/shared/api/querys/get-appoinment-by-patient-query';

export const useAppointmentDetail = (appointment: AppointmentUI) => {
  const { data, isLoading } = useAppointmentByPatientQuery(appointment.patientUUID);

  const patientInfo = data?.patient || null;
  const rawAppointments = data?.appointments || [];

  const historyNotes = useMemo(() => {
    return rawAppointments
      .filter((app) => app.id !== appointment.id)
      .map((app) => ({
        id: app.id,
        date: format(new Date(app.schedule.date), 'dd MMM yyyy'),
        text: app.notes || 'Sin observaciones registradas.',
      }))
      .slice(0, 3);
  }, [rawAppointments, appointment.id]);

  const handleWhatsAppRedirect = (): void => {
    const message = `Hola ${appointment.patient}, confirmamos tu cita de ${appointment.type} para el ${format(appointment.date, 'dd/MM/yyyy')}.`;
    const phone = patientInfo?.phone || appointment.phone || '88165808';
    window.open(
      `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
      '_blank',
    );
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