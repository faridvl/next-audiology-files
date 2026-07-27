import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { useQuery } from '@tanstack/react-query';
import { Study } from '@/types/studies/study.types';

const URL = env.API.MEDICAL_RECORDS_URL;

export const StudyService = {
  fetchByPatient: async (patientUuid: string): Promise<Study[]> => {
    return await ApiServiceClient(URL).get<Study[]>(`/studies/patient/${patientUuid}`);
  },

  fetchOne: async (studyUuid: string): Promise<Study> => {
    return await ApiServiceClient(URL).get<Study>(`/studies/${studyUuid}`);
  },
};

export const FETCH_STUDIES_BY_PATIENT_KEY = 'fetchStudiesByPatient';
export const FETCH_STUDY_KEY = 'fetchStudy';

export function useStudiesByPatientQuery(patientUuid: string, enabled = true) {
  return useQuery({
    queryKey: [FETCH_STUDIES_BY_PATIENT_KEY, patientUuid],
    queryFn: () => StudyService.fetchByPatient(patientUuid),
    enabled: !!patientUuid && enabled,
  });
}

export function useStudyDetailQuery(studyUuid: string | null) {
  return useQuery({
    queryKey: [FETCH_STUDY_KEY, studyUuid],
    queryFn: () => StudyService.fetchOne(studyUuid as string),
    enabled: !!studyUuid,
  });
}
