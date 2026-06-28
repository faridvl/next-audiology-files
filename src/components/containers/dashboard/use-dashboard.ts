import { useMemo, useState, useEffect } from 'react';
import { useNavigation } from '@/hooks/use-navigation';
import { useSession } from '@/hooks/use-session';
import { useAppointmentsQuery } from '@/shared/api/querys/appointments-query';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { AppointmentStatus } from '@/types/appointments/appointment';
import { DashboardAppointment } from '@/types/appointments/dashboard-appointment.types';

const specialityLabels: Record<MedicalSpeciality, string> = {
  [MedicalSpeciality.AUDIOLOGY]: 'Audiología',
  [MedicalSpeciality.DENTAL]: 'Odontología',
  [MedicalSpeciality.GENERAL]: 'Consulta General',
};

const statusConfig: Record<AppointmentStatus, { label: string; color: string }> = {
  [AppointmentStatus.TENTATIVE]: {
    label: 'Por confirmar',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  [AppointmentStatus.PENDING]: {
    label: 'Pendiente',
    color: 'bg-slate-50 text-slate-500 border-slate-100',
  },
  [AppointmentStatus.CONFIRMED]: {
    label: 'Confirmada',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  [AppointmentStatus.WAITING]: {
    label: 'En espera',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  [AppointmentStatus.COMPLETED]: {
    label: 'Finalizada',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  [AppointmentStatus.CANCELLED]: {
    label: 'Cancelada',
    color: 'bg-red-50 text-red-600 border-red-100',
  },
  [AppointmentStatus.EXPIRED]: {
    label: 'Vencida',
    color: 'bg-slate-100 text-slate-400 border-slate-200',
  },
};

export function useDashboard() {
  const navigation = useNavigation();
  const { user, isLoading: sessionLoading } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading: appointmentsLoading } = useAppointmentsQuery(1, 5, new Date());

  const appointments = useMemo<DashboardAppointment[]>(() => {
    const rawList = Array.isArray(data) ? data : data?.data || [];

    return rawList.slice(0, 5).map((rawAppointment: Record<string, unknown>) => {
      const status = (rawAppointment.status as AppointmentStatus) || AppointmentStatus.PENDING;
      const schedule = rawAppointment.schedule as Record<string, string> | undefined;
      const service = rawAppointment.service as Record<string, string> | undefined;
      const startTimeStr = schedule?.startTime || schedule?.date;
      const endTimeStr = schedule?.endTime;

      const displaySpeciality =
        specialityLabels[rawAppointment.speciality as MedicalSpeciality] ||
        (rawAppointment.speciality as string) ||
        'Consulta Médica';
      const description = service?.name || displaySpeciality;

      return {
        id: (rawAppointment.id || rawAppointment.uuid) as string,
        time: startTimeStr ? format(parseISO(startTimeStr), 'HH:mm') : '--:--',
        endTime: endTimeStr ? format(parseISO(endTimeStr), 'HH:mm') : '',
        patient: (rawAppointment.patientName as string) || 'Paciente no identificado',
        description,
        status,
        statusLabel: statusConfig[status].label,
        statusColor: statusConfig[status].color,
      };
    });
  }, [data]);

  return {
    userName: user?.fullName?.split(' ')[0] || 'Usuario',
    todayFormatted: isMounted ? format(new Date(), "EEEE, d 'de' MMMM", { locale: es }) : '',
    appointments,
    isLoading: sessionLoading || !isMounted || appointmentsLoading,
    actions: {
      viewAgenda: () => navigation.appointments.list(),
      createPatient: () => navigation.patients.create(),
      createAppointment: () => navigation.appointments.create(),
      goTests: () => navigation.tests(),
      goInventory: () => navigation.inventory.create(),
      manageAppointment: (id: string) => navigation.appointments.manage(id),
    },
  };
}
