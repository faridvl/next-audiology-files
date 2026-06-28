import { useState, useEffect } from 'react';
import { addMonths, format } from 'date-fns';
import { useNavigation } from '@/hooks/use-navigation';
import { toast } from 'sonner';
import { AppointmentStatus } from '@/types/appointments/appointment';
import { useAppointmentQuery } from '@/shared/api/querys/get-appointment-query';
import { useUpdateAppointmentMutation } from '@/shared/api/mutations/appointments/update-appointment-mutation';
import { useQueryClient } from '@tanstack/react-query';
import { FETCH_APPOINTMENTS_KEY } from '@/shared/api/querys/appointments-query';
import { FETCH_APPOINTMENT_KEY } from '@/shared/api/querys/get-appointment-query';

export const useManageAppointment = (appointmentId: string) => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    const { data: appointment, isLoading } = useAppointmentQuery(appointmentId);
    const { executeUpdateAppointment, isPending, error } = useUpdateAppointmentMutation();

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

    const invalidateAppointments = () => {
        queryClient.invalidateQueries({ queryKey: [FETCH_APPOINTMENTS_KEY] });
        queryClient.invalidateQueries({ queryKey: [FETCH_APPOINTMENT_KEY, appointmentId] });
    };

    const handleNoAnswer = () => {
        if (!formData.date) {
            toast.error('La cita no tiene fecha válida para reprogramar');
            return;
        }
        const nextMonth = addMonths(new Date(formData.date), 1);
        const callNote = `[${format(new Date(), 'dd/MM/yyyy HH:mm')}]: Intento de llamada fallido. Se reprograma automáticamente.`;

        executeUpdateAppointment(
            {
                uuid: appointmentId,
                date: nextMonth.toISOString(),
                status: AppointmentStatus.PENDING,
                notes: formData.notes ? `${formData.notes}\n${callNote}` : callNote,
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

    return {
        formData,
        setFormData,
        isLoading,
        isPending,
        appointment,
        handleNoAnswer,
        handleConfirm,
        navigation
    };
};
