import React, { useState } from 'react';
import Head from 'next/head';
import { ChevronLeft, ChevronRight, Wrench, Phone, Calendar } from 'lucide-react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useUpcomingMaintenanceQuery } from '@/shared/api/querys/maintenance-query';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
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

function MaintenanceRow({ record }: { record: MaintenanceEntity }) {
  const { data: patient } = usePatientDetailQuery(record.patientUuid);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-amber-200 transition-all">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
          <Wrench size={18} className="text-amber-500" />
        </div>
        <div>
          <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-slate-800">
            {patient ? `${patient.firstName} ${patient.lastName}` : record.patientUuid}
          </Typography>
          {patient?.phone && (
            <div className="flex items-center gap-1 mt-0.5">
              <Phone size={10} className="text-slate-400" />
              <Typography variant={TypographyVariant.CAPTION} className="text-[11px] text-slate-400">
                {patient.phone}
              </Typography>
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        {record.nextMaintenanceAt && (
          <div className="flex items-center gap-1.5 justify-end">
            <Calendar size={12} className="text-amber-500" />
            <Typography variant={TypographyVariant.CAPTION} className="text-[11px] font-bold text-amber-600">
              {new Date(record.nextMaintenanceAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Typography>
          </div>
        )}
        <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-[180px]">
          {record.description}
        </Typography>
      </div>
    </div>
  );
}

const MaintenancePage: React.FC = () => {
  const todayMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(todayMonth);

  const { data: records, isLoading } = useUpcomingMaintenanceQuery(month);

  return (
    <>
      <Head>
        <title>Mantenimientos — Zynka</title>
      </Head>
      <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title="Mantenimientos">
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-500">

          {/* SELECTOR DE MES */}
          <div className="bg-white border border-slate-100 rounded-[1.8rem] p-4 flex items-center justify-between">
            <button
              onClick={() => setMonth((previous) => navigateMonth(previous, -1))}
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={16} className="text-slate-500" />
            </button>
            <Typography variant={TypographyVariant.SUBTITLE} className="capitalize text-slate-800">
              {formatMonth(month)}
            </Typography>
            <button
              onClick={() => setMonth((previous) => navigateMonth(previous, 1))}
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={16} className="text-slate-500" />
            </button>
          </div>

          {/* LISTA */}
          {isLoading ? (
            <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse py-12">
              Cargando mantenimientos...
            </p>
          ) : !records?.length ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
              <Wrench size={32} className="text-slate-200 mx-auto mb-3" />
              <Typography variant={TypographyVariant.BODY_BOLD} className="text-slate-400 text-sm">
                Sin mantenimientos este mes
              </Typography>
            </div>
          ) : (
            <div className="space-y-3">
              <Typography variant={TypographyVariant.CAPTION} className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {records.length} {records.length === 1 ? 'paciente' : 'pacientes'}
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
