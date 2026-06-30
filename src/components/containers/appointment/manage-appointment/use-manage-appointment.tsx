import { useState, useEffect } from 'react';
import { addMonths, format } from 'date-fns';
import { useNavigation } from '@/hooks/use-navigation';
import { toast } from 'sonner';
import { AppointmentStatus } from '@/types/appointments/appointment';
import { CallAttemptEntry } from '@/types/appointments/call-attempt.types';
import { useAppointmentQuery } from '@/shared/api/querys/get-appointment-query';
import { useUpdateAppointmentMutation } from '@/shared/api/mutations/appointments/update-appointment-mutation';
import { useDeleteAppointmentMutation } from '@/shared/api/mutations/appointments/delete-appointment-mutation';
import { useQueryClient } from '@tanstack/react-query';
import { FETCH_APPOINTMENTS_KEY } from '@/shared/api/querys/appointments-query';
import { FETCH_APPOINTMENT_KEY } from '@/shared/api/querys/get-appointment-query';

const CALL_ATTEMPT_MARKER = '— No contestó';
const MAX_NOTES_LENGTH = 490;
const MAX_CALL_ATTEMPTS_STORED = 5;

function countCallAttempts(notes: string): number {
  if (!notes) return 0;
  return (notes.match(/Intento #\d+/g) ?? []).length;
}

function buildCallNote(currentNotes: string): string {
  const attemptNumber = countCallAttempts(currentNotes) + 1;
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm');
  return `[${timestamp}] Intento #${attemptNumber} ${CALL_ATTEMPT_MARKER}`;
}

function buildUpdatedNotes(currentNotes: string, newEntry: string): string {
  const existingLines = currentNotes
    ? currentNotes.split('\n').filter((line) => line.includes(CALL_ATTEMPT_MARKER))
    : [];
  const recentLines = existingLines.slice(-(MAX_CALL_ATTEMPTS_STORED - 1));
  const combined = [...recentLines, newEntry].join('\n');
  return combined.length > MAX_NOTES_LENGTH ? combined.slice(-MAX_NOTES_LENGTH) : combined;
}

function parseCallAttempts(notes: string): CallAttemptEntry[] {
  if (!notes) return [];
  const lines = notes.split('\n');
  const attemptLines = lines.filter((line) => line.includes(CALL_ATTEMPT_MARKER));

  return attemptLines.map((line) => {
    const match = line.match(/\[(.+?)\] Intento #(\d+)/);
    return {
      timestamp: match ? match[1] : '',
      attemptNumber: match ? parseInt(match[2], 10) : 0,
      line,
    };
  });
}

export const useManageAppointment = (appointmentId: string) => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    const { data: appointment, isLoading } = useAppointmentQuery(appointmentId);
    const { executeUpdateAppointment, isPending, error } = useUpdateAppointmentMutation();
    const { executeDeleteAppointment, isPending: isDeleting } = useDeleteAppointmentMutation();

    const isConfirmed = appointment?.status === AppointmentStatus.CONFIRMED;

    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        notes: '',
        status: ''
    });

    useEffect(() => {
        if (appointment) {
            setFormData({
                date: appointment.schedule?.date
                    ? format(new Date(appointment.schedule.date), 'yyyy-MM-dd')
                    : '',
                startTime: appointment.schedule?.startTime
                    ? format(new Date(appointment.schedule.startTime), 'HH:mm')
                    : '',
                notes: appointment.notes ?? '',
                status: appointment.status,
            });
        }
    }, [appointment]);

    useEffect(() => {
        if (error) toast.error('Error al actualizar la cita');
    }, [error]);

    const callAttempts = parseCallAttempts(formData.notes);

    const invalidateAppointments = () => {
        queryClient.invalidateQueries({ queryKey: [FETCH_APPOINTMENTS_KEY] });
        queryClient.invalidateQueries({ queryKey: [FETCH_APPOINTMENT_KEY, appointmentId] });
    };

    const handleNoAnswer = () => {
        if (isConfirmed) {
            toast.error('La cita ya está confirmada y no puede ser editada');
            return;
        }
        if (!formData.date) {
            toast.error('La cita no tiene fecha válida para reprogramar');
            return;
        }
        const nextMonth = addMonths(new Date(formData.date), 1);
        const callNote = buildCallNote(formData.notes);
        const updatedNotes = buildUpdatedNotes(formData.notes, callNote);

        executeUpdateAppointment(
            {
                uuid: appointmentId,
                date: nextMonth.toISOString(),
                status: AppointmentStatus.PENDING,
                notes: updatedNotes,
            },
            {
                onSuccess: () => {
                    invalidateAppointments();
                    toast.info('Se reprogramó para el siguiente mes');
                    navigation.appointments.list();
                },
            }
        );
    };

    const handleConfirm = () => {
        executeUpdateAppointment(
            {
                uuid: appointmentId,
                status: AppointmentStatus.CONFIRMED,
                notes: formData.notes,
            },
            {
                onSuccess: () => {
                    invalidateAppointments();
                    toast.success('Cita confirmada exitosamente');
                    navigation.appointments.list();
                },
            }
        );
    };

    const handleDelete = () => {
        executeDeleteAppointment(appointmentId, {
            onSuccess: () => {
                toast.success('Cita eliminada correctamente');
                navigation.appointments.list();
            },
            onError: () => toast.error('No se pudo eliminar la cita'),
        });
    };

    return {
        formData,
        setFormData,
        isLoading,
        isPending,
        isDeleting,
        isConfirmed,
        appointment,
        callAttempts,
        handleNoAnswer,
        handleConfirm,
        handleDelete,
        navigation
    };
};
