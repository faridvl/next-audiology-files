import { useState, useEffect } from 'react';
import { addMonths, format } from 'date-fns';
import { useNavigation } from '@/hooks/use-navigation';
import { toast } from 'sonner';
import { AppointmentStatus } from '@/types/appointments/appointment';

export const useManageAppointment = (appointmentId: string) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    // Aquí deberías traer los datos de la cita actual con un query
    // const { data: appointment } = useAppointmentQuery(appointmentId);

    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        notes: '',
        status: ''
    });

    const handleNoAnswer = async () => {
        setLoading(true);
        try {
            // Lógica: Sumar 1 mes y poner en PENDING
            const nextMonth = addMonths(new Date(formData.date), 1);
            const payload = {
                date: nextMonth.toISOString(),
                status: AppointmentStatus.PENDING,
                notes: `${formData.notes}\n[SISTEMA]: Intento de llamada fallido. Se reprograma automáticamente.`
            };
            // executeUpdate(payload);
            toast.info('Se reprogramó para el siguiente mes');
            navigation.appointments.list();
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        // Cambia a CONFIRMED y guarda
        toast.success('Cita confirmada exitosamente');
        navigation.appointments.list();
    };

    return {
        formData,
        setFormData,
        loading,
        handleNoAnswer,
        handleConfirm,
        navigation
    };
};