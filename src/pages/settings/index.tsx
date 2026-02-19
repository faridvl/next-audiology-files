import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import {
  Building2, CreditCard, PenTool, Check,
  MapPin, FileText, Globe, Upload
} from 'lucide-react';

const CompactInput = ({ label, defaultValue, placeholder }: any) => (
  <div className="flex flex-col gap-1 w-full">
    <Typography variant={TypographyVariant.OVERLINE} className="ml-1 !text-slate-400 !text-[9px]">
      {label}
    </Typography>
    <input
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-all text-slate-700"
    />
  </div>
);

const SectionHeader = ({ icon: Icon, title }: any) => (
  <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-3">
    <Icon size={16} className="text-[#1E3A8A]" strokeWidth={2.5} />
    <Typography variant={TypographyVariant.OVERLINE} className="!text-slate-900">
      {title}
    </Typography>
  </div>
);

const BusinessSettingsPage: React.FC = () => {
  return (
    <>
      <Head><title>Configuración de Clínica | Zynka</title></Head>
      <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title="Configuración del Negocio">

        <div className="max-w-3xl mx-auto space-y-4 pb-16">

          {/* SECCIÓN 1: IDENTIDAD */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <SectionHeader icon={Building2} title="Identidad Institucional" />

            <div className="flex items-center gap-6 mb-6">
              <div className="h-16 w-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-[#1E3A8A]/40 hover:text-[#1E3A8A] transition-all cursor-pointer group">
                <Upload size={18} />
                <Typography variant={TypographyVariant.CAPTION} className="!text-[8px] font-black uppercase mt-1">Logo</Typography>
              </div>
              <div className="w-full">
                <CompactInput label="Nombre Comercial de la Clínica" defaultValue="Centro Auditivo Integral" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CompactInput label="Razón Social / Nombre Legal" placeholder="Zynka Health S.A." />
              <CompactInput label="ID Fiscal / RUC" placeholder="1790000000001" />
            </div>
          </div>

          {/* SECCIÓN 2: UBICACIÓN */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <SectionHeader icon={MapPin} title="Ubicación y Contacto" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CompactInput label="Ciudad" defaultValue="Quito" />
                <CompactInput label="Teléfono de Contacto" placeholder="+593 ..." />
              </div>
              <CompactInput label="Dirección Física" placeholder="Av. Amazonas y Naciones Unidas, Edificio Signature" />
              <CompactInput label="Sitio Web" placeholder="https://www.tuclinica.com" />
            </div>
          </div>

          {/* SECCIÓN 3: LEGAL */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <SectionHeader icon={FileText} title="Validación y Firmas" />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <CompactInput label="Registro Sanitario / Licencia" placeholder="SESS-00123" />
              <CompactInput label="Correo de Notificaciones" placeholder="admin@clinica.com" />
            </div>

            <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-between bg-slate-50/50 group hover:border-[#1E3A8A]/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <PenTool size={18} className="text-slate-400 group-hover:text-[#1E3A8A]" />
                </div>
                <div>
                  <Typography variant={TypographyVariant.BODY_BOLD} className="!text-slate-700 !text-xs">
                    Firma del Representante
                  </Typography>
                  <Typography variant={TypographyVariant.CAPTION} className="!text-[10px] italic">
                    Para documentos institucionales
                  </Typography>
                </div>
              </div>
              <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl transition-all hover:bg-slate-50 shadow-sm">
                <Typography variant={TypographyVariant.OVERLINE} className="!text-[#1E3A8A] !text-[9px]">
                  Cargar PNG
                </Typography>
              </button>
            </div>
          </div>

          {/* SECCIÓN 4: SUSCRIPCIÓN */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-slate-200">
                <CreditCard size={20} />
              </div>
              <div>
                <Typography variant={TypographyVariant.OVERLINE} className="!text-slate-400 !text-[9px] block">
                  Suscripción SaaS
                </Typography>
                <div className="flex items-center gap-2">
                  <Typography variant={TypographyVariant.BODY_BOLD} className="!text-slate-800">
                    Plan Premium Pro
                  </Typography>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <Typography variant={TypographyVariant.CAPTION} className="!text-emerald-500 font-black uppercase">
                    Activo
                  </Typography>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-slate-100 px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-all">
              <Typography variant={TypographyVariant.OVERLINE} className="!text-slate-600 !text-[10px]">
                Gestionar
              </Typography>
              <Globe size={12} className="text-slate-400" />
            </button>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <button className="px-6 py-2 hover:bg-slate-50 rounded-xl transition-colors">
              <Typography variant={TypographyVariant.OVERLINE} className="!text-slate-400">
                Descartar
              </Typography>
            </button>
            <button className="bg-[#1E3A8A] text-white px-10 py-3.5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-[#152a63] hover:-translate-y-0.5 transition-all flex items-center gap-3">
              <Check size={16} strokeWidth={3} />
              <Typography variant={TypographyVariant.OVERLINE} className="!text-white">
                Actualizar Clínica
              </Typography>
            </button>
          </div>

        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default BusinessSettingsPage;