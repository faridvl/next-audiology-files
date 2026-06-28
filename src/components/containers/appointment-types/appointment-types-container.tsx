import React, { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Clock,
  LayoutGrid,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { useAppointmentTypesQuery, AppointmentType } from '@/shared/api/querys/appointment-types-query';

const COLOR_CLASSES: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  violet: 'bg-violet-50 text-violet-600',
};

const DEFAULT_COLOR = 'bg-slate-50 text-slate-600';

export const AppointmentTypesContainer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const { data: appointmentTypes, isLoading } = useAppointmentTypesQuery();

  const filtered = (appointmentTypes ?? []).filter((type: AppointmentType) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full gap-5 p-6 bg-[#F8FAFC]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-0.5">
          <Typography variant={TypographyVariant.HEADER} className="text-2xl font-black text-slate-900">
            Servicios
          </Typography>
          <Typography variant={TypographyVariant.HELPER} className="text-sm text-slate-500 font-medium">
            Administra el catálogo de servicios médicos.
          </Typography>
        </div>
        <div className="flex gap-2">
          <div className="relative group min-w-[250px]">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm text-sm"
            />
          </div>
          <Button
            variant={ButtonVariant.PRIMARY}
            className="rounded-xl h-10 px-4 bg-slate-900 shadow-lg shadow-slate-200 border-none hover:bg-slate-800 text-sm"
            onClick={navigation.appointmentType.create}
          >
            <Plus size={18} className="mr-1.5" /> Nuevo
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-5 border border-slate-100 h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((type: AppointmentType) => {
            const colorClass = type.color ? (COLOR_CLASSES[type.color] ?? DEFAULT_COLOR) : DEFAULT_COLOR;
            return (
              <div
                key={type.uuid}
                className="group bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 relative flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform duration-500`}>
                    <Stethoscope size={20} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-emerald-100">
                      <CheckCircle2 size={9} /> Activo
                    </span>
                    <button className="p-1.5 text-slate-300 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <Typography
                    variant={TypographyVariant.BODY_BOLD}
                    className="text-lg text-slate-900 group-hover:text-blue-600 transition-colors"
                  >
                    {type.name}
                  </Typography>
                </div>

                {type.duration && (
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-1 text-slate-500">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-tighter">{type.duration} min</span>
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={navigation.appointmentType.create}
            className="border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 transition-all group min-h-[220px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
              <Plus size={28} />
            </div>
            <div className="text-center">
              <p className="font-black text-sm uppercase tracking-widest">Nuevo Servicio</p>
              <p className="text-xs opacity-60">Crear configuración médica</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
