import { useMemo, useState, useEffect } from 'react';
import { useNavigation } from '@/hooks/use-navigation';
import { useSession } from '@/hooks/use-session';
import { useAppointmentsQuery } from '@/shared/api/querys/appointments-query';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';

export enum AppointmentStatus {
  TENTATIVE = 'TENTATIVE',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  WAITING = 'WAITING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface DashboardAppointment {
  id: string;
  time: string;
  endTime: string;
  patient: string;
  desc: string;
  status: AppointmentStatus;
  statusLabel: string;
  statusColor: string;
}

export function useDashboard() {
  const nav = useNavigation();
  const { user, isLoading: sessionLoading } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading: appointmentsLoading } = useAppointmentsQuery(1, 5, new Date());

  // Mapeo de Especialidades
  const specialityMap: Record<string, string> = {
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

  const appointments = useMemo<DashboardAppointment[]>(() => {
    const rawList = Array.isArray(data) ? data : data?.data || [];

    return rawList.slice(0, 5).map((app: any) => {
      const status = (app.status as AppointmentStatus) || AppointmentStatus.PENDING;
      const startTimeStr = app.schedule?.startTime || app.schedule?.date;
      const endTimeStr = app.schedule?.endTime;

      // Lógica de descripción: Prioriza nombre del servicio > Especialidad mapeada > Especialidad cruda > Genérico
      const displaySpeciality =
        specialityMap[app.speciality as MedicalSpeciality] || app.speciality || 'Consulta Médica';
      const description = app.service?.name || displaySpeciality;

      return {
        id: app.id || app.uuid,
        time: startTimeStr ? format(parseISO(startTimeStr), 'HH:mm') : '--:--',
        endTime: endTimeStr ? format(parseISO(endTimeStr), 'HH:mm') : '',
        patient: app.patientName || 'Paciente no identificado',
        desc: description,
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
      viewAgenda: () => nav.appointments.list(),
      createPatient: () => nav.patients.create(),
      createAppointment: () => nav.appointments.create(),
      goTests: () => nav.tests(),
      goInventory: () => nav.inventory(),
      manageAppointment: (id: string) => nav.appointments.manage(id),
    },
  };
}
