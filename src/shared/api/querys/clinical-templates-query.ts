import { ApiServiceClient } from '@/shared/api/api-service-client';
import { env } from '@/shared/api/config';
import { ClinicalTemplate } from '@/types/clinical-template/clinical-template.types';
import { useQuery } from '@tanstack/react-query';

const BASE_URL = env.API.MEDICAL_RECORDS_URL;

export const FETCH_CLINICAL_TEMPLATES_KEY = 'fetchClinicalTemplates';
export const FETCH_CLINICAL_TEMPLATE_BY_SPECIALITY_KEY = 'fetchClinicalTemplateBySpeciality';
export const FETCH_CLINICAL_TEMPLATES_BY_SPECIALITY_KEY = 'fetchClinicalTemplatesBySpeciality';

export const ClinicalTemplatesService = {
  fetchAll: async (): Promise<ClinicalTemplate[]> =>
    ApiServiceClient(BASE_URL).get<ClinicalTemplate[]>('/clinical-templates'),

  fetchBySpeciality: async (speciality: string): Promise<ClinicalTemplate | null> =>
    ApiServiceClient(BASE_URL).get<ClinicalTemplate | null>(
      `/clinical-templates/speciality/${speciality}`,
    ),

  fetchAllBySpeciality: async (speciality: string): Promise<ClinicalTemplate[]> =>
    ApiServiceClient(BASE_URL).get<ClinicalTemplate[]>(
      `/clinical-templates/speciality/${speciality}/all`,
    ),
};

export function useClinicalTemplatesQuery() {
  return useQuery({
    queryKey: [FETCH_CLINICAL_TEMPLATES_KEY],
    queryFn: ClinicalTemplatesService.fetchAll,
    placeholderData: (previousData) => previousData,
  });
}

export function useClinicalTemplateBySpecialityQuery(speciality: string) {
  return useQuery({
    queryKey: [FETCH_CLINICAL_TEMPLATE_BY_SPECIALITY_KEY, speciality],
    queryFn: () => ClinicalTemplatesService.fetchBySpeciality(speciality),
    enabled: !!speciality,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}

export function useClinicalTemplatesBySpecialityQuery(speciality: string) {
  return useQuery({
    queryKey: [FETCH_CLINICAL_TEMPLATES_BY_SPECIALITY_KEY, speciality],
    queryFn: () => ClinicalTemplatesService.fetchAllBySpeciality(speciality),
    enabled: !!speciality,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
