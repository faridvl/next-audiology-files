// src/components/pdf/pdf-download-button.tsx
// Botón de descarga PDF — usa PDFDownloadLink de @react-pdf/renderer.
// Debe cargarse solo en el cliente (sin SSR) porque @react-pdf/renderer
// accede a APIs del navegador. Se importa vía dynamic() desde la página.

import React from 'react';
import dynamic from 'next/dynamic';
import { Download } from 'lucide-react';
import { usePdfReport } from './use-pdf-report';

// PDFDownloadLink solo funciona en el cliente
const PDFDownloadLinkDynamic = dynamic(
  () => import('@react-pdf/renderer').then((module) => module.PDFDownloadLink),
  { ssr: false },
);

// MedicalControlReport también solo en cliente
const MedicalControlReportDynamic = dynamic(
  () =>
    import('./medical-control-report').then((module) => module.MedicalControlReport),
  { ssr: false },
);

interface Props {
  controlUuid: string;
  patientUuid: string;
}

export const PdfDownloadButton: React.FC<Props> = ({ controlUuid, patientUuid }) => {
  const { pdfProps, isLoading, isError } = usePdfReport(controlUuid, patientUuid);

  if (isLoading || !pdfProps) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold uppercase tracking-widest cursor-not-allowed"
      >
        <Download size={14} />
        {isLoading ? 'Preparando PDF...' : 'PDF no disponible'}
      </button>
    );
  }

  if (isError) {
    return null;
  }

  const fileName = `control-${pdfProps.patient.fullName.replace(/\s+/g, '-').toLowerCase()}-${pdfProps.controlNumber}.pdf`;

  return (
    <PDFDownloadLinkDynamic
      document={<MedicalControlReportDynamic {...pdfProps} />}
      fileName={fileName}
    >
      {({ loading }: { loading: boolean }) => (
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-60"
          disabled={loading}
        >
          <Download size={14} />
          {loading ? 'Generando...' : 'Descargar reporte PDF'}
        </button>
      )}
    </PDFDownloadLinkDynamic>
  );
};
