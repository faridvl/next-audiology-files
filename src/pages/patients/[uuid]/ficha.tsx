import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';
import { Printer, ArrowLeft } from 'lucide-react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useMedicalControlsQuery } from '@/shared/api/querys/medical-controls-query';
import { useAppointmentByPatientQuery } from '@/shared/api/querys/get-appoinment-by-patient-query';
import { useNavigation } from '@/hooks/use-navigation';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { usePatientBackgroundQuery } from '@/shared/api/querys/patient-background-query';
import { PatientBackgroundEntity } from '@/types/patients/patient-background.types';

const specialityLabels: Record<string, string> = {
  [MedicalSpeciality.AUDIOLOGY]: 'Audiología',
  [MedicalSpeciality.DENTAL]: 'Odontología',
  [MedicalSpeciality.GENERAL]: 'Medicina General',
};

const FichaPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { uuid } = router.query;
  const navigation = useNavigation();

  const patientUuid = uuid as string;

  const { data: patient, isLoading: isLoadingPatient } = usePatientDetailQuery(patientUuid);
  const { data: controlsData, isLoading: isLoadingControls } = useMedicalControlsQuery(patientUuid, 1, 50);
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useAppointmentByPatientQuery(patientUuid);
  const { data: background } = usePatientBackgroundQuery(patientUuid);

  const isLoading = isLoadingPatient || isLoadingControls || isLoadingAppointments;

  const controls = controlsData?.data ?? [];
  const appointments = appointmentsData?.appointments ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs animate-pulse">
          {t(TEXT.FICHA.LOADING)}
        </p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
          {t(TEXT.FICHA.NOT_FOUND)}
        </p>
      </div>
    );
  }

  const patientFullName = `${patient.firstName} ${patient.lastName}`.toUpperCase();
  const patientIdShort = patient.uuid.split('-')[0].toUpperCase();

  return (
    <>
      <Head>
        <title>Ficha Técnica — {patient.firstName} {patient.lastName}</title>
      </Head>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>

      {/* BARRA DE ACCIONES (solo en pantalla) */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigation.patients.detail(patientUuid)}
          className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 font-bold text-xs uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={14} /> {t(TEXT.FICHA.BACK_TO_FILE)}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all"
        >
          <Printer size={14} /> {t(TEXT.FICHA.PRINT)}
        </button>
      </div>

      {/* CONTENIDO DE LA FICHA */}
      <div className="pt-20 pb-12 px-6 max-w-4xl mx-auto no-print-padding">

        {/* ENCABEZADO */}
        <div className="border-b-4 border-neutral-900 pb-6 mb-8 flex justify-between items-end">
          <div>
            <p className="text-2xl font-black text-neutral-900 uppercase tracking-tighter">
              {t(TEXT.FICHA.TITLE)}
            </p>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mt-1">
              {t(TEXT.FICHA.SUBTITLE)}
            </p>
          </div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            {t(TEXT.FICHA.ISSUED_AT)} {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
        </div>

        {/* SECCIÓN 1: DATOS DEL PACIENTE */}
        <section className="mb-10">
          <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4 border-b border-neutral-100 pb-2">
            {t(TEXT.FICHA.SECTION_1)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DataField label={t(TEXT.FICHA.FIELDS.FULL_NAME)} value={patientFullName} />
            <DataField label={t(TEXT.FICHA.FIELDS.IDENTIFIER)} value={patientIdShort} />
            <DataField label={t(TEXT.FICHA.FIELDS.PHONE)} value={patient.phone || '—'} />
            <DataField label={t(TEXT.FICHA.FIELDS.EMAIL)} value={patient.email || '—'} />
            <DataField label={t(TEXT.FICHA.FIELDS.ADDRESS)} value={patient.address || '—'} />
            <DataField
              label={t(TEXT.FICHA.FIELDS.BIRTH_DATE)}
              value={
                patient.birthDate
                  ? new Date(patient.birthDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : '—'
              }
            />
          </div>
        </section>

        {/* SECCIÓN 2: HISTORIAL DE CONTROLES */}
        <section className="mb-10">
          <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4 border-b border-neutral-100 pb-2">
            {t(TEXT.FICHA.SECTION_2)}
          </h2>
          {controls.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">{t(TEXT.FICHA.CONTROLS.EMPTY)}</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-200">{t(TEXT.FICHA.CONTROLS.COL_DATE)}</th>
                  <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-200">{t(TEXT.FICHA.CONTROLS.COL_SPECIALITY)}</th>
                  <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-200">{t(TEXT.FICHA.CONTROLS.COL_DIAGNOSIS)}</th>
                </tr>
              </thead>
              <tbody>
                {controls.map((control) => (
                  <tr key={control.uuid} className="hover:bg-neutral-50">
                    <td className="p-3 border border-neutral-200 text-neutral-700 font-medium whitespace-nowrap">
                      {new Date(control.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3 border border-neutral-200 text-neutral-700 font-medium">
                      {specialityLabels[control.header.speciality] ?? control.header.speciality}
                    </td>
                    <td className="p-3 border border-neutral-200 text-neutral-600">
                      {control.clinicalData.diagnosis || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </section>

        {/* SECCIÓN 3: CITAS */}
        <section className="mb-10">
          <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4 border-b border-neutral-100 pb-2">
            {t(TEXT.FICHA.SECTION_3)}
          </h2>
          {appointments.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">{t(TEXT.FICHA.APPOINTMENTS.EMPTY)}</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-200">{t(TEXT.FICHA.APPOINTMENTS.COL_DATE)}</th>
                  <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-200">{t(TEXT.FICHA.APPOINTMENTS.COL_NOTES)}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment: { id: string; schedule: { date: string }; notes: string }) => (
                  <tr key={appointment.id} className="hover:bg-neutral-50">
                    <td className="p-3 border border-neutral-200 text-neutral-700 font-medium whitespace-nowrap">
                      {appointment.schedule?.date
                        ? new Date(appointment.schedule.date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="p-3 border border-neutral-200 text-neutral-600">
                      {appointment.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </section>

        {/* SECCIÓN 4: ANTECEDENTES MÉDICOS */}
        <section className="mb-10">
          <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4 border-b border-neutral-100 pb-2">
            {t(TEXT.FICHA.SECTION_4)}
          </h2>
          {!background ? (
            <p className="text-xs text-neutral-400 italic">{t(TEXT.FICHA.BACKGROUND.EMPTY)}</p>
          ) : (
            <BackgroundSection background={background} />
          )}
        </section>

        {/* PIE */}
        <div className="border-t border-neutral-200 pt-6 text-center text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
          {t(TEXT.FICHA.FOOTER)}
        </div>
      </div>
    </>
  );
};

const BackgroundSection: React.FC<{ background: PatientBackgroundEntity }> = ({ background }) => {
  const { t } = useTranslation();

  const backgroundLabels: Record<keyof Omit<PatientBackgroundEntity, 'uuid' | 'patientUuid' | 'updatedAt' | 'notes'>, string> = {
    earInfections: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.EAR_INFECTIONS),
    nasalSurgery: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.NASAL_SURGERY),
    throatSurgery: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.THROAT_SURGERY),
    earSurgery: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.EAR_SURGERY),
    diabetes: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.DIABETES),
    cholesterol: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.CHOLESTEROL),
    highPressure: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.HIGH_PRESSURE),
    allergies: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.ALLERGIES),
    rhinitis: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.RHINITIS),
    vertigo: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.VERTIGO),
    tinnitus: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.TINNITUS),
    headacheNoise: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.HEADACHE_NOISE),
    cloggedEar: t(TEXT.PATIENTS.DETAIL.BACKGROUND.LABELS.CLOGGED_EAR),
  };

  const positiveKeys = (Object.keys(backgroundLabels) as Array<keyof typeof backgroundLabels>).filter(
    (key) => background[key],
  );

  return (
    <div className="space-y-3">
      {positiveKeys.length === 0 ? (
        <p className="text-xs text-neutral-400 italic">{t(TEXT.FICHA.BACKGROUND.NO_POSITIVE)}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {positiveKeys.map((key) => (
            <span key={key} className="px-3 py-1 bg-danger/10 text-danger border border-danger/20 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              {backgroundLabels[key]}
            </span>
          ))}
        </div>
      )}
      {background.notes && (
        <div className="bg-neutral-50 rounded-xl p-4 mt-2">
          <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t(TEXT.FICHA.BACKGROUND.NOTES)}</p>
          <p className="text-xs text-neutral-700">{background.notes}</p>
        </div>
      )}
    </div>
  );
};

const DataField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-neutral-50 rounded-xl p-4">
    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xs font-bold text-neutral-800">{value}</p>
  </div>
);

export const getServerSideProps = authorizeServerSidePage();

export default FichaPage;
