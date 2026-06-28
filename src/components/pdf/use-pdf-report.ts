// src/components/pdf/use-pdf-report.ts
// Hook que construye los props del PDF de reporte de control médico (P2-8)

import { useMemo } from 'react';
import { useControlDetailQuery } from '@/shared/api/querys/get-medical-controls-query';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useSession } from '@/hooks/use-session';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
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

// Extrae filas del audiograma si existen en los findings de audiología
const extractAudiogramRows = (
  findings: Record<string, unknown>,
): PdfReportAudiogramRow[] | undefined => {
  const audiogramData = findings.audiogram as Record<string, unknown> | undefined;
  if (!audiogramData) return undefined;

  return AUDIOLOGY_AUDIOGRAM_FREQUENCIES.map((frequency) => {
    const rightKey = `right_${frequency}`;
    const leftKey = `left_${frequency}`;
    const thresholdRight =
      typeof audiogramData[rightKey] === 'number'
        ? (audiogramData[rightKey] as number)
        : null;
    const thresholdLeft =
      typeof audiogramData[leftKey] === 'number'
        ? (audiogramData[leftKey] as number)
        : null;
    return { frequency, thresholdRight, thresholdLeft };
  });
};

// Construye el mapa de findings para mostrar en la tabla key-value
const buildFindingsMap = (
  findings: Record<string, unknown>,
): Record<string, string | boolean | number> => {
  const result: Record<string, string | boolean | number> = {};
  for (const [key, value] of Object.entries(findings)) {
    if (key === 'audiogram') continue; // audiograma va en su sección propia
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

  const { tenant, user } = useSession();

  const pdfProps = useMemo<PdfReportProps | null>(() => {
    if (!controlRaw || !patientRaw) return null;

    const findings = controlRaw.clinicalData.findings as Record<string, unknown>;
    const speciality = controlRaw.header.speciality;

    const audiogram =
      speciality === MedicalSpeciality.AUDIOLOGY
        ? extractAudiogramRows(findings)
        : undefined;

    const followUpRaw = (controlRaw as unknown as { followUp?: { hasFollowUp?: boolean; tentativeDate?: string | null; notes?: string } }).followUp;

    return {
      institutionName: tenant?.businessName?.toUpperCase() ?? 'INSTITUCIÓN MÉDICA',
      specialistName: user?.fullName ? `DR. ${user.fullName.toUpperCase()}` : 'ESPECIALISTA',
      printDate: formatPrintDate(),

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
  }, [controlRaw, patientRaw, tenant, user]);

  return {
    pdfProps,
    isLoading: isLoadingControl || isLoadingPatient,
    isError: isErrorControl || isErrorPatient,
  };
}
