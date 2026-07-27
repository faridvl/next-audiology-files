import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';
import { Printer, ArrowLeft } from 'lucide-react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { useNavigation } from '@/hooks/use-navigation';
import { usePatientDetail, EncounterGroup } from '@/components/containers/patients/patients-detail/use-patient-detail';
import { useAppointmentByPatientQuery } from '@/shared/api/querys/get-appoinment-by-patient-query';
import { usePatientBackgroundQuery } from '@/shared/api/querys/patient-background-query';
import { usePatientDocumentsQuery } from '@/shared/api/querys/patient-documents-query';
import { PatientBackgroundEntity } from '@/types/patients/patient-background.types';
import { PatientDocument } from '@/types/documents/document.types';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

// Modo impresión del expediente — misma fuente de datos que /patients/[uuid]
// (usePatientDetail), sin queries propias duplicadas (DOMAIN_ANALYSIS.md §4.8).
const FichaPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { uuid } = router.query;
  const navigation = useNavigation();

  const patientUuid = uuid as string;

  const {
    patient, groupedHistory, isLoading: isLoadingDetail, isFetching: isFetchingHistory, hasMore, loadMore,
  } = usePatientDetail(patientUuid);
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useAppointmentByPatientQuery(patientUuid);
  const { data: background, isLoading: isLoadingBackground } = usePatientBackgroundQuery(patientUuid);
  const { data: documentsData, isLoading: isLoadingDocuments } = usePatientDocumentsQuery(patientUuid);

  // La ficha es una copia completa del expediente (Ley 8239 art. 2.k) — a
  // diferencia del expediente en pantalla, no pagina: carga todo antes de mostrar.
  useEffect(() => {
    if (hasMore && !isFetchingHistory) loadMore();
  }, [hasMore, isFetchingHistory, loadMore]);

  const isLoading = isLoadingDetail || isLoadingAppointments || isLoadingBackground || isLoadingDocuments || hasMore;

  const appointments = appointmentsData?.appointments ?? [];
  const documents = documentsData ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-bold uppercase tracking-widest text-xs animate-pulse">
          {t(TEXT.FICHA.LOADING)}
        </Typography>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
          {t(TEXT.FICHA.NOT_FOUND)}
        </Typography>
      </div>
    );
  }

  const patientFullName = `${patient.firstName} ${patient.lastName}`.toUpperCase();
  const patientIdShort = patient.documentId ?? patient.uuid.split('-')[0].toUpperCase();

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
            <Typography variant={TypographyVariant.HEADER} className="text-2xl font-black text-neutral-900 uppercase tracking-tighter">
              {t(TEXT.FICHA.TITLE)}
            </Typography>
            <Typography variant={TypographyVariant.CAPTION} className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mt-1">
              {t(TEXT.FICHA.SUBTITLE)}
            </Typography>
          </div>
          <Typography variant={TypographyVariant.CAPTION} className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            {t(TEXT.FICHA.ISSUED_AT)} {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </Typography>
        </div>

        {/* SECCIÓN 1: DATOS DEL PACIENTE (IDENTIDAD) */}
        <section className="mb-10">
          <Typography variant={TypographyVariant.OVERLINE} as="h2" className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4 border-b border-neutral-100 pb-2 block">
            {t(TEXT.FICHA.SECTION_1)}
          </Typography>
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

        {/* SECCIÓN 2: CRONOLOGÍA — agrupada por encuentro, igual que el expediente */}
        <section className="mb-10">
          <Typography variant={TypographyVariant.OVERLINE} as="h2" className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4 border-b border-neutral-100 pb-2 block">
            {t(TEXT.FICHA.SECTION_2)}
          </Typography>
          {groupedHistory.length === 0 ? (
            <Typography variant={TypographyVariant.CAPTION} className="text-xs text-neutral-400 italic">{t(TEXT.FICHA.CONTROLS.EMPTY)}</Typography>
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
                  {(groupedHistory as EncounterGroup[]).flatMap((group) =>
                    group.items.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50">
                        <td className="p-3 border border-neutral-200 text-neutral-700 font-medium whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="p-3 border border-neutral-200 text-neutral-700 font-medium">
                          {item.type}
                        </td>
                        <td className="p-3 border border-neutral-200 text-neutral-600">
                          {item.note || '—'}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SECCIÓN 3: CITAS */}
        <section className="mb-10">
          <Typography variant={TypographyVariant.OVERLINE} as="h2" className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4 border-b border-neutral-100 pb-2 block">
            {t(TEXT.FICHA.SECTION_3)}
          </Typography>
          {appointments.length === 0 ? (
            <Typography variant={TypographyVariant.CAPTION} className="text-xs text-neutral-400 italic">{t(TEXT.FICHA.APPOINTMENTS.EMPTY)}</Typography>
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

        {/* SECCIÓN 4: ANTECEDENTES MÉDICOS (ESTADO CLÍNICO) */}
        <section className="mb-10">
          <Typography variant={TypographyVariant.OVERLINE} as="h2" className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4 border-b border-neutral-100 pb-2 block">
            {t(TEXT.FICHA.SECTION_4)}
          </Typography>
          {!background ? (
            <Typography variant={TypographyVariant.CAPTION} className="text-xs text-neutral-400 italic">{t(TEXT.FICHA.BACKGROUND.EMPTY)}</Typography>
          ) : (
            <BackgroundSection background={background} />
          )}
        </section>

        {/* SECCIÓN 5: DOCUMENTOS — fuente principal del expediente (DOMAIN_ANALYSIS.md §4.9) */}
        <section className="mb-10">
          <Typography variant={TypographyVariant.OVERLINE} as="h2" className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-4 border-b border-neutral-100 pb-2 block">
            {t(TEXT.FICHA.SECTION_5)}
          </Typography>
          {documents.length === 0 ? (
            <Typography variant={TypographyVariant.CAPTION} className="text-xs text-neutral-400 italic">{t(TEXT.FICHA.DOCUMENTS.EMPTY)}</Typography>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-200">{t(TEXT.FICHA.DOCUMENTS.COL_NAME)}</th>
                    <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-200">{t(TEXT.FICHA.DOCUMENTS.COL_CATEGORY)}</th>
                    <th className="text-left p-3 text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-neutral-200">{t(TEXT.FICHA.DOCUMENTS.COL_DATE)}</th>
                  </tr>
                </thead>
                <tbody>
                  {(documents as PatientDocument[]).map((document) => (
                    <tr key={document.uuid} className="hover:bg-neutral-50">
                      <td className="p-3 border border-neutral-200 text-neutral-700 font-medium">
                        {document.originalName}
                      </td>
                      <td className="p-3 border border-neutral-200 text-neutral-600">
                        {document.category}
                      </td>
                      <td className="p-3 border border-neutral-200 text-neutral-700 font-medium whitespace-nowrap">
                        {new Date(document.uploadedAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* PIE */}
        <Typography variant={TypographyVariant.CAPTION} className="block border-t border-neutral-200 pt-6 text-center text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
          {t(TEXT.FICHA.FOOTER)}
        </Typography>
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
        <Typography variant={TypographyVariant.CAPTION} className="text-xs text-neutral-400 italic">{t(TEXT.FICHA.BACKGROUND.NO_POSITIVE)}</Typography>
      ) : (
        <div className="flex flex-wrap gap-2">
          {positiveKeys.map((key) => (
            <Typography key={key} variant={TypographyVariant.CAPTION} inline className="px-3 py-1 bg-danger/10 text-danger border border-danger/20 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              {backgroundLabels[key]}
            </Typography>
          ))}
        </div>
      )}
      {background.notes && (
        <div className="bg-neutral-50 rounded-xl p-4 mt-2">
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t(TEXT.FICHA.BACKGROUND.NOTES)}</Typography>
          <Typography variant={TypographyVariant.CAPTION} className="text-xs text-neutral-700">{background.notes}</Typography>
        </div>
      )}
    </div>
  );
};

const DataField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-neutral-50 rounded-xl p-4">
    <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{label}</Typography>
    <Typography variant={TypographyVariant.CAPTION} className="text-xs font-bold text-neutral-800">{value}</Typography>
  </div>
);

export const getServerSideProps = authorizeServerSidePage();

export default FichaPage;
