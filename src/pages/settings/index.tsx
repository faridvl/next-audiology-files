import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import {
  User,
  Building2,
  CreditCard,
  Bell,
  ShieldCheck,
  ExternalLink,
  Plus
} from 'lucide-react';


const SettingSection = ({ title, description, children }: any) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 border-b border-slate-100 last:border-0">
    <div className="lg:col-span-1">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
    <div className="lg:col-span-2 space-y-4">
      {children}
    </div>
  </div>
);

const InputGroup = ({ label, placeholder, type = "text", defaultValue }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
    />
  </div>
);

const Settings: React.FC = () => {
  return (
    <>
      <Head><title>Configuración </title></Head>

      <DashboardLayout
        isMainPage
        contentStyle={BoxedLayoutStyle.FULL}
        title={"Configuración del Sistema"}
      >
        <div className="max-w-5xl mx-auto pb-20">

          {/* SECCIÓN 1: PERFIL DEL ESPECIALISTA */}
          <SettingSection
            title="Perfil Personal"
            description="Gestiona tu información pública y credenciales de acceso como especialista."
          >
            <div className="flex items-center gap-6 mb-4 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
              <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-200">
                FV
              </div>
              <div>
                <button className="text-xs font-black text-blue-600 hover:underline">Cambiar foto de perfil</button>
                <p className="text-[10px] text-slate-400 mt-1">JPG o PNG. Máximo 1MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Nombre Completo" defaultValue="Farid Villacis" />
              <InputGroup label="Correo Electrónico" defaultValue="farid@ejemplo.com" />
            </div>
          </SettingSection>

          {/* SECCIÓN 2: DATOS DEL NEGOCIO / CLÍNICA */}
          <SettingSection
            title="Información de la Clínica"
            description="Datos legales y comerciales que aparecerán en tus reportes y facturas."
          >
            <div className="space-y-4">
              <InputGroup label="Nombre de la Clínica" placeholder="Ej: Centro Auditivo Integral" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="ID Fiscal / RUC" placeholder="0999999999001" />
                <InputGroup label="Teléfono de Contacto" placeholder="+593 ..." />
              </div>
              <InputGroup label="Dirección Física" placeholder="Av. Principal y Calle Secundaria" />
            </div>
          </SettingSection>

          {/* SECCIÓN 3: PLAN Y PAGOS (SaaS Logic) */}
          <SettingSection
            title="Suscripción y Facturación"
            description="Controla tu plan actual, métodos de pago e historial de facturación."
          >
            {/* Card de Plan Actual */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black bg-blue-500 px-2 py-1 rounded-md uppercase mb-2 inline-block">Plan Profesional</span>
                    <h4 className="text-2xl font-black">$49.00 <span className="text-sm font-normal text-slate-400">/ mes</span></h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Próximo cobro</p>
                    <p className="text-sm font-bold text-emerald-400">14 de Marzo, 2026</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck size={120} />
              </div>
            </div>

            {/* Métodos de Pago */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Método de Pago</label>
              <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-7 bg-slate-100 rounded md flex items-center justify-center font-bold text-[8px] text-slate-400 border border-slate-200">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">•••• •••• •••• 4242</p>
                    <p className="text-[10px] text-slate-400 font-medium">Expira en 12/28</p>
                  </div>
                </div>
                <button className="text-xs font-black text-blue-600 hover:text-blue-700">Editar</button>
              </div>

              <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2 text-xs font-bold">
                <Plus size={16} /> Agregar nuevo método de pago
              </button>
            </div>

            <div className="pt-4">
              <button className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
                <ExternalLink size={14} /> Ver historial de facturas
              </button>
            </div>
          </SettingSection>

          {/* Botones de Acción Final */}
          <div className="flex justify-end gap-3 pt-10">
            <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all">
              Descartar cambios
            </button>
            <button className="px-8 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
              Guardar Configuración
            </button>
          </div>

        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();

export default Settings;