import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { useConsultaControl } from './use-consulta-control';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';
import { MedicalHistorySidebar } from '@/components/containers/controls/control-history/control-history';

interface Props {
  patientUuid: string;
  encounterUuid: string;
}

const inputClass = 'w-full px-4 py-3 rounded-app-sm border border-neutral-200 bg-neutral-50/30 text-sm outline-none focus:bg-white focus:border-primary/30 transition-colors';
const textareaClass = `${inputClass} min-h-[100px] resize-none`;

export const ConsultaControlContainer: React.FC<Props> = ({ patientUuid, encounterUuid }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: patient } = usePatientDetailQuery(patientUuid);
  const {
    apiSpeciality,
    templates,
    activeTemplate,
    selectedTemplateUuid,
    setSelectedTemplateUuid,
    fields,
    isPending,
    handleSave,
  } = useConsultaControl(patientUuid, encounterUuid);

  const isAudiology = apiSpeciality === MedicalSpeciality.AUDIOLOGY;

  return (
    <div className="p-4 md:p-6 pb-24 animate-in fade-in duration-500">
      <div className="flex gap-6 items-start">

        {/* COLUMNA PRINCIPAL — formulario */}
        <div className="flex-1 min-w-0 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigation.patients.consulta(patientUuid)}
          className="w-10 h-10 rounded-app-sm bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors shrink-0"
        >
          <ArrowLeft size={16} className="text-neutral-500" />
        </button>
        <div>
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-primary">
            {t(TEXT.CONSULTA.CONTROL.BREADCRUMB)}
          </Typography>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-neutral-800 leading-tight">
            {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
          </Typography>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-app-md p-5 md:p-8 space-y-6 shadow-sm">

        {/* OTOSCOPÍA (solo audiología) */}
        {isAudiology && (
          <section className="space-y-4">
            <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">
              {t(TEXT.CONSULTA.CONTROL.OTOSCOPY)}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Typography variant={TypographyVariant.OVERLINE} as="label" className="block text-primary ml-1">
                  {t(TEXT.CONSULTA.CONTROL.OTOSCOPY_RIGHT)}
                </Typography>
                <textarea
                  className={`${textareaClass} border-primary-soft bg-primary-soft/20 focus:border-primary/30`}
                  placeholder={t(TEXT.CONSULTA.CONTROL.OTOSCOPY_RIGHT_PLACEHOLDER)}
                  value={fields.otoscopyRight}
                  onChange={(e) => fields.setOtoscopyRight(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Typography variant={TypographyVariant.OVERLINE} as="label" className="block text-danger ml-1">
                  {t(TEXT.CONSULTA.CONTROL.OTOSCOPY_LEFT)}
                </Typography>
                <textarea
                  className={`${textareaClass} border-danger/20 bg-danger/5 focus:border-danger/30`}
                  placeholder={t(TEXT.CONSULTA.CONTROL.OTOSCOPY_LEFT_PLACEHOLDER)}
                  value={fields.otoscopyLeft}
                  onChange={(e) => fields.setOtoscopyLeft(e.target.value)}
                />
              </div>
            </div>

            {/* Checkboxes audiología */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {(
                [
                  { key: 'cleaningPerformed', value: fields.cleaningPerformed, setter: fields.setCleaningPerformed, label: t(TEXT.CONSULTA.CONTROL.CLEANING_PERFORMED) },
                  { key: 'usesAuxiliaries', value: fields.usesAuxiliaries, setter: fields.setUsesAuxiliaries, label: t(TEXT.CONSULTA.CONTROL.USES_AUXILIARIES) },
                  { key: 'tinnitus', value: fields.tinnitus, setter: fields.setTinnitus, label: t(TEXT.CONSULTA.CONTROL.TINNITUS) },
                ] as const
              ).map(({ key, value, setter, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setter(!value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-app-sm border text-sm font-semibold transition-all ${
                    value
                      ? 'bg-success/10 border-success/40 text-success-dark'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-400 hover:border-neutral-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${value ? 'bg-success border-success' : 'border-neutral-300'}`}>
                    {value && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* SELECTOR DE PLANTILLA */}
        {templates.length > 1 && (
          <section className="space-y-2 pt-2 border-t border-neutral-50">
            <Typography variant={TypographyVariant.OVERLINE} as="label" className="block ml-1">
              {t(TEXT.CONSULTA.CONTROL.TEMPLATE_LABEL)}
            </Typography>
            <select
              className={`${inputClass} bg-white`}
              value={selectedTemplateUuid ?? ''}
              onChange={(e) => setSelectedTemplateUuid(e.target.value)}
            >
              {templates.map((template) => (
                <option key={template.uuid} value={template.uuid}>{template.name}</option>
              ))}
            </select>
          </section>
        )}

        {/* PLANTILLA CLÍNICA */}
        {activeTemplate && activeTemplate.fields.length > 0 && (
          <section className="space-y-4 pt-2 border-t border-neutral-50">
            <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">
              {activeTemplate.name}
            </Typography>
            <div className="space-y-3">
              {activeTemplate.fields.map((field) => {
                const currentValue = fields.fieldValues[field.id] ?? '';
                return (
                  <div key={field.id} className="bg-neutral-50 rounded-app-md p-4 space-y-2">
                    <Typography variant={TypographyVariant.CAPTION} as="label" className="block font-bold text-neutral-600">
                      {field.label}
                      {field.required && <Typography variant={TypographyVariant.CAPTION} inline className="text-danger ml-1">*</Typography>}
                    </Typography>

                    {field.fieldType === 'boolean' && (
                      <div className="flex gap-3">
                        {[true, false].map((option) => (
                          <button
                            key={String(option)}
                            type="button"
                            onClick={() => fields.setFieldValue(field.id, option)}
                            className={`flex-1 py-2.5 rounded-app-sm text-xs font-black uppercase tracking-wide transition-all border ${
                              currentValue === option
                                ? option
                                  ? 'bg-success/10 border-success/40 text-success-dark'
                                  : 'bg-danger/10 border-danger/40 text-danger'
                                : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300'
                            }`}
                          >
                            {option ? 'Sí' : 'No'}
                          </button>
                        ))}
                      </div>
                    )}

                    {field.fieldType === 'textarea' && (
                      <textarea
                        className={`${inputClass} min-h-[80px] resize-none`}
                        placeholder={t(TEXT.CONSULTA.CONTROL.ADDITIONAL_NOTES)}
                        value={String(currentValue)}
                        onChange={(e) => fields.setFieldValue(field.id, e.target.value)}
                      />
                    )}

                    {field.fieldType === 'text' && (
                      <input
                        type="text"
                        className={inputClass}
                        placeholder={field.label}
                        value={String(currentValue)}
                        onChange={(e) => fields.setFieldValue(field.id, e.target.value)}
                      />
                    )}

                    {field.fieldType === 'number' && (
                      <input
                        type="number"
                        className={inputClass}
                        placeholder="0"
                        value={String(currentValue)}
                        onChange={(e) => fields.setFieldValue(field.id, Number(e.target.value))}
                      />
                    )}

                    {field.fieldType === 'select' && field.options && (
                      <select
                        className={`${inputClass} bg-white`}
                        value={String(currentValue)}
                        onChange={(e) => fields.setFieldValue(field.id, e.target.value)}
                      >
                        <option value="">{t(TEXT.CONSULTA.CONTROL.SELECT_OPTION)}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* DIAGNÓSTICO */}
        <section className="space-y-2 pt-2 border-t border-neutral-50">
          <Typography variant={TypographyVariant.OVERLINE} as="label" className="block ml-1">
            {t(TEXT.CONSULTA.CONTROL.DIAGNOSIS)} <Typography variant={TypographyVariant.OVERLINE} inline className="text-danger">*</Typography>
          </Typography>
          <textarea
            className={`${textareaClass} min-h-[120px]`}
            placeholder={t(TEXT.CONSULTA.CONTROL.DIAGNOSIS_PLACEHOLDER)}
            value={fields.diagnosis}
            onChange={(e) => fields.setDiagnosis(e.target.value)}
          />
        </section>
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3">
        <Button variant={ButtonVariant.CANCEL} onClick={() => navigation.patients.consulta(patientUuid)} text={t(TEXT.GENERAL.BUTTONS.CANCEL)} />
        <Button
          variant={ButtonVariant.PRIMARY}
          className="!h-12 !px-10 !rounded-app-sm shadow-lg shadow-primary-soft"
          onClick={handleSave}
          disabled={isPending}
        >
          <Save size={16} className="mr-2" />
          {isPending ? t(TEXT.CONSULTA.CONTROL.SAVING) : t(TEXT.CONSULTA.CONTROL.SAVE)}
        </Button>
      </div>

        </div>{/* fin columna principal */}

        {/* COLUMNA HISTORIAL — solo desktop */}
        <div className="hidden xl:block w-96 shrink-0">
          <MedicalHistorySidebar patientId={patientUuid} />
        </div>

      </div>
    </div>
  );
};
