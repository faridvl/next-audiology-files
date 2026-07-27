export enum StudyType {
  AUDIOMETRIA_TONAL = 'AUDIOMETRIA_TONAL',
  TEST_PSICOMETRICO = 'TEST_PSICOMETRICO',
}

export interface AudiometriaTonalPayload {
  OD: Record<string, string>;
  OI: Record<string, string>;
}

export interface Study {
  uuid: string;
  encounterUuid: string;
  patientUuid: string;
  tenantUuid: string;
  autorUuid: string;
  tipo: StudyType;
  payload: Record<string, unknown>;
  documentUuid: string | null;
  createdAt: string;
}

export interface CreateStudyPayload {
  encounterUuid: string;
  patientUuid: string;
  tipo: StudyType;
  payload: Record<string, unknown>;
  documentUuid?: string | null;
}
