import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useCreateMaintenanceMutation } from '@/shared/api/mutations/maintenance/create-maintenance-mutation';
import { FETCH_ENCOUNTER_KEY } from '@/shared/api/querys/encounters-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';

interface Props {
  patientUuid: string;
  encounterUuid: string;
}

const inputClass = 'w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/30 text-sm outline-none focus:bg-white focus:border-warning/40 transition-colors';
const textareaClass = `${inputClass} resize-none`;

export const ConsultaMantenimientoContainer: React.FC<Props> = ({ patientUuid, encounterUuid }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
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
      toast.error(t(TEXT.CONSULTA.MAINTENANCE.DESCRIPTION_REQUIRED));
      return;
    }

    executeCreateMaintenance(
      {
        patientUuid,
        description,
        encounterUuid,
        ...(nextMaintenanceAt ? { nextMaintenanceAt: new Date(nextMaintenanceAt).toISOString() } : {}),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [FETCH_ENCOUNTER_KEY, encounterUuid] });
          toast.success(t(TEXT.CONSULTA.MAINTENANCE.SAVE_SUCCESS));
          navigation.patients.consulta(patientUuid);
        },
        onError: () => toast.error(t(TEXT.CONSULTA.MAINTENANCE.SAVE_ERROR)),
      },
    );
  }

  const quickDates = [
    { label: t(TEXT.CONSULTA.MAINTENANCE.PLUS_1_MONTH), days: 30 },
    { label: t(TEXT.CONSULTA.MAINTENANCE.PLUS_3_MONTHS), days: 90 },
    { label: t(TEXT.CONSULTA.MAINTENANCE.PLUS_6_MONTHS), days: 180 },
  ];

  return (
    <div className="p-4 md:p-6 pb-24 space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigation.patients.consulta(patientUuid)}
          className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors shrink-0"
        >
          <ArrowLeft size={16} className="text-neutral-500" />
        </button>
        <div>
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-warning">
            {t(TEXT.CONSULTA.MAINTENANCE.BREADCRUMB)}
          </Typography>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-neutral-800 leading-tight">
            {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
          </Typography>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-app-md p-5 md:p-8 space-y-6 shadow-sm">

        <div className="space-y-2">
          <Typography variant={TypographyVariant.OVERLINE} as="label" className="block ml-1">
            {t(TEXT.CONSULTA.MAINTENANCE.DESCRIPTION_LABEL)} <Typography variant={TypographyVariant.OVERLINE} inline className="text-danger">*</Typography>
          </Typography>
          <textarea
            className={`${textareaClass} min-h-[140px]`}
            placeholder={t(TEXT.CONSULTA.MAINTENANCE.DESCRIPTION_PLACEHOLDER)}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Typography variant={TypographyVariant.OVERLINE} as="label" className="block ml-1">
            {t(TEXT.CONSULTA.MAINTENANCE.NEXT_MAINTENANCE)}
          </Typography>
          <div className="flex flex-wrap gap-2">
            {quickDates.map(({ label, days }) => (
              <button
                key={days}
                type="button"
                onClick={() => setQuickDate(days)}
                className="px-4 py-2 bg-warning/10 border border-warning/30 rounded-app-sm text-[10px] font-bold text-warning hover:bg-warning/20 transition-all"
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
            <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400 ml-1">
              {t(TEXT.CONSULTA.MAINTENANCE.NEXT_LABEL)}{' '}
              {new Date(nextMaintenanceAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            </Typography>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant={ButtonVariant.CANCEL} onClick={() => navigation.patients.consulta(patientUuid)} text={t(TEXT.GENERAL.BUTTONS.CANCEL)} />
        <Button
          variant={ButtonVariant.PRIMARY}
          className="!h-12 !px-10 !rounded-xl shadow-lg shadow-warning/20"
          onClick={handleSave}
          disabled={isPending}
        >
          <Save size={16} className="mr-2" />
          {isPending ? t(TEXT.CONSULTA.MAINTENANCE.SAVING) : t(TEXT.CONSULTA.MAINTENANCE.SAVE)}
        </Button>
      </div>
    </div>
  );
};
