import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const APPOINTMENTS_URL = env.API.MEDICAL_RECORDS_URL;

export const AppointmentService = {
  // date es opcional — si no se pasa devuelve todas las citas del tenant
  fetchAll: async (page: number, limit: number, date?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (date) params.set('date', date);
    return await ApiServiceClient(APPOINTMENTS_URL).get<any>(`/appointments?${params.toString()}`);
  },
};

export const FETCH_APPOINTMENTS_KEY = 'fetchAppointments';

// Sin filtro de fecha — trae todas las citas del tenant (para vistas semanales y tabla)
export function useAppointmentsQuery(page: number, limit: number) {
  return useQuery({
    queryKey: [FETCH_APPOINTMENTS_KEY, page, limit],
    queryFn: () => AppointmentService.fetchAll(page, limit),
  });
}

// Con filtro de fecha — solo las citas de un día (para dashboard)
export function useAppointmentsByDateQuery(page: number, limit: number, date: Date) {
  const dateFormatted = format(date, 'yyyy-MM-dd');
  return useQuery({
    queryKey: [FETCH_APPOINTMENTS_KEY, page, limit, dateFormatted],
    queryFn: () => AppointmentService.fetchAll(page, limit, dateFormatted),
  });
}
