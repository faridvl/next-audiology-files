// src/types/pdf/report.types.ts
// Tipos para el reporte PDF de control médico (P2-8)

export interface PdfReportPatient {
  fullName: string;
  documentId: string;
  birthDate: string;
  phone: string;
}

export interface PdfReportAudiogramRow {
  frequency: number; // Hz
  thresholdRight: number | null;
  thresholdLeft: number | null;
}

export interface PdfReportFollowUp {
  tentativeDate: string;
  notes: string;
}

export interface PdfReportProps {
  // Header
  institutionName: string;
  specialistName: string;
  printDate: string;

  // Paciente
  patient: PdfReportPatient;

  // Control
  controlDate: string;
  speciality: string;
  controlNumber: string; // uuid truncado

  // Hallazgos: tabla key-value dinámica
  findings: Record<string, string | boolean | number>;

  // Diagnóstico
  diagnosis: string;

  // Audiograma (solo si speciality === AUDIOLOGY)
  audiogram?: PdfReportAudiogramRow[];

  // Seguimiento
  followUp?: PdfReportFollowUp;
}
