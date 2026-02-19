import { useState, useMemo } from 'react';
import { addDays, startOfWeek, format, addWeeks, subWeeks, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppointmentsQuery } from '@/shared/api/querys/appointments-query';

export enum ViewMode {
  TABLE = 'TABLE',
  WEEKLY = 'WEEKLY',
}

export enum AppointmentStatus {
  TENTATIVE = 'TENTATIVE',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  WAITING = 'WAITING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum MedicalSpeciality {
  AUDIOLOGY = 'AUDIOLOGY',
  DENTAL = 'DENTAL',
  GENERAL = 'GENERAL',
}

export const ALL_STATUSES = 'ALL';

// Configuración centralizada de estados (Etiquetas y Estilos)
export const statusConfig: Record<string, { label: string; color: string }> = {
  [ALL_STATUSES]: { label: 'Todos los Estados', color: '' },
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

const specialityMap: Record<string, string> = {
  [MedicalSpeciality.AUDIOLOGY]: 'Audiología',
  [MedicalSpeciality.DENTAL]: 'Odontología',
  [MedicalSpeciality.GENERAL]: 'Consulta General',
};

export interface AppointmentUI {
  id: string;
  patient: string;
  patientUUID: string;
  phone: string;
  date: Date;
  time: string;
  status: AppointmentStatus;
  statusLabel: string;
  statusColor: string;
  type: string;
  notes?: string;
  monthsSinceLastVisit: number;
  warrantyExpirationDate: string;
}

export const useAppointmentsContainer = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.WEEKLY);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentUI | null>(null);

  const { data, isLoading } = useAppointmentsQuery(1, 100, currentDate);

  const moveWeek = (direction: 'next' | 'prev') => {
    setCurrentDate((prev) => (direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)));
  };

  const appointments: AppointmentUI[] = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((raw: any) => {
      const status = (raw.status as AppointmentStatus) || AppointmentStatus.PENDING;
      const config = statusConfig[status];

      return {
        id: raw.id || raw.uuid,
        patient: raw.patientName || 'Paciente no identificado',
        patientUUID: raw.patient?.uuid || '',
        phone: raw.patient?.phone || 'N/A',
        date: parseISO(raw.schedule.date),
        time: raw.schedule?.startTime ? format(parseISO(raw.schedule.startTime), 'HH:mm') : '--:--',
        status,
        statusLabel: config.label,
        statusColor: config.color,
        type: raw.service?.name || specialityMap[raw.speciality] || raw.speciality || 'General',
        notes: raw.notes,
        monthsSinceLastVisit: 0,
        warrantyExpirationDate: 'N/A',
      };
    });
  }, [data]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const matchesSearch = app.patient.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === ALL_STATUSES || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  return {
    viewMode,
    setViewMode,
    currentDate,
    moveWeek,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedAppointment,
    setSelectedAppointment,
    loading: isLoading,
    appointments: filteredAppointments,
    weekRangeLabel: useMemo(() => {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = addDays(start, 6);
      return `${format(start, 'dd MMM')} — ${format(end, 'dd MMM')}`;
    }, [currentDate]),
    daysOfCurrentWeek: Array.from({ length: 7 }).map((_, i) =>
      addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i),
    ),
  };
};
