// src/components/pdf/use-pdf-report.ts
// Hook que construye los props del PDF de reporte de control médico (P2-8)

import { useMemo } from 'react';
import { useControlDetailQuery } from '@/shared/api/querys/get-medical-controls-query';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useStudiesByPatientQuery } from '@/shared/api/querys/studies-query';
import { useSession } from '@/hooks/use-session';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { StudyType } from '@/types/studies/study.types';
import { AudiometryThreshold, ConductionRoute, Ear } from '@/types/studies/audiometry.types';
import { parseAudiometryPayload } from '@/shared/utils/audiometry';
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

// El audiograma vive en su propia entidad Study. `parseAudiometryPayload` lee
// tanto los umbrales tipados (vía/enmascaramiento/sin-respuesta) como la forma
// legacy `{OD,OI}`, así que la tabla del PDF sirve a ambos sin migrar datos.
// La tabla del informe muestra solo vía aérea, que es el umbral de referencia.
const buildAudiogramRows = (thresholds: AudiometryThreshold[]): PdfReportAudiogramRow[] => {
  const airThresholds = thresholds.filter((item) => item.route === ConductionRoute.AIR);
  const findDecibels = (frequency: number, ear: Ear): number | null => {
    const match = airThresholds.find((item) => item.frequency === frequency && item.ear === ear);
    if (!match) return null;
    return match.isNoResponse ? null : match.decibels;
  };

  return AUDIOLOGY_AUDIOGRAM_FREQUENCIES.map((frequency) => ({
    frequency,
    thresholdRight: findDecibels(frequency, Ear.RIGHT),
    thresholdLeft: findDecibels(frequency, Ear.LEFT),
  }));
};

// Fallback: MedicalControl creado antes de que el audiograma pasara a Study.
const extractLegacyAudiogramRows = (
  findings: Record<string, unknown>,
): PdfReportAudiogramRow[] | undefined => {
  if (!findings.audiogram) return undefined;
  const thresholds = parseAudiometryPayload(findings.audiogram);
  if (thresholds.length === 0) return undefined;
  return buildAudiogramRows(thresholds);
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
          ? buildAudiogramRows(parseAudiometryPayload(audiometryStudy.payload))
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
