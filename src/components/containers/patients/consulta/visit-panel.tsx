import React, { useState } from 'react';
import { X, Stethoscope, Activity, Wrench, CheckCircle, ArrowLeft } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useNavigation } from '@/hooks/use-navigation';
import { useActiveEncounter } from '@/components/containers/patients/consulta/use-active-encounter';
import { useCloseEncounterMutation } from '@/shared/api/mutations/encounters/close-encounter-mutation';
import { ConsultaControlContainer } from '@/components/containers/patients/consulta/consulta-control-container';
import { ConsultaAudiogramaContainer } from '@/components/containers/patients/consulta/consulta-audiograma-container';
import { ConsultaMantenimientoContainer } from '@/components/containers/patients/consulta/consulta-mantenimiento-container';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { StudyType } from '@/types/studies/study.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';

// Una visita es un CONTENEDOR, no una secuencia: nada es obligatorio y no hay
// orden. Por eso el panel muestra las acciones disponibles y lo ya registrado,
// en vez de un wizard de pasos (antes: hub + 4 páginas separadas).
export enum VisitAction {
  CLINICAL_NOTE = 'CLINICAL_NOTE',
  AUDIOGRAM = 'AUDIOGRAM',
  MAINTENANCE = 'MAINTENANCE',
}

interface Props {
  patientUuid: string;
  speciality: MedicalSpeciality;
  isAudiologyTenant: boolean;
  onClose: () => void;
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  isDone: boolean;
  doneLabel: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, isDone, doneLabel, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-4 rounded-app-md border text-left transition-all ${
      isDone
        ? 'bg-success/10 border-success/30 hover:border-success/50'
        : 'bg-white border-neutral-200 hover:border-primary/40 hover:shadow-sm'
    }`}
  >
    <div className={`h-9 w-9 rounded-app-sm flex items-center justify-center shrink-0 ${isDone ? 'bg-success/20 text-success-dark' : 'bg-neutral-50 text-neutral-500'}`}>
      {isDone ? <CheckCircle size={17} /> : icon}
    </div>
    <div className="flex-1 min-w-0">
      <Typography variant={TypographyVariant.BODY_BOLD} className={`text-sm ${isDone ? 'text-success-dark' : 'text-neutral-800'}`}>
        {label}
      </Typography>
      {isDone && (
        <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-success">
          {doneLabel}
        </Typography>
      )}
    </div>
  </button>
);

export const VisitPanel: React.FC<Props> = ({ patientUuid, speciality, isAudiologyTenant, onClose }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [activeAction, setActiveAction] = useState<VisitAction | null>(null);

  const { encounterUuid, encounterDetail, isLoading } = useActiveEncounter(patientUuid, speciality);
  const { executeCloseEncounter, isPending: isClosing } = useCloseEncounterMutation();

  const savedControl = encounterDetail?.medicalControls[0];
  const savedAudiogram = encounterDetail?.studies.find((study) => study.tipo === StudyType.AUDIOMETRIA_TONAL);
  const savedMaintenance = encounterDetail?.maintenances[0];
  const hasSomethingSaved = !!savedControl || !!savedAudiogram || !!savedMaintenance;
  const isResumedVisit = hasSomethingSaved;

  function handleFinish() {
    if (!encounterUuid) return;
    executeCloseEncounter(encounterUuid, {
      onSuccess: () => onClose(),
      onError: () => toast.error(t(TEXT.CONSULTA.VISIT.FINISH_ERROR)),
    });
  }

  const doneLabel = t(TEXT.CONSULTA.VISIT.SAVED_IN_VISIT);

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <>
      {/* Backdrop — el expediente sigue visible detrás en desktop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Ancho adaptativo: la lista de acciones cabe en 520px, pero el audiograma
          y la nota clínica necesitan más aire en iPad/desktop. */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-50 w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ${
          activeAction === null ? 'sm:w-[480px]' : 'sm:w-[620px] lg:w-[760px]'
        }`}
      >

        {/* HEADER DEL PANEL */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-start gap-3 shrink-0">
          {activeAction !== null ? (
            <button
              onClick={() => setActiveAction(null)}
              className="w-9 h-9 rounded-app-sm bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors shrink-0"
              title={t(TEXT.CONSULTA.VISIT.BACK_TO_VISIT)}
            >
              <ArrowLeft size={15} className="text-neutral-500" />
            </button>
          ) : (
            <div className="h-9 w-9 rounded-app-sm bg-primary-soft flex items-center justify-center shrink-0">
              <Stethoscope size={17} className="text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-900 leading-tight">
              {t(TEXT.CONSULTA.VISIT.TITLE)}
            </Typography>
            <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400 capitalize">
              {today} · {isResumedVisit ? t(TEXT.CONSULTA.VISIT.SUBTITLE_RESUMED) : t(TEXT.CONSULTA.VISIT.SUBTITLE_NEW)}
            </Typography>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-app-sm hover:bg-neutral-100 flex items-center justify-center transition-colors shrink-0"
            title={t(TEXT.CONSULTA.VISIT.CLOSE_PANEL)}
          >
            <X size={16} className="text-neutral-400" />
          </button>
        </div>

        {/* CUERPO */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {isLoading || !encounterUuid ? (
            <Typography variant={TypographyVariant.CAPTION} className="block text-center py-10 text-neutral-400 animate-pulse">
              {t(TEXT.CONSULTA.VISIT.PREPARING)}
            </Typography>
          ) : activeAction === VisitAction.CLINICAL_NOTE ? (
            <ConsultaControlContainer
              patientUuid={patientUuid}
              encounterUuid={encounterUuid}
              isEmbedded
              onSaved={() => setActiveAction(null)}
              onCancel={() => setActiveAction(null)}
            />
          ) : activeAction === VisitAction.AUDIOGRAM ? (
            <ConsultaAudiogramaContainer
              patientUuid={patientUuid}
              encounterUuid={encounterUuid}
              isEmbedded
              onSaved={() => setActiveAction(null)}
              onCancel={() => setActiveAction(null)}
            />
          ) : activeAction === VisitAction.MAINTENANCE ? (
            <ConsultaMantenimientoContainer
              patientUuid={patientUuid}
              encounterUuid={encounterUuid}
              isEmbedded
              onSaved={() => setActiveAction(null)}
              onCancel={() => setActiveAction(null)}
            />
          ) : (
            <div className="space-y-3">
              <ActionButton
                icon={<Stethoscope size={17} />}
                label={t(TEXT.CONSULTA.VISIT.ADD_NOTE)}
                isDone={!!savedControl}
                doneLabel={doneLabel}
                onClick={() => setActiveAction(VisitAction.CLINICAL_NOTE)}
              />
              {isAudiologyTenant && (
                <ActionButton
                  icon={<Activity size={17} />}
                  label={t(TEXT.CONSULTA.VISIT.ADD_AUDIOGRAM)}
                  isDone={!!savedAudiogram}
                  doneLabel={doneLabel}
                  onClick={() => setActiveAction(VisitAction.AUDIOGRAM)}
                />
              )}
              {isAudiologyTenant && (
                <ActionButton
                  icon={<Wrench size={17} />}
                  label={t(TEXT.CONSULTA.VISIT.ADD_MAINTENANCE)}
                  isDone={!!savedMaintenance}
                  doneLabel={doneLabel}
                  onClick={() => setActiveAction(VisitAction.MAINTENANCE)}
                />
              )}

              {!hasSomethingSaved && (
                <Typography variant={TypographyVariant.CAPTION} className="block text-center text-[11px] text-neutral-400 pt-4">
                  {t(TEXT.CONSULTA.VISIT.NOTHING_YET)}
                </Typography>
              )}
            </div>
          )}
        </div>

        {/* PIE — finalizar visita */}
        {activeAction === null && (
          <div className="px-5 py-4 border-t border-neutral-100 shrink-0">
            <button
              onClick={handleFinish}
              disabled={isClosing || !hasSomethingSaved}
              className="w-full bg-neutral-900 hover:bg-primary text-white font-black py-3.5 rounded-app-md shadow-lg transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isClosing ? t(TEXT.CONSULTA.VISIT.FINISHING) : t(TEXT.CONSULTA.VISIT.FINISH)}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
