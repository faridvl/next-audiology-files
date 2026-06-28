import React from 'react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

export const ReportTemplateCreateContainer: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <Typography variant={TypographyVariant.SUBTITLE}>Plantillas de Reporte</Typography>
      <Typography variant={TypographyVariant.BODY} textColor="text-slate-400">
        Esta funcionalidad está en desarrollo.
      </Typography>
    </div>
  );
};
