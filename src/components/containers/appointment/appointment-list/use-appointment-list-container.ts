import { useState, useMemo, useCallback } from 'react';
import { addDays, startOfWeek, format, addWeeks, subWeeks, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAppointmentsQuery } from '@/shared/api/querys/appointments-query';
import { AppointmentStatus } from '@/types/appointments/appointment';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { AppointmentUI } from '@/types/appointments/appointment-ui.types';
import { useUpdateAppointmentMutation } from '@/shared/api/mutations/appointments/update-appointment-mutation';

export enum ViewMode {
  TABLE = 'TABLE',
  WEEKLY = 'WEEKLY',
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

export type { AppointmentUI } from '@/types/appointments/appointment-ui.types';

export const useAppointmentsContainer = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.WEEKLY);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentUI | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkTargetStatus, setBulkTargetStatus] = useState<AppointmentStatus | ''>('');
  const [isBulkPending, setIsBulkPending] = useState(false);

  const { data, isLoading, refetch } = useAppointmentsQuery(1, 100, currentDate);
  const { executeUpdateAppointment } = useUpdateAppointmentMutation();

  const moveWeek = (direction: 'next' | 'prev') => {
    setCurrentDate((prev) => (direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)));
  };

  const appointments: AppointmentUI[] = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((rawAppointment: Record<string, unknown>) => {
      const status = (rawAppointment.status as AppointmentStatus) || AppointmentStatus.PENDING;
      const config = statusConfig[status];
      const schedule = rawAppointment.schedule as Record<string, string>;
      const service = rawAppointment.service as Record<string, string> | undefined;
      const patientRecord = rawAppointment.patient as Record<string, string> | undefined;

      return {
        id: (rawAppointment.id || rawAppointment.uuid) as string,
        patient: (rawAppointment.patientName as string) || 'Paciente no identificado',
        patientUUID: (rawAppointment.patientUUID as string) || '',
        phone: patientRecord?.phone || 'N/A',
        date: parseISO(schedule.date),
        time: schedule?.startTime ? format(parseISO(schedule.startTime), 'HH:mm') : '--:--',
        status,
        statusLabel: config.label,
        statusColor: config.color,
        type: service?.name || specialityMap[rawAppointment.speciality as string] || (rawAppointment.speciality as string) || 'General',
        notes: rawAppointment.notes as string | undefined,
        monthsSinceLastVisit: 0,
        warrantyExpirationDate: 'N/A',
      };
    });
  }, [data]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === ALL_STATUSES || appointment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  const toggleSelectAppointment = useCallback((id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleBulkStatusChange = useCallback(async () => {
    if (!bulkTargetStatus || selectedIds.size === 0) return;

    setIsBulkPending(true);
    let successCount = 0;
    let errorCount = 0;

    const updatePromises = Array.from(selectedIds).map(
      (uuid) =>
        new Promise<void>((resolve) => {
          executeUpdateAppointment(
            { uuid, status: bulkTargetStatus as AppointmentStatus },
            {
              onSuccess: () => {
                successCount++;
                resolve();
              },
              onError: () => {
                errorCount++;
                resolve();
              },
            },
          );
        }),
    );

    await Promise.all(updatePromises);
    setIsBulkPending(false);
    setSelectedIds(new Set());
    setBulkTargetStatus('');
    await refetch();

    if (errorCount === 0) {
      toast.success(`${successCount} cita(s) actualizadas correctamente`);
    } else {
      toast.error(`${successCount} actualizadas, ${errorCount} con error`);
    }
  }, [bulkTargetStatus, selectedIds, executeUpdateAppointment, refetch]);

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
    isLoading,
    appointments: filteredAppointments,
    selectedIds,
    toggleSelectAppointment,
    bulkTargetStatus,
    setBulkTargetStatus,
    isBulkPending,
    handleBulkStatusChange,
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
