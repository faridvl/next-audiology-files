import React, { useEffect, useState } from 'react';
import { CheckCircle, Stethoscope, Activity, Wrench, FileText, ArrowLeft } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useNavigation } from '@/hooks/use-navigation';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { ConsultaSession, ConsultaSessionStorage } from '@/shared/utils/consulta-session';
import dynamic from 'next/dynamic';

const PdfDownloadButton = dynamic(
  () => import('@/components/pdf/pdf-download-button').then((m) => m.PdfDownloadButton),
  { ssr: false },
);

interface Props {
  patientUuid: string;
}

function ResumenItem({ icon, label, done }: { icon: React.ReactNode; label: string; done: boolean }) {
  if (!done) return null;
  return (
    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
      <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-emerald-800">
          {label}
        </Typography>
      </div>
      <CheckCircle size={16} className="text-emerald-500 shrink-0" />
    </div>
  );
}

export const ConsultaResumenContainer: React.FC<Props> = ({ patientUuid }) => {
  const navigation = useNavigation();
  const { data: patient } = usePatientDetailQuery(patientUuid);
  const [session, setSession] = useState<ConsultaSession | null>(null);

  useEffect(() => {
    setSession(ConsultaSessionStorage.get(patientUuid));
  }, [patientUuid]);

  function handleFinish() {
    ConsultaSessionStorage.clear(patientUuid);
    navigation.patients.detail(patientUuid);
  }

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 pb-24 space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigation.patients.consulta(patientUuid)}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
        >
          <ArrowLeft size={16} className="text-slate-500" />
        </button>
        <div>
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Resumen de consulta
          </Typography>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-slate-800 leading-tight">
            {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
          </Typography>
          <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400 capitalize mt-0.5">
            {today}
          </Typography>
        </div>
      </div>

      {/* ÍCONO DE ÉXITO */}
      <div className="flex flex-col items-center py-6 gap-3">
        <div className="h-16 w-16 bg-emerald-50 rounded-[2rem] flex items-center justify-center border border-emerald-100 shadow-sm">
          <CheckCircle size={32} className="text-emerald-500" />
        </div>
        <Typography variant={TypographyVariant.SUBTITLE} className="text-slate-800 text-center">
          Consulta completada
        </Typography>
        <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 text-xs text-center">
          Todo quedó guardado correctamente
        </Typography>
      </div>

      {/* SECCIONES GUARDADAS */}
      <div className="space-y-3">
        <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
          Lo que se realizó
        </Typography>
        <ResumenItem
          icon={<Stethoscope size={18} />}
          label="Control clínico guardado"
          done={!!session?.savedControlUuid}
        />
        <ResumenItem
          icon={<Activity size={18} />}
          label="Audiograma registrado"
          done={!!session?.savedAudiogram}
        />
        <ResumenItem
          icon={<Wrench size={18} />}
          label="Mantenimiento registrado"
          done={!!session?.savedMaintenanceUuid}
        />
      </div>

      {/* PDF */}
      {session?.savedControlUuid && (
        <div className="pt-2">
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3">
            Documento
          </Typography>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
            <FileText size={18} className="text-slate-400 shrink-0" />
            <div className="flex-1">
              <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-slate-700">
                Reporte de consulta
              </Typography>
              <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400">
                Incluye control clínico y hallazgos
              </Typography>
            </div>
            <PdfDownloadButton controlUuid={session.savedControlUuid} patientUuid={patientUuid} />
          </div>
        </div>
      )}

      {/* FINALIZAR */}
      <div className="pt-2">
        <button
          onClick={handleFinish}
          className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg transition-all text-sm"
        >
          Volver al expediente
        </button>
      </div>
    </div>
  );
};
