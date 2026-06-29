import React from 'react';
import {
  ArrowLeft, Save, Stethoscope, Wrench, Activity, Plus, X,
} from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { AudiogramTable } from '@/components/common/audiogram-table/audiogram-table';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { useConsulta } from './use-consulta';

interface Props {
  patientUuid: string;
}

const SECTION_META = {
  control: { label: 'Control clínico', icon: <Stethoscope size={16} />, color: 'blue' },
  audiogram: { label: 'Audiograma', icon: <Activity size={16} />, color: 'purple' },
  maintenance: { label: 'Mantenimiento', icon: <Wrench size={16} />, color: 'amber' },
};

function SectionToggle({
  sectionKey,
  active,
  onToggle,
}: {
  sectionKey: keyof typeof SECTION_META;
  active: boolean;
  onToggle: () => void;
}) {
  const meta = SECTION_META[sectionKey];
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
        active
          ? `bg-${meta.color}-50 border-${meta.color}-200 text-${meta.color}-700`
          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
      }`}
    >
      {active ? <X size={12} /> : <Plus size={12} />}
      {meta.label}
    </button>
  );
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-sm outline-none focus:bg-white focus:border-blue-300 transition-colors';
const textareaClass = `${inputClass} min-h-[100px]`;

export const ConsultaContainer: React.FC<Props> = ({ patientUuid }) => {
  const navigation = useNavigation();
  const { data: patient } = usePatientDetailQuery(patientUuid);

  const {
    apiSpeciality,
    activeTemplate,
    sections,
    toggleSection,
    fields,
    methods,
    isPending,
  } = useConsulta(patientUuid);

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-24 space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigation.patients.detail(patientUuid)}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
        >
          <ArrowLeft size={16} className="text-slate-500" />
        </button>
        <div>
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Iniciar consulta
          </Typography>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-slate-800 leading-tight">
            {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
          </Typography>
          <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-slate-400 capitalize mt-0.5">
            {today}
          </Typography>
        </div>
      </div>

      {/* TOGGLES DE SECCIÓN */}
      <div className="bg-white border border-slate-100 rounded-[1.8rem] p-4 space-y-3">
        <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
          Secciones de esta consulta
        </Typography>
        <div className="flex flex-wrap gap-2">
          <SectionToggle sectionKey="control" active={sections.control} onToggle={() => toggleSection('control')} />
          {apiSpeciality === MedicalSpeciality.AUDIOLOGY && (
            <SectionToggle sectionKey="audiogram" active={sections.audiogram} onToggle={() => toggleSection('audiogram')} />
          )}
          <SectionToggle sectionKey="maintenance" active={sections.maintenance} onToggle={() => toggleSection('maintenance')} />
        </div>
      </div>

      {/* SECCIÓN: CONTROL CLÍNICO */}
      {sections.control && (
        <div className="bg-white border border-slate-100 rounded-[1.8rem] p-5 md:p-8 space-y-5 shadow-sm">
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-blue-500 ml-1">
            Control clínico
          </Typography>

          {apiSpeciality === MedicalSpeciality.AUDIOLOGY && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Otoscopía — OD
                </label>
                <textarea
                  className={`${textareaClass} border-blue-100 bg-blue-50/20 focus:border-blue-300`}
                  placeholder="Hallazgos oído derecho..."
                  value={fields.otoscopyRight}
                  onChange={(e) => fields.setOtoscopyRight(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Otoscopía — OI
                </label>
                <textarea
                  className={`${textareaClass} border-red-100 bg-red-50/20 focus:border-red-300`}
                  placeholder="Hallazgos oído izquierdo..."
                  value={fields.otoscopyLeft}
                  onChange={(e) => fields.setOtoscopyLeft(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Campos dinámicos de la plantilla clínica */}
          {activeTemplate && activeTemplate.fields.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-50">
              <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {activeTemplate.name}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTemplate.fields.map((field) => {
                  const currentValue = fields.dynamicFields[field.id] ?? '';
                  return (
                    <div key={field.id} className={field.fieldType === 'textarea' ? 'col-span-full' : ''}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      {field.fieldType === 'boolean' ? (
                        <div className="flex items-center gap-3 py-2">
                          <input
                            type="checkbox"
                            id={`field-${field.id}`}
                            checked={Boolean(currentValue)}
                            onChange={(e) => fields.setDynamicField(field.id, e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300"
                          />
                          <label htmlFor={`field-${field.id}`} className="text-sm text-slate-600">
                            {field.label}
                          </label>
                        </div>
                      ) : field.fieldType === 'textarea' ? (
                        <textarea
                          className={textareaClass}
                          placeholder={field.label}
                          value={String(currentValue)}
                          onChange={(e) => fields.setDynamicField(field.id, e.target.value)}
                        />
                      ) : (
                        <input
                          type={field.fieldType === 'number' ? 'number' : 'text'}
                          className={inputClass}
                          placeholder={field.label}
                          value={String(currentValue)}
                          onChange={(e) =>
                            fields.setDynamicField(
                              field.id,
                              field.fieldType === 'number' ? Number(e.target.value) : e.target.value,
                            )
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-1.5 pt-2 border-t border-slate-50">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Diagnóstico <span className="text-red-400">*</span>
            </label>
            <textarea
              className={`${textareaClass} min-h-[120px]`}
              placeholder="Escribe el diagnóstico de esta consulta..."
              value={fields.diagnosis}
              onChange={(e) => fields.setDiagnosis(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* SECCIÓN: AUDIOGRAMA */}
      {sections.audiogram && (
        <div className="bg-white border border-slate-100 rounded-[1.8rem] p-5 md:p-8 space-y-4 shadow-sm">
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-purple-500 ml-1">
            Audiograma
          </Typography>
          <AudiogramTable data={fields.audiogramData} onChange={fields.setAudiogramData} />
        </div>
      )}

      {/* SECCIÓN: MANTENIMIENTO */}
      {sections.maintenance && (
        <div className="bg-white border border-slate-100 rounded-[1.8rem] p-5 md:p-8 space-y-5 shadow-sm">
          <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-amber-500 ml-1">
            Mantenimiento
          </Typography>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Descripción <span className="text-red-400">*</span>
            </label>
            <textarea
              className={textareaClass}
              placeholder="Describe el mantenimiento realizado al audífono..."
              value={fields.maintenanceDescription}
              onChange={(e) => fields.setMaintenanceDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Próximo mantenimiento
            </label>
            <div className="flex flex-wrap gap-2">
              {[30, 90, 180].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => methods.setQuickMaintenanceDate(days)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all"
                >
                  {days === 30 ? '+1 Mes' : days === 90 ? '+3 Meses' : '+6 Meses'}
                </button>
              ))}
            </div>
            <input
              type="date"
              value={fields.nextMaintenanceAt}
              onChange={(e) => fields.setNextMaintenanceAt(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* BOTONES */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant={ButtonVariant.CANCEL}
          onClick={() => navigation.patients.detail(patientUuid)}
          text="Cancelar"
        />
        <Button
          variant={ButtonVariant.PRIMARY}
          className="!h-12 !px-10 !rounded-xl shadow-lg shadow-blue-200"
          onClick={methods.handleFinalize}
          disabled={isPending}
        >
          <Save size={16} className="mr-2" />
          {isPending ? 'Guardando...' : 'Finalizar consulta'}
        </Button>
      </div>
    </div>
  );
};
