import React from 'react';
import { ArrowLeft, Stethoscope, Activity, Wrench, CheckCircle, ChevronRight, Flag } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useNavigation } from '@/hooks/use-navigation';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useActiveEncounter } from '@/components/containers/patients/consulta/use-active-encounter';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { StudyType } from '@/types/studies/study.types';
import { useSession } from '@/hooks/use-session';
import { UserSpecialty } from '@/types/auth/auth';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';

interface Props {
  patientUuid: string;
}

const userSpecialtyToApiSpeciality: Record<UserSpecialty, MedicalSpeciality> = {
  [UserSpecialty.AUDIOLOGY]: MedicalSpeciality.AUDIOLOGY,
  [UserSpecialty.DENTAL]: MedicalSpeciality.DENTAL,
  [UserSpecialty.GENERAL]: MedicalSpeciality.GENERAL,
};

interface SectionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  done: boolean;
  onClick: () => void;
  color: string;
  doneLabel: string;
}

function SectionButton({ icon, label, description, done, onClick, color, doneLabel }: SectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-5 rounded-app-md border transition-all text-left group ${
        done
          ? 'bg-success/10 border-success/30 hover:border-success/50'
          : 'bg-white border-neutral-100 hover:border-neutral-300 hover:shadow-sm'
      }`}
    >
      <div
        className={`h-12 w-12 rounded-app-md flex items-center justify-center shrink-0 transition-colors ${
          done ? 'bg-success/20' : `bg-${color}-50 group-hover:bg-${color}-100`
        }`}
      >
        {done ? (
          <CheckCircle size={22} className="text-success" />
        ) : (
          <span className={`text-${color}-500`}>{icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Typography variant={TypographyVariant.BODY_BOLD} className={`text-sm ${done ? 'text-success-dark' : 'text-neutral-800'}`}>
          {label}
        </Typography>
        <Typography variant={TypographyVariant.CAPTION} className={`text-[11px] mt-0.5 ${done ? 'text-success' : 'text-neutral-400'}`}>
          {done ? doneLabel : description}
        </Typography>
      </div>
      <ChevronRight size={16} className={`shrink-0 ${done ? 'text-success/60' : 'text-neutral-300 group-hover:text-neutral-500'}`} />
    </button>
  );
}

export const ConsultaContainer: React.FC<Props> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useSession();
  const { data: patient } = usePatientDetailQuery(patientUuid);

  const apiSpeciality: MedicalSpeciality = user?.specialty
    ? userSpecialtyToApiSpeciality[user.specialty]
    : MedicalSpeciality.GENERAL;

  const isAudiology = apiSpeciality === MedicalSpeciality.AUDIOLOGY;

  const { encounterUuid, encounterDetail } = useActiveEncounter(patientUuid, apiSpeciality);

  const savedControl = encounterDetail?.medicalControls[0];
  const savedAudiogram = encounterDetail?.studies.find((study) => study.tipo === StudyType.AUDIOMETRIA_TONAL);
  const savedMaintenance = encounterDetail?.maintenances[0];

  const hasSomethingSaved = !!savedControl || !!savedAudiogram || !!savedMaintenance;

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const completedCount = [!!savedControl, isAudiology && !!savedAudiogram, !!savedMaintenance].filter(Boolean).length;

  const totalCount = isAudiology ? 3 : 2;
  const doneLabel = t(TEXT.CONSULTA.SAVED_CHECK);

  function goToStep(navigate: (uuid: string, encounterUuid: string) => void) {
    if (!encounterUuid) return;
    navigate(patientUuid, encounterUuid);
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-24 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigation.patients.detail(patientUuid)}
          className="w-10 h-10 rounded-app-sm bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors shrink-0"
        >
          <ArrowLeft size={16} className="text-neutral-500" />
        </button>
        <div className="flex-1 min-w-0">
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
            {t(TEXT.CONSULTA.HEADER.DAY_LABEL)}
          </Typography>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-neutral-800 leading-tight">
            {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
          </Typography>
          <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400 capitalize mt-0.5">
            {today}
          </Typography>
        </div>
        {/* Progreso */}
        <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
            {t(TEXT.CONSULTA.HEADER.PROGRESS_LABEL)}
          </Typography>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: totalCount }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-all ${index < completedCount ? 'bg-success' : 'bg-neutral-100'}`}
                />
              ))}
            </div>
            <span className="text-xs font-black text-neutral-500">{completedCount}/{totalCount}</span>
          </div>
        </div>
      </div>

      {/* LAYOUT DOS COLUMNAS EN DESKTOP */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 md:gap-8 items-start">

        {/* COLUMNA IZQUIERDA — secciones */}
        <div className="space-y-4">
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">
            {t(TEXT.CONSULTA.HEADER.WHAT_TODAY)}
          </Typography>

          <SectionButton
            icon={<Stethoscope size={22} />}
            label={t(TEXT.CONSULTA.SECTIONS.CLINICAL_CONTROL)}
            description={t(TEXT.CONSULTA.SECTIONS.CLINICAL_CONTROL_DESC)}
            done={!!savedControl}
            onClick={() => goToStep(navigation.patients.consultaControl)}
            color="blue"
            doneLabel={doneLabel}
          />

          {isAudiology && (
            <SectionButton
              icon={<Activity size={22} />}
              label={t(TEXT.CONSULTA.SECTIONS.AUDIOGRAM)}
              description={t(TEXT.CONSULTA.SECTIONS.AUDIOGRAM_DESC)}
              done={!!savedAudiogram}
              onClick={() => goToStep(navigation.patients.consultaAudiograma)}
              color="purple"
              doneLabel={doneLabel}
            />
          )}

          <SectionButton
            icon={<Wrench size={22} />}
            label={t(TEXT.CONSULTA.SECTIONS.MAINTENANCE)}
            description={t(TEXT.CONSULTA.SECTIONS.MAINTENANCE_DESC)}
            done={!!savedMaintenance}
            onClick={() => goToStep(navigation.patients.consultaMantenimiento)}
            color="amber"
            doneLabel={doneLabel}
          />

          {/* FINALIZAR — mobile */}
          {hasSomethingSaved && (
            <div className="pt-2 md:hidden">
              <button
                onClick={() => goToStep(navigation.patients.consultaResumen)}
                className="w-full flex items-center justify-center gap-3 bg-neutral-900 hover:bg-primary text-white font-black py-4 rounded-app-md shadow-lg transition-all text-sm"
              >
                <Flag size={16} />
                {t(TEXT.CONSULTA.FINISH)}
              </button>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA — contexto + finalizar (solo desktop) */}
        <div className="hidden md:flex flex-col gap-4">

          {/* Card paciente */}
          <div className="bg-white border border-neutral-100 rounded-app-xl p-6 shadow-sm space-y-4">
            <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
              {t(TEXT.CONSULTA.PATIENT)}
            </Typography>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-app-md bg-neutral-100 flex items-center justify-center text-neutral-500 font-black text-lg shrink-0">
                {patient ? patient.firstName[0] : '?'}
              </div>
              <div className="min-w-0">
                <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-neutral-800 truncate">
                  {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
                </Typography>
                <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400">
                  {patient?.documentId ?? '—'}
                </Typography>
              </div>
            </div>
          </div>

          {/* Resumen de progreso */}
          <div className="bg-white border border-neutral-100 rounded-app-xl p-6 shadow-sm space-y-3">
            <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
              {t(TEXT.CONSULTA.STATUS.TITLE)}
            </Typography>
            {[
              { label: t(TEXT.CONSULTA.SECTIONS.CLINICAL_CONTROL), done: !!savedControl },
              ...(isAudiology ? [{ label: t(TEXT.CONSULTA.SECTIONS.AUDIOGRAM), done: !!savedAudiogram }] : []),
              { label: t(TEXT.CONSULTA.SECTIONS.MAINTENANCE), done: !!savedMaintenance },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full shrink-0 ${item.done ? 'bg-success' : 'bg-neutral-200'}`} />
                <Typography
                  variant={TypographyVariant.CAPTION}
                  className={`text-xs ${item.done ? 'text-success-dark font-bold' : 'text-neutral-400'}`}
                >
                  {item.label}
                </Typography>
                {item.done && (
                  <span className="ml-auto text-[9px] font-black text-success uppercase tracking-wider">
                    {t(TEXT.CONSULTA.STATUS.DONE)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Botón finalizar — solo aparece cuando hay algo */}
          {hasSomethingSaved ? (
            <button
              onClick={() => goToStep(navigation.patients.consultaResumen)}
              className="w-full flex items-center justify-center gap-3 bg-neutral-900 hover:bg-primary text-white font-black py-4 rounded-app-md shadow-lg transition-all text-sm"
            >
              <Flag size={16} />
              {t(TEXT.CONSULTA.FINISH)}
            </button>
          ) : (
            <div className="p-4 bg-neutral-50 border border-dashed border-neutral-200 rounded-app-md text-center">
              <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400">
                {t(TEXT.CONSULTA.STATUS.COMPLETE_AT_LEAST_ONE)}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
