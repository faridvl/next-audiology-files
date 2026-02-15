import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import {
  Plus,
  UserPlus,
  CalendarPlus,
  Activity,
  Archive,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';

const Dashboard: React.FC = () => {
  const nav = useNavigation();
  const userName = "Farid"; // Esto vendría de tu auth context

  return (
    <>
      <Head><title>Inicio | AudiologyFiles</title></Head>
      <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title="Panel de Control">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* COLUMNA IZQUIERDA: Bienvenida y Agenda (8/12) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Cabecera de Bienvenida Dinámica */}
            <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Sparkles size={18} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Resumen diario</span>
                </div>
                <Typography variant={TypographyVariant.SUBTITLE} className="text-3xl font-black text-slate-800">
                  ¡Bienvenido, Dr. {userName}!
                </Typography>
                <p className="text-slate-400 mt-1 font-medium">
                  Tienes <span className="text-blue-600 font-bold">8 citas</span> programadas para hoy, lunes 15 de febrero.
                </p>
              </div>
              {/* Decoración sutil de fondo */}
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-50/50 rounded-full blur-3xl" />
            </div>

            {/* Lista de Agenda */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <Typography variant={TypographyVariant.BODY_BOLD} className="text-slate-500 uppercase text-[11px] tracking-widest">
                  Próximas Citas
                </Typography>
                <button onClick={() => nav.appointments.list()} className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  VER TODA LA AGENDA
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                {[
                  { time: '09:00', patient: 'Mariana Sosa', desc: 'Audiometría Tonal', status: 'En espera' },
                  { time: '10:15', patient: 'Roberto Castro', desc: 'Control de Audífonos', status: 'Confirmado' },
                  { time: '11:30', patient: 'Lucía Méndez', desc: 'Evaluación Inicial', status: 'Confirmado' },
                ].map((cita, i) => (
                  <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-50/40 transition-all cursor-pointer">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm font-black text-slate-800">{cita.time}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">AM</p>
                      </div>
                      <div className="h-10 w-[3px] bg-slate-100 rounded-full group-hover:bg-blue-500 transition-colors" />
                      <div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{cita.patient}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{cita.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Acciones Rápidas (4/12) */}
          <div className="lg:col-span-4 space-y-6 lg:pt-4">
            <Typography variant={TypographyVariant.BODY_BOLD} className="text-slate-400 uppercase text-[11px] tracking-[0.15em] ml-4">
              Acceso Rápido
            </Typography>

            <div className="grid grid-cols-1 gap-4">
              <QuickLink
                icon={<UserPlus size={20} />}
                title="Nuevo Paciente"
                desc="Alta de expediente clínico"
                onClick={() => nav.patients.create()}
              />
              <QuickLink
                icon={<CalendarPlus size={20} />}
                title="Agendar Cita"
                desc="Asignar espacio en agenda"
                onClick={() => nav.appointments.create()}
              />
              <QuickLink
                icon={<Activity size={20} />}
                title="Realizar Prueba"
                desc="Iniciar nuevo estudio"
                onClick={() => nav.tests()}
              />
              <QuickLink
                icon={<Archive size={20} />}
                title="Inventario"
                desc="Consultar stock disponible"
                onClick={() => nav.inventory()}
              />
            </div>

            {/* Botón flotante de ayuda o feedback opcional */}
            <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed">
                ¿Necesitas ayuda con el sistema?
              </p>
              <button className="mt-2 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors">
                Contactar Soporte
              </button>
            </div>
          </div>

        </div>
      </DashboardLayout>
    </>
  );
};

const QuickLink = ({ icon, title, desc, onClick }: any) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 w-full p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/40 transition-all group text-left"
  >
    <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-sm font-black text-slate-700 group-hover:text-slate-900 transition-colors">
        {title}
      </p>
      <p className="text-[10px] text-slate-400 font-medium">
        {desc}
      </p>
    </div>
  </button>
);

export const getServerSideProps = authorizeServerSidePage();
export default Dashboard;