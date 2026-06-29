import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useCreateMaintenanceMutation } from '@/shared/api/mutations/maintenance/create-maintenance-mutation';
import { ConsultaSessionStorage } from '@/shared/utils/consulta-session';
import { toast } from 'sonner';

interface Props {
  patientUuid: string;
}

const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-sm outline-none focus:bg-white focus:border-amber-300 transition-colors';

export const ConsultaMantenimientoContainer: React.FC<Props> = ({ patientUuid }) => {
  const navigation = useNavigation();
  const { data: patient } = usePatientDetailQuery(patientUuid);
  const [description, setDescription] = useState('');
  const [nextMaintenanceAt, setNextMaintenanceAt] = useState('');

  const { executeCreateMaintenance, isPending } = useCreateMaintenanceMutation();

  function setQuickDate(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setNextMaintenanceAt(date.toISOString().split('T')[0]);
  }

  function handleSave() {
    if (!description.trim()) {
      toast.error('La descripción del mantenimiento es requerida');
      return;
    }

    executeCreateMaintenance(
      {
        patientUuid,
        description,
        ...(nextMaintenanceAt ? { nextMaintenanceAt: new Date(nextMaintenanceAt).toISOString() } : {}),
      },
      {
        onSuccess: (data) => {
          const saved = data as { uuid: string };
          ConsultaSessionStorage.update(patientUuid, { savedMaintenanceUuid: saved.uuid });
          toast.success('Mantenimiento guardado');
          navigation.patients.consulta(patientUuid);
        },
        onError: () => toast.error('Error al guardar el mantenimiento. Intenta nuevamente.'),
      },
    );
  }

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
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-amber-500">
            Mantenimiento
          </Typography>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-slate-800 leading-tight">
            {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
          </Typography>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[1.8rem] p-5 md:p-8 space-y-6 shadow-sm">

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            ¿Qué se realizó? <span className="text-red-400">*</span>
          </label>
          <textarea
            className={`${inputClass} min-h-[140px]`}
            placeholder="Describe el mantenimiento realizado: limpieza, cambio de filtros, ajuste de volumen, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Próximo mantenimiento
          </label>
          <div className="flex flex-wrap gap-2">
            {[{ label: '+1 Mes', days: 30 }, { label: '+3 Meses', days: 90 }, { label: '+6 Meses', days: 180 }].map(({ label, days }) => (
              <button
                key={days}
                type="button"
                onClick={() => setQuickDate(days)}
                className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-600 hover:bg-amber-100 transition-all"
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={nextMaintenanceAt}
            onChange={(e) => setNextMaintenanceAt(e.target.value)}
            className={inputClass}
          />
          {nextMaintenanceAt && (
            <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400 ml-1">
              Próximo:{' '}
              {new Date(nextMaintenanceAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            </Typography>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant={ButtonVariant.CANCEL} onClick={() => navigation.patients.consulta(patientUuid)} text="Cancelar" />
        <Button
          variant={ButtonVariant.PRIMARY}
          className="!h-12 !px-10 !rounded-xl shadow-lg shadow-amber-200"
          onClick={handleSave}
          disabled={isPending}
        >
          <Save size={16} className="mr-2" />
          {isPending ? 'Guardando...' : 'Guardar mantenimiento'}
        </Button>
      </div>
    </div>
  );
};
