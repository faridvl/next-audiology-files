import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useQuery } from '@tanstack/react-query';
import { MedicalControlResponse } from '@/shared/api/querys/medical-controls-query';
import { MaintenanceEntity } from '@/types/maintenance/maintenance.types';
import { Study } from '@/types/studies/study.types';

const URL = env.API.MEDICAL_RECORDS_URL;

export enum EncounterStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export interface EncounterResponse {
  uuid: string;
  patientUuid: string;
  tenantUuid: string;
  autorUuid: string;
  especialidad: string;
  appointmentUuid: string | null;
  startedAt: string;
  closedAt: string | null;
  status: EncounterStatus;
}

export interface EncounterDetailResponse extends EncounterResponse {
  medicalControls: MedicalControlResponse[];
  maintenances: MaintenanceEntity[];
  studies: Study[];
}

export const EncounterService = {
  fetchByPatient: async (patientUuid: string): Promise<EncounterResponse[]> => {
    return await ApiServiceClient(URL).get<EncounterResponse[]>(`/encounters/patient/${patientUuid}`);
  },

  fetchOne: async (encounterUuid: string): Promise<EncounterDetailResponse> => {
    return await ApiServiceClient(URL).get<EncounterDetailResponse>(`/encounters/${encounterUuid}`);
  },
};

export const FETCH_ENCOUNTERS_BY_PATIENT_KEY = 'fetchEncountersByPatient';
export const FETCH_ENCOUNTER_KEY = 'fetchEncounter';

export function useEncountersByPatientQuery(patientUuid: string, enabled = true) {
  return useQuery({
    queryKey: [FETCH_ENCOUNTERS_BY_PATIENT_KEY, patientUuid],
    queryFn: () => EncounterService.fetchByPatient(patientUuid),
    enabled: !!patientUuid && enabled,
  });
}

export function useEncounterDetailQuery(encounterUuid: string | null) {
  return useQuery({
    queryKey: [FETCH_ENCOUNTER_KEY, encounterUuid],
    queryFn: () => EncounterService.fetchOne(encounterUuid as string),
    enabled: !!encounterUuid,
  });
}
