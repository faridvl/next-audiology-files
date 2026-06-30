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
  blue: 'bg-primary-soft text-primary',
  indigo: 'bg-accent/10 text-accent',
  emerald: 'bg-success/10 text-success-dark',
  teal: 'bg-success/10 text-success',
  amber: 'bg-warning/10 text-warning',
  rose: 'bg-danger/10 text-danger',
  violet: 'bg-accent/10 text-accent',
};

const DEFAULT_COLOR = 'bg-neutral-50 text-neutral-600';

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
          <Typography variant={TypographyVariant.HEADER} className="text-2xl font-black text-neutral-900">
            Tipos de Cita
          </Typography>
          <Typography variant={TypographyVariant.HELPER} className="text-sm text-neutral-500 font-medium">
            Administra los tipos de cita disponibles para tu clínica.
          </Typography>
        </div>
        <div className="flex gap-2">
          <div className="relative group min-w-[250px]">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-neutral-200 rounded-app-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm text-sm"
            />
          </div>
          <Button
            variant={ButtonVariant.PRIMARY}
            className="rounded-app-sm h-10 px-4 bg-neutral-900 shadow-lg shadow-neutral-200 border-none hover:bg-neutral-800 text-sm"
            onClick={navigation.appointmentType.create}
          >
            <Plus size={18} className="mr-1.5" /> Nuevo
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-app-xl p-5 border border-neutral-100 h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((type: AppointmentType) => {
            const colorClass = type.color ? (COLOR_CLASSES[type.color] ?? DEFAULT_COLOR) : DEFAULT_COLOR;
            return (
              <div
                key={type.uuid}
                className="group bg-white rounded-app-xl p-5 border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-500 relative flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-app-md ${colorClass} group-hover:scale-110 transition-transform duration-500`}>
                    <Stethoscope size={20} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5 bg-success/10 text-success-dark px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-success/20">
                      <CheckCircle2 size={9} /> Activo
                    </span>
                    <button className="p-1.5 text-neutral-300 hover:bg-neutral-50 hover:text-neutral-600 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <Typography
                    variant={TypographyVariant.BODY_BOLD}
                    className="text-lg text-neutral-900 group-hover:text-primary transition-colors"
                  >
                    {type.name}
                  </Typography>
                </div>

                {type.duration && (
                  <div className="mt-6 pt-4 border-t border-neutral-50 flex items-center gap-1 text-neutral-500">
                    <Clock size={14} className="text-neutral-400" />
                    <span className="text-xs font-bold uppercase tracking-tighter">{type.duration} min</span>
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={navigation.appointmentType.create}
            className="border-2 border-dashed border-neutral-200 rounded-app-xl p-6 flex flex-col items-center justify-center gap-3 text-neutral-400 hover:border-primary/40 hover:bg-primary-soft/50 hover:text-primary transition-all group min-h-[220px]"
          >
            <div className="w-14 h-14 rounded-app-md bg-neutral-50 flex items-center justify-center group-hover:bg-primary-soft group-hover:scale-110 transition-all duration-500">
              <Plus size={28} />
            </div>
            <div className="text-center">
              <p className="font-black text-sm uppercase tracking-widest">Nuevo Tipo de Cita</p>
              <p className="text-xs opacity-60">Agregar al catálogo</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
