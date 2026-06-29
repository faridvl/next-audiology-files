// Este archivo debe importarse exclusivamente vía dynamic({ ssr: false }) desde el padre.
// No usar dynamic() internamente — react-pdf renderiza `document` en su propio renderer
// y los chunks dinámicos sin resolver causan "useSyncExternalStore is not a function".

import React, { useEffect, useState } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { usePdfReport } from './use-pdf-report';
import { MedicalControlReport } from './medical-control-report';

interface Props {
  controlUuid: string;
  patientUuid: string;
}

export const PdfDownloadButton: React.FC<Props> = ({ controlUuid, patientUuid }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const { pdfProps, isLoading, isError } = usePdfReport(controlUuid, patientUuid);

  if (!isMounted) return null;

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
    <BlobProvider document={<MedicalControlReport {...pdfProps} />}>
      {({ url, loading }) => (
        <a
          href={url ?? undefined}
          download={fileName}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
            loading || !url
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Download size={14} />
          {loading ? 'Generando...' : 'Descargar reporte PDF'}
        </a>
      )}
    </BlobProvider>
  );
};
