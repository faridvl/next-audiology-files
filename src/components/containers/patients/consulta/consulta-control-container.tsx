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

const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-sm outline-none focus:bg-white focus:border-blue-300 transition-colors';
const textareaClass = `${inputClass} min-h-[100px]`;

export const ConsultaControlContainer: React.FC<Props> = ({ patientUuid }) => {
  const navigation = useNavigation();
  const { data: patient } = usePatientDetailQuery(patientUuid);
  const { apiSpeciality, activeTemplate, fields, isPending, handleSave } = useConsultaControl(patientUuid);

  const isAudiology = apiSpeciality === MedicalSpeciality.AUDIOLOGY;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-24 space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigation.patients.consulta(patientUuid)}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
        >
          <ArrowLeft size={16} className="text-slate-500" />
        </button>
        <div>
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-blue-500">
            Control clínico
          </Typography>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-slate-800 leading-tight">
            {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
          </Typography>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[1.8rem] p-5 md:p-8 space-y-6 shadow-sm">

        {/* OTOSCOPÍA (solo audiología) */}
        {isAudiology && (
          <section className="space-y-4">
            <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Otoscopía
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">
                  Oído derecho (OD)
                </label>
                <textarea
                  className={`${textareaClass} border-blue-100 bg-blue-50/20 focus:border-blue-300`}
                  placeholder="Hallazgos oído derecho..."
                  value={fields.otoscopyRight}
                  onChange={(e) => fields.setOtoscopyRight(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-red-400 uppercase tracking-widest ml-1">
                  Oído izquierdo (OI)
                </label>
                <textarea
                  className={`${textareaClass} border-red-100 bg-red-50/20 focus:border-red-300`}
                  placeholder="Hallazgos oído izquierdo..."
                  value={fields.otoscopyLeft}
                  onChange={(e) => fields.setOtoscopyLeft(e.target.value)}
                />
              </div>
            </div>
          </section>
        )}

        {/* PLANTILLA CLÍNICA */}
        {activeTemplate && activeTemplate.fields.length > 0 && (
          <section className="space-y-4 pt-2 border-t border-slate-50">
            <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
              {activeTemplate.name}
            </Typography>
            <div className="space-y-3">
              {activeTemplate.fields.map((field) => {
                const currentValue = fields.fieldValues[field.id] ?? '';
                return (
                  <div key={field.id} className="bg-slate-50 rounded-2xl p-4 space-y-2">
                    <label className="block text-xs font-bold text-slate-600">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>

                    {field.fieldType === 'boolean' && (
                      <div className="flex gap-3">
                        {[true, false].map((option) => (
                          <button
                            key={String(option)}
                            type="button"
                            onClick={() => fields.setFieldValue(field.id, option)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all border ${
                              currentValue === option
                                ? option
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                  : 'bg-red-50 border-red-300 text-red-600'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
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
        <section className="space-y-2 pt-2 border-t border-slate-50">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Diagnóstico <span className="text-red-400">*</span>
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
          className="!h-12 !px-10 !rounded-xl shadow-lg shadow-blue-200"
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
