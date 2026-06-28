import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Save, Activity, Calendar, StickyNote, Clock, X, ChevronRight, ArrowRight
} from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { AudiometryCapture } from '@/components/containers/audiogram-capture/audiogram-capture';
import { PatientSummaryHeader } from '@/components/containers/patient-summary/patent-summary-header';
import { useNewControl, Speciality } from './use-new-control';
import { TEXT } from '@/static/texts/i18n';
import { useMedicalControlsQuery } from '@/shared/api/querys/medical-controls-query';
import { useNavigation } from '@/hooks/use-navigation';

interface Props {
    patientId: string;
}

export const NewControlContainer: React.FC<Props> = ({ patientId }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { states, setters, methods } = useNewControl(patientId);
    const { data: historyData } = useMedicalControlsQuery(patientId, 1, 5);
    const {
        showHistory,
        showAudiogram,
        isFollowUpModalOpen,
        formData,
        isPending,
        activeTemplate,
        dynamicFieldValues,
    } = states;

    // Componente Reutilizable de Seguimiento
    const FollowUpFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {[7, 30, 90, 180].map((days) => (
                        <button
                            key={days}
                            type="button"
                            onClick={() => methods.setQuickDate(days)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                        >
                            {days === 7 ? '+1 Sem' : days === 30 ? '+1 Mes' : days === 90 ? '+3 Meses' : '+6 Meses'}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="date"
                        value={formData.nextMaintenanceDate}
                        onChange={(event) => setters.setFormData({ ...formData, nextMaintenanceDate: event.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>
            <textarea
                className="w-full p-4 bg-slate-50/50 rounded-xl border border-slate-200 text-sm min-h-[100px] outline-none focus:bg-white focus:border-blue-500"
                placeholder={t(TEXT.CONTROLS.NEW.FOLLOW_UP.NOTES_PLACEHOLDER)}
                value={formData.nextControlNotes}
                onChange={(event) => setters.setFormData({ ...formData, nextControlNotes: event.target.value })}
            />
        </div>
    );

    return (
        <>
            {/* MODAL DE SEGUIMIENTO */}
            {isFollowUpModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <Typography variant={TypographyVariant.SUBTITLE}>{t(TEXT.CONTROLS.NEW.FOLLOW_UP.TITLE)}</Typography>
                            <button onClick={() => setters.setIsFollowUpModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <FollowUpFields />
                        <Button variant={ButtonVariant.PRIMARY} className="w-full mt-6 !h-12 !rounded-xl" onClick={() => setters.setIsFollowUpModalOpen(false)}>
                            {t(TEXT.CONTROLS.NEW.FOLLOW_UP.CONFIRM_BUTTON)}
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex gap-4 md:gap-8 max-w-[1600px] mx-auto pb-20 px-4 md:px-6">
                <div className={`flex-1 transition-all duration-700 min-w-0 ${showHistory ? 'md:max-w-[65%]' : 'max-w-4xl mx-auto'}`}>

                    <PatientSummaryHeader
                        patientId={patientId}
                        onOpenFollowUp={() => setters.setIsFollowUpModalOpen(true)}
                        onToggleHistory={() => setters.setShowHistory(!showHistory)}
                        showHistory={showHistory}
                    />

                    <div className="space-y-6 bg-white border border-slate-100 p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/20">
                        {/* SELECTOR ESPECIALIDAD */}
                        <section className="space-y-3">
                            <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 font-bold uppercase tracking-wider ml-1">
                                {t(TEXT.CONTROLS.NEW.SPECIALITY.LABEL)}
                            </Typography>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(Speciality).map((spec) => (
                                    <button
                                        key={spec}
                                        type="button"
                                        onClick={() => setters.setFormData({ ...formData, speciality: spec })}
                                        className={`px-5 py-2 rounded-full text-[11px] font-bold border transition-all ${formData.speciality === spec ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                                    >
                                        {spec}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* EXPLORACIÓN CLÍNICA */}
                        <section className="space-y-4 pt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity size={18} className="text-blue-600" />
                                    <Typography variant={TypographyVariant.BODY_BOLD}>
                                        {t(TEXT.CONTROLS.NEW.EXAMINATION.LABEL_PREFIX)} {formData.speciality}
                                    </Typography>
                                </div>
                                {formData.speciality === Speciality.AUDIOLOGY && (
                                    <button
                                        type="button"
                                        onClick={() => setters.setShowAudiogram(!showAudiogram)}
                                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${showAudiogram ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}
                                    >
                                        {showAudiogram ? t(TEXT.CONTROLS.NEW.EXAMINATION.REMOVE_AUDIOMETRY) : t(TEXT.CONTROLS.NEW.EXAMINATION.ADD_AUDIOMETRY)}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.speciality === Speciality.AUDIOLOGY ? (
                                    <>
                                        <textarea
                                            className="w-full p-5 rounded-2xl border border-slate-100 bg-slate-50/30 text-sm min-h-[110px] outline-none focus:bg-white focus:border-red-200"
                                            placeholder={t(TEXT.CONTROLS.NEW.EXAMINATION.OTOSCOPY_RIGHT)}
                                            value={formData.otoscopyRight}
                                            onChange={(event) => setters.setFormData({ ...formData, otoscopyRight: event.target.value })}
                                        />
                                        <textarea
                                            className="w-full p-5 rounded-2xl border border-slate-100 bg-slate-50/30 text-sm min-h-[110px] outline-none focus:bg-white focus:border-blue-200"
                                            placeholder={t(TEXT.CONTROLS.NEW.EXAMINATION.OTOSCOPY_LEFT)}
                                            value={formData.otoscopyLeft}
                                            onChange={(event) => setters.setFormData({ ...formData, otoscopyLeft: event.target.value })}
                                        />
                                        {showAudiogram && <div className="col-span-2 pt-2 animate-in slide-in-from-top-4"><AudiometryCapture onChange={setters.setAudiogramData} /></div>}
                                    </>
                                ) : (
                                    <textarea
                                        className="col-span-2 w-full p-5 rounded-2xl border border-slate-100 bg-slate-50/30 text-sm min-h-[130px] outline-none focus:bg-white focus:border-blue-200"
                                        placeholder={`${t(TEXT.CONTROLS.NEW.EXAMINATION.LABEL_PREFIX)} ${formData.speciality}...`}
                                        value={formData.generalFindings}
                                        onChange={(event) => setters.setFormData({ ...formData, generalFindings: event.target.value })}
                                    />
                                )}
                            </div>
                        </section>

                        {/* CAMPOS DINÁMICOS DE PLANTILLA CLÍNICA (P3-3) */}
                        {/* TODO(!): P3-3 — Implementar GET /clinical-templates en API para persistencia real. */}
                        {activeTemplate && activeTemplate.fields.length > 0 && (
                            <section className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2 ml-1">
                                    <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 font-bold uppercase tracking-wider">
                                        {activeTemplate.name}
                                    </Typography>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeTemplate.fields.map((field) => {
                                        const currentValue = dynamicFieldValues[field.id] ?? '';
                                        const inputBaseClass = 'w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/30 text-sm outline-none focus:bg-white focus:border-blue-300 transition-colors';
                                        return (
                                            <div key={field.id} className={field.fieldType === 'textarea' ? 'col-span-2' : ''}>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                                                    {field.label}
                                                    {field.required && <span className="text-red-400 ml-1">*</span>}
                                                </label>
                                                {field.fieldType === 'textarea' && (
                                                    <textarea
                                                        className={`${inputBaseClass} min-h-[90px]`}
                                                        placeholder={field.label}
                                                        value={String(currentValue)}
                                                        onChange={(event) =>
                                                            setters.setDynamicFieldValue(field.id, event.target.value)
                                                        }
                                                    />
                                                )}
                                                {field.fieldType === 'text' && (
                                                    <input
                                                        type="text"
                                                        className={inputBaseClass}
                                                        placeholder={field.label}
                                                        value={String(currentValue)}
                                                        onChange={(event) =>
                                                            setters.setDynamicFieldValue(field.id, event.target.value)
                                                        }
                                                    />
                                                )}
                                                {field.fieldType === 'number' && (
                                                    <input
                                                        type="number"
                                                        className={inputBaseClass}
                                                        placeholder={field.label}
                                                        value={String(currentValue)}
                                                        onChange={(event) =>
                                                            setters.setDynamicFieldValue(field.id, Number(event.target.value))
                                                        }
                                                    />
                                                )}
                                                {field.fieldType === 'date' && (
                                                    <input
                                                        type="date"
                                                        className={inputBaseClass}
                                                        value={String(currentValue)}
                                                        onChange={(event) =>
                                                            setters.setDynamicFieldValue(field.id, event.target.value)
                                                        }
                                                    />
                                                )}
                                                {field.fieldType === 'boolean' && (
                                                    <div className="flex items-center gap-3 py-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`field-${field.id}`}
                                                            checked={Boolean(currentValue)}
                                                            onChange={(event) =>
                                                                setters.setDynamicFieldValue(field.id, event.target.checked)
                                                            }
                                                            className="w-4 h-4 rounded border-slate-300"
                                                        />
                                                        <label htmlFor={`field-${field.id}`} className="text-sm text-slate-600">
                                                            {field.label}
                                                        </label>
                                                    </div>
                                                )}
                                                {field.fieldType === 'select' && field.options && (
                                                    <select
                                                        className={`${inputBaseClass} bg-white`}
                                                        value={String(currentValue)}
                                                        onChange={(event) =>
                                                            setters.setDynamicFieldValue(field.id, event.target.value)
                                                        }
                                                    >
                                                        <option value="">— Seleccionar —</option>
                                                        {field.options.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* COMENTARIOS FINALES */}
                        <section className="space-y-3 pt-4">
                            <div className="flex items-center gap-2 text-slate-400 ml-1">
                                <StickyNote size={16} />
                                <Typography variant={TypographyVariant.CAPTION} className="font-bold uppercase tracking-wider">
                                    {t(TEXT.CONTROLS.NEW.DIAGNOSIS.LABEL)}
                                </Typography>
                            </div>
                            <textarea
                                className="w-full p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30 text-sm min-h-[150px] outline-none focus:bg-white focus:ring-4 focus:ring-slate-50 transition-all"
                                placeholder={t(TEXT.CONTROLS.NEW.DIAGNOSIS.PLACEHOLDER)}
                                value={formData.diagnosis}
                                onChange={(event) => setters.setFormData({ ...formData, diagnosis: event.target.value })}
                            />
                        </section>

                        {/* SEGUIMIENTO EN PANTALLA */}
                        <section className="p-8 rounded-[2.5rem] bg-blue-50/30 border border-blue-100/50 space-y-5">
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-blue-600" />
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-blue-900">
                                    {t(TEXT.CONTROLS.NEW.SCHEDULING.TITLE)}
                                </Typography>
                            </div>
                            <FollowUpFields />
                        </section>

                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                            <Button variant={ButtonVariant.CANCEL} text={t(TEXT.CONTROLS.NEW.BUTTONS.CANCEL)} />
                            <Button
                                onClick={methods.handleSave}
                                variant={ButtonVariant.PRIMARY}
                                className="!h-12 !px-10 !rounded-xl shadow-lg shadow-blue-200"
                                disabled={isPending}
                            >
                                <Save size={18} /> {isPending ? t(TEXT.CONTROLS.NEW.BUTTONS.SAVING) : t(TEXT.CONTROLS.NEW.BUTTONS.SAVE)}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* HISTORIAL — oculto en mobile para no colapsar el layout */}
                {showHistory && (
                    <div className="hidden md:block w-[35%] space-y-4 h-[calc(100vh-140px)] sticky top-24 overflow-y-auto pr-2">
                        <div className="flex items-center justify-between mb-4">
                            <Typography variant={TypographyVariant.SUBTITLE}>{t(TEXT.CONTROLS.NEW.HISTORY.TITLE)}</Typography>
                            <button
                                onClick={() => navigation.patients.detail(patientId)}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                Ver todo <ArrowRight size={12} />
                            </button>
                        </div>
                        {!historyData?.data?.length ? (
                            <div className="py-10 text-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                                Sin registros previos
                            </div>
                        ) : (
                            historyData.data.map((record: any) => (
                                <div
                                    key={record.uuid}
                                    onClick={() => navigation.patients.viewControl(patientId, record.uuid)}
                                    className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                                            {record.header?.speciality ?? 'Consulta'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {new Date(record.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">
                                        {record.clinicalData?.diagnosis || 'Sin diagnóstico registrado'}
                                    </p>
                                    <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                                        Ver detalles <ChevronRight size={12} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
