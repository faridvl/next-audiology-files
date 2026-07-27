// src/components/pdf/use-pdf-report.ts
// Hook que construye los props del PDF de reporte de control médico (P2-8)

import { useMemo } from 'react';
import { useControlDetailQuery } from '@/shared/api/querys/get-medical-controls-query';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useStudiesByPatientQuery } from '@/shared/api/querys/studies-query';
import { useSession } from '@/hooks/use-session';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { StudyType, AudiometriaTonalPayload } from '@/types/studies/study.types';
import { PdfReportProps, PdfReportAudiogramRow } from '@/types/pdf/report.types';

const AUDIOLOGY_AUDIOGRAM_FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];

const SPECIALITY_LABELS: Record<string, string> = {
  [MedicalSpeciality.AUDIOLOGY]: 'Audiología Clínica',
  [MedicalSpeciality.DENTAL]: 'Odontología',
  [MedicalSpeciality.GENERAL]: 'Medicina General',
};

const formatPrintDate = (): string => {
  return new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatControlDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatBirthDate = (isoString?: string): string => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// El audiograma vive en su propia entidad Study (payload AudiometriaTonalPayload,
// anidado por oído, claves = frecuencia, valores = umbral en dB HL como string).
// Antes se guardaba disfrazado de MedicalControl.findings.audiogram — esa forma
// legacy se soporta como fallback para registros creados antes de esta migración.
const parseThreshold = (value: string | undefined): number | null => {
  if (value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const buildAudiogramRows = (audiogramData: AudiometriaTonalPayload): PdfReportAudiogramRow[] => {
  return AUDIOLOGY_AUDIOGRAM_FREQUENCIES.map((frequency) => ({
    frequency,
    thresholdRight: parseThreshold(audiogramData.OD?.[frequency]),
    thresholdLeft: parseThreshold(audiogramData.OI?.[frequency]),
  }));
};

// Fallback: MedicalControl creado antes de que el audiograma pasara a Study.
const extractLegacyAudiogramRows = (
  findings: Record<string, unknown>,
): PdfReportAudiogramRow[] | undefined => {
  const audiogramData = findings.audiogram as AudiometriaTonalPayload | undefined;
  if (!audiogramData) return undefined;
  return buildAudiogramRows(audiogramData);
};

// Construye el mapa de findings para mostrar en la tabla key-value
const buildFindingsMap = (
  findings: Record<string, unknown>,
): Record<string, string | boolean | number> => {
  const result: Record<string, string | boolean | number> = {};
  for (const [key, value] of Object.entries(findings)) {
    if (key === 'audiogram') continue; // audiograma va en su sección propia (legacy)
    if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
      result[key] = value;
    }
  }
  return result;
};

export interface UsePdfReportResult {
  pdfProps: PdfReportProps | null;
  isLoading: boolean;
  isError: boolean;
}

export function usePdfReport(controlUuid: string, patientUuid: string): UsePdfReportResult {
  const { data: controlRaw, isLoading: isLoadingControl, isError: isErrorControl } =
    useControlDetailQuery(controlUuid);

  const { data: patientRaw, isLoading: isLoadingPatient, isError: isErrorPatient } =
    usePatientDetailQuery(patientUuid);

  const { data: studiesRaw, isLoading: isLoadingStudies } = useStudiesByPatientQuery(patientUuid);

  const { tenant, user } = useSession();

  const pdfProps = useMemo<PdfReportProps | null>(() => {
    if (!controlRaw || !patientRaw) return null;

    const findings = controlRaw.clinicalData.findings as Record<string, unknown>;
    const speciality = controlRaw.header.speciality;

    const encounterUuid = controlRaw.header.encounterUuid;
    const audiometryStudy = (studiesRaw ?? []).find(
      (study) => study.tipo === StudyType.AUDIOMETRIA_TONAL && !!encounterUuid && study.encounterUuid === encounterUuid,
    );

    const audiogram =
      speciality === MedicalSpeciality.AUDIOLOGY
        ? audiometryStudy
          ? buildAudiogramRows(audiometryStudy.payload as unknown as AudiometriaTonalPayload)
          : extractLegacyAudiogramRows(findings)
        : undefined;

    const followUpRaw = (controlRaw as unknown as { followUp?: { hasFollowUp?: boolean; tentativeDate?: string | null; notes?: string } }).followUp;

    return {
      institutionName: tenant?.businessName?.toUpperCase() ?? 'INSTITUCIÓN MÉDICA',
      specialistName: user?.fullName ? `DR. ${user.fullName.toUpperCase()}` : 'ESPECIALISTA',
      printDate: formatPrintDate(),
      logoUrl: tenant?.logoUrl ?? undefined,
      signatureUrl: user?.signatureUrl ?? undefined,

      patient: {
        fullName: `${patientRaw.firstName} ${patientRaw.lastName}`.toUpperCase(),
        documentId: patientRaw.uuid.split('-')[0].toUpperCase(),
        birthDate: formatBirthDate(patientRaw.birthDate),
        phone: patientRaw.phone ?? '—',
      },

      controlDate: formatControlDate(controlRaw.createdAt),
      speciality: SPECIALITY_LABELS[speciality] ?? speciality,
      controlNumber: controlRaw.uuid.split('-')[0].toUpperCase(),

      findings: buildFindingsMap(findings),
      diagnosis: controlRaw.clinicalData.diagnosis,

      audiogram,

      followUp:
        followUpRaw?.hasFollowUp && followUpRaw.tentativeDate
          ? {
              tentativeDate: followUpRaw.tentativeDate,
              notes: followUpRaw.notes ?? '',
            }
          : undefined,
    };
  }, [controlRaw, patientRaw, studiesRaw, tenant, user]);

  return {
    pdfProps,
    isLoading: isLoadingControl || isLoadingPatient || isLoadingStudies,
    isError: isErrorControl || isErrorPatient,
  };
}
