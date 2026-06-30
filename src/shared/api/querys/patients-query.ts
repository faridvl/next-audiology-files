import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { PaginatedResponse } from '@/types/otros/paginate.types';
import { Patient } from '@/types/patients/patient';
import { useQuery } from '@tanstack/react-query';

const PATIENTS_URL = env.API.MEDICAL_RECORDS_URL;

export type PatientStatusFilter = 'active' | 'inactive' | 'all';

export const PatientService = {
  fetchPatients: async (
    page: number,
    limit: number,
    search?: string,
    statusFilter?: PatientStatusFilter,
  ): Promise<PaginatedResponse<Patient>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(statusFilter === 'all' && { includeInactive: 'true' }),
    });

    return await ApiServiceClient(PATIENTS_URL).get<PaginatedResponse<Patient>>(
      `/patients?${params.toString()}`,
    );
  },
};

export const FETCH_PATIENTS_KEY = 'fetchPatients';

export function usePatientsQuery(page: number, limit: number, search: string, statusFilter: PatientStatusFilter = 'active') {
  return useQuery({
    queryKey: [FETCH_PATIENTS_KEY, page, limit, search, statusFilter],
    queryFn: () => PatientService.fetchPatients(page, limit, search, statusFilter),
    placeholderData: (previousData) => previousData,
  });
}
