import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { useConsultaControl } from './use-consulta-control';

interface Props {
  patientUuid: string;
}

const inputClass = 'w-full px-4 py-3 rounded-app-sm border border-neutral-200 bg-neutral-50/30 text-sm outline-none focus:bg-white focus:border-primary/30 transition-colors';
const textareaClass = `${inputClass} min-h-[100px]`;

export const ConsultaControlContainer: React.FC<Props> = ({ patientUuid }) => {
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
  } = useConsultaControl(patientUuid);

  const isAudiology = apiSpeciality === MedicalSpeciality.AUDIOLOGY;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-24 space-y-6 animate-in fade-in duration-500">

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
            Control clínico
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
              Otoscopía
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-primary uppercase tracking-widest ml-1">
                  Oído derecho (OD)
                </label>
                <textarea
                  className={`${textareaClass} border-primary-soft bg-primary-soft/20 focus:border-primary/30`}
                  placeholder="Hallazgos oído derecho..."
                  value={fields.otoscopyRight}
                  onChange={(e) => fields.setOtoscopyRight(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-danger uppercase tracking-widest ml-1">
                  Oído izquierdo (OI)
                </label>
                <textarea
                  className={`${textareaClass} border-danger/20 bg-danger/5 focus:border-danger/30`}
                  placeholder="Hallazgos oído izquierdo..."
                  value={fields.otoscopyLeft}
                  onChange={(e) => fields.setOtoscopyLeft(e.target.value)}
                />
              </div>
            </div>
          </section>
        )}

        {/* SELECTOR DE PLANTILLA */}
        {templates.length > 1 && (
          <section className="space-y-2 pt-2 border-t border-neutral-50">
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
              Plantilla clínica
            </label>
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
                    <label className="block text-xs font-bold text-neutral-600">
                      {field.label}
                      {field.required && <span className="text-danger ml-1">*</span>}
                    </label>

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
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="Apuntes adicionales..."
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
                        <option value="">— Seleccionar —</option>
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
          <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
            Diagnóstico <span className="text-danger">*</span>
          </label>
          <textarea
            className={`${textareaClass} min-h-[120px]`}
            placeholder="Escribe el diagnóstico de esta consulta..."
            value={fields.diagnosis}
            onChange={(e) => fields.setDiagnosis(e.target.value)}
          />
        </section>
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3">
        <Button variant={ButtonVariant.CANCEL} onClick={() => navigation.patients.consulta(patientUuid)} text="Cancelar" />
        <Button
          variant={ButtonVariant.PRIMARY}
          className="!h-12 !px-10 !rounded-app-sm shadow-lg shadow-primary-soft"
          onClick={handleSave}
          disabled={isPending}
        >
          <Save size={16} className="mr-2" />
          {isPending ? 'Guardando...' : 'Guardar control'}
        </Button>
      </div>
    </div>
  );
};
