import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';
import { ChevronLeft, ChevronRight, Wrench, Phone, Calendar, ArrowLeft, ChevronDown, ChevronUp, User, ClipboardList } from 'lucide-react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useUpcomingMaintenanceQuery } from '@/shared/api/querys/maintenance-query';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useNavigation } from '@/hooks/use-navigation';
import { MaintenanceEntity } from '@/types/maintenance/maintenance.types';

function formatMonth(isoMonth: string) {
  const [year, month] = isoMonth.split('-');
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });
}

function navigateMonth(current: string, delta: number): string {
  const [year, month] = current.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function MaintenanceRow({ record }: { record: MaintenanceEntity }) {
  const { data: patient } = usePatientDetailQuery(record.patientUuid);
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 hover:border-warning/30 hover:bg-neutral-50/50 transition-all text-left group"
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-warning/10 rounded-xl flex items-center justify-center shrink-0">
            <Wrench size={18} className="text-warning" />
          </div>
          <div>
            <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800 group-hover:text-warning transition-colors">
              {patient ? `${patient.firstName} ${patient.lastName}` : record.patientUuid}
            </Typography>
            {patient?.phone && (
              <div className="flex items-center gap-1 mt-0.5">
                <Phone size={10} className="text-neutral-400" />
                <Typography variant={TypographyVariant.CAPTION} className="text-[11px] text-neutral-400">
                  {patient.phone}
                </Typography>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            {record.nextMaintenanceAt && (
              <div className="flex items-center gap-1.5 justify-end">
                <Calendar size={12} className="text-warning" />
                <Typography variant={TypographyVariant.CAPTION} className="text-[11px] font-bold text-warning">
                  {formatDate(record.nextMaintenanceAt)}
                </Typography>
              </div>
            )}
            <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1 max-w-[180px]">
              {record.description}
            </Typography>
          </div>
          {isExpanded
            ? <ChevronUp size={14} className="text-neutral-400 shrink-0" />
            : <ChevronDown size={14} className="text-neutral-300 group-hover:text-warning transition-colors shrink-0" />
          }
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-neutral-100 px-5 py-4 space-y-3 bg-neutral-50/50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Typography variant={TypographyVariant.OVERLINE} className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">
                Fecha realizada
              </Typography>
              <Typography variant={TypographyVariant.BODY} className="text-sm text-neutral-700 font-semibold">
                {formatDate(record.performedAt)}
              </Typography>
            </div>
            {record.nextMaintenanceAt && (
              <div>
                <Typography variant={TypographyVariant.OVERLINE} className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">
                  Próximo mantenimiento
                </Typography>
                <Typography variant={TypographyVariant.BODY} className="text-sm text-warning font-semibold">
                  {formatDate(record.nextMaintenanceAt)}
                </Typography>
              </div>
            )}
          </div>
          <div>
            <Typography variant={TypographyVariant.OVERLINE} className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">
              Descripción
            </Typography>
            <Typography variant={TypographyVariant.BODY} className="text-sm text-neutral-700">
              {record.description}
            </Typography>
          </div>
          {record.performedBy && (
            <div className="flex items-center gap-2">
              <User size={12} className="text-neutral-400" />
              <Typography variant={TypographyVariant.CAPTION} className="text-[11px] text-neutral-400">
                Realizado por: {record.performedBy}
              </Typography>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => navigation.patients.detail(record.patientUuid)}
              className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-primary text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all"
            >
              <ClipboardList size={12} /> Ver ficha del paciente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const MaintenancePage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const todayMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(todayMonth);

  const fromPatientUuid = typeof router.query.fromPatient === 'string' ? router.query.fromPatient : null;

  const { data: records, isLoading } = useUpcomingMaintenanceQuery(month);

  return (
    <>
      <Head>
        <title>{t(TEXT.MAINTENANCE.PAGE_TITLE)}</title>
      </Head>
      <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title={t(TEXT.MAINTENANCE.TITLE)}>
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">

          {/* BOTÓN VOLVER AL PACIENTE */}
          {fromPatientUuid && (
            <button
              onClick={() => navigation.patients.detail(fromPatientUuid)}
              className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 font-black text-[10px] uppercase tracking-widest transition-all"
            >
              <ArrowLeft size={14} /> {t(TEXT.MAINTENANCE.BACK_TO_PATIENT)}
            </button>
          )}

          {/* SELECTOR DE MES */}
          <div className="bg-white border border-neutral-100 rounded-app-md p-4 flex items-center justify-between">
            <button
              onClick={() => setMonth((previous) => navigateMonth(previous, -1))}
              className="w-9 h-9 rounded-xl bg-neutral-50 hover:bg-neutral-100 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={16} className="text-neutral-500" />
            </button>
            <Typography variant={TypographyVariant.SUBTITLE} className="capitalize text-neutral-800">
              {formatMonth(month)}
            </Typography>
            <button
              onClick={() => setMonth((previous) => navigateMonth(previous, 1))}
              className="w-9 h-9 rounded-xl bg-neutral-50 hover:bg-neutral-100 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={16} className="text-neutral-500" />
            </button>
          </div>

          {/* LISTA */}
          {isLoading ? (
            <p className="text-center text-neutral-400 font-bold uppercase tracking-widest text-xs animate-pulse py-12">
              {t(TEXT.MAINTENANCE.LOADING)}
            </p>
          ) : !records?.length ? (
            <div className="py-16 text-center border-2 border-dashed border-neutral-100 rounded-app-xl">
              <Wrench size={32} className="text-neutral-200 mx-auto mb-3" />
              <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-400 text-sm">
                {t(TEXT.MAINTENANCE.EMPTY)}
              </Typography>
            </div>
          ) : (
            <div className="space-y-3">
              <Typography variant={TypographyVariant.CAPTION} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">
                {records.length} {records.length === 1 ? t(TEXT.MAINTENANCE.PATIENT_SINGULAR) : t(TEXT.MAINTENANCE.PATIENT_PLURAL)}
              </Typography>
              {records.map((record: MaintenanceEntity) => (
                <MaintenanceRow key={record.uuid} record={record} />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();

export default MaintenancePage;
