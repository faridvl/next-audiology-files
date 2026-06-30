import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Save, Activity, Calendar, StickyNote, Clock, X, ArrowRight,
    Stethoscope, AlertCircle
} from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { AudiometryCapture } from '@/components/containers/audiogram-capture/audiogram-capture';
import { useNewControl } from './use-new-control';
import { TEXT } from '@/static/texts/i18n';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { useMedicalControlsQuery, MedicalControlResponse } from '@/shared/api/querys/medical-controls-query';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useNavigation } from '@/hooks/use-navigation';

interface Props {
    patientId: string;
}

const SPECIALITY_META: Record<MedicalSpeciality, { label: string; color: string; bg: string }> = {
    [MedicalSpeciality.AUDIOLOGY]: { label: 'Audiología', color: '#3B82F6', bg: '#EFF6FF' },
    [MedicalSpeciality.DENTAL]: { label: 'Odontología', color: '#10B981', bg: '#F0FDF4' },
    [MedicalSpeciality.GENERAL]: { label: 'Medicina General', color: '#8B5CF6', bg: '#F5F3FF' },
};

export const NewControlContainer: React.FC<Props> = ({ patientId }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { resolvedSpecialty, apiSpeciality, states, setters, methods } = useNewControl(patientId);
    const { data: historyData } = useMedicalControlsQuery(patientId, 1, 5);

    const { data: patient } = usePatientDetailQuery(patientId);

    const {
        showHistory, showAudiogram, isFollowUpModalOpen,
        formData, isPending, activeTemplate, dynamicFieldValues,
    } = states;

    const specialityMeta = SPECIALITY_META[apiSpeciality];

    const FollowUpFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {[7, 30, 90, 180].map((days) => (
                        <button
                            key={days}
                            type="button"
                            onClick={() => methods.setQuickDate(days)}
                            className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[10px] font-bold text-neutral-500 hover:bg-primary-soft hover:text-primary hover:border-primary-soft transition-all"
                        >
                            {days === 7 ? '+1 Sem' : days === 30 ? '+1 Mes' : days === 90 ? '+3 Meses' : '+6 Meses'}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                        type="date"
                        value={formData.nextMaintenanceDate}
                        onChange={(event) => setters.setFormData({ ...formData, nextMaintenanceDate: event.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-app-sm border border-neutral-200 text-sm font-medium outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>
            <textarea
                className="w-full p-4 bg-neutral-50/50 rounded-app-sm border border-neutral-200 text-sm min-h-[100px] outline-none focus:bg-white focus:border-primary"
                placeholder={t(TEXT.CONTROLS.NEW.FOLLOW_UP.NOTES_PLACEHOLDER)}
                value={formData.nextControlNotes}
                onChange={(event) => setters.setFormData({ ...formData, nextControlNotes: event.target.value })}
            />
        </div>
    );

    // Sin especialidad resuelta — no debería ocurrir si el usuario tiene sesión
    if (!resolvedSpecialty) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-6">
                <div className="flex items-center gap-3 p-6 bg-warning/10 border border-warning/30 rounded-app-md">
                    <AlertCircle className="text-warning shrink-0" size={20} />
                    <div>
                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-warning">
                            Sin especialidad asignada
                        </Typography>
                        <Typography variant={TypographyVariant.CAPTION} className="text-warning text-xs mt-0.5">
                            Tu cuenta no tiene una especialidad médica configurada. Contacta al administrador.
                        </Typography>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* MODAL DE SEGUIMIENTO */}
            {isFollowUpModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/30 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-app-xl shadow-2xl p-8 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <Typography variant={TypographyVariant.SUBTITLE}>{t(TEXT.CONTROLS.NEW.FOLLOW_UP.TITLE)}</Typography>
                            <button onClick={() => setters.setIsFollowUpModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <FollowUpFields />
                        <Button variant={ButtonVariant.PRIMARY} className="w-full mt-6 !h-12 !rounded-app-sm" onClick={() => setters.setIsFollowUpModalOpen(false)}>
                            {t(TEXT.CONTROLS.NEW.FOLLOW_UP.CONFIRM_BUTTON)}
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex gap-4 md:gap-8 w-full max-w-[1600px] mx-auto pb-20 px-4 md:px-8">
                <div className={`flex-1 transition-all duration-700 min-w-0 ${showHistory ? 'md:max-w-[65%]' : 'w-full'}`}>

                    {/* CABECERA DEL PACIENTE */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigation.patients.detail(patientId)}
                                className="w-10 h-10 rounded-app-sm bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                                title="Volver al paciente"
                            >
                                <ArrowRight size={16} className="rotate-180 text-neutral-500" />
                            </button>
                            <div>
                                <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                                    Nuevo control
                                </Typography>
                                <Typography variant={TypographyVariant.SUBTITLE} className="text-neutral-800">
                                    {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
                                </Typography>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setters.setIsFollowUpModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-app-sm border border-primary-soft bg-primary-soft text-primary text-xs font-bold hover:bg-primary-soft/70 transition-colors"
                            >
                                <Clock size={13} />
                                Agendar seguimiento
                            </button>
                            <button
                                onClick={() => setters.setShowHistory(!showHistory)}
                                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-app-sm border text-xs font-bold transition-colors ${showHistory
                                    ? 'border-neutral-800 bg-neutral-800 text-white'
                                    : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'}`}
                            >
                                Historial
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6 bg-white border border-neutral-100 p-5 md:p-10 rounded-app-xl md:rounded-app-2xl shadow-xl shadow-neutral-200/20">

                        {/* BADGE DE ESPECIALIDAD — informativo, no editable */}
                        <div
                            className="flex items-center gap-3 px-4 py-3 rounded-app-md border"
                            style={{ backgroundColor: specialityMeta.bg, borderColor: `${specialityMeta.color}25` }}
                        >
                            <Stethoscope size={16} style={{ color: specialityMeta.color }} />
                            <div className="flex-1 min-w-0">
                                <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                                    Especialidad del registro
                                </Typography>
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm" style={{ color: specialityMeta.color }}>
                                    {specialityMeta.label}
                                </Typography>
                            </div>
                            <Typography variant={TypographyVariant.CAPTION} className="text-[9px] text-neutral-400 italic hidden sm:block">
                                Asignada a tu cuenta
                            </Typography>
                        </div>

                        {/* EXPLORACIÓN CLÍNICA — campos por especialidad */}
                        <section className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity size={16} className="text-neutral-400" />
                                    <Typography variant={TypographyVariant.CAPTION} className="font-black uppercase tracking-wider text-neutral-500 text-[10px]">
                                        {t(TEXT.CONTROLS.NEW.EXAMINATION.LABEL_PREFIX)} {specialityMeta.label}
                                    </Typography>
                                </div>
                                {apiSpeciality === MedicalSpeciality.AUDIOLOGY && (
                                    <button
                                        type="button"
                                        onClick={() => setters.setShowAudiogram(!showAudiogram)}
                                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-app-sm border transition-all ${showAudiogram
                                            ? 'bg-danger/10 text-danger border-danger/20'
                                            : 'border-dashed border-neutral-200 text-neutral-400 hover:border-primary/30 hover:text-primary'}`}
                                    >
                                        {showAudiogram
                                            ? t(TEXT.CONTROLS.NEW.EXAMINATION.REMOVE_AUDIOMETRY)
                                            : t(TEXT.CONTROLS.NEW.EXAMINATION.ADD_AUDIOMETRY)}
                                    </button>
                                )}
                            </div>

                            {/* Campos específicos por especialidad */}
                            {apiSpeciality === MedicalSpeciality.AUDIOLOGY && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Typography variant={TypographyVariant.CAPTION} className="text-[10px] font-black uppercase tracking-widest text-danger ml-1">
                                                Otoscopía — Oído Derecho
                                            </Typography>
                                            <textarea
                                                className="w-full p-4 rounded-app-md border border-danger/20 bg-danger/5 text-sm min-h-[100px] outline-none focus:bg-white focus:border-danger/30 transition-colors"
                                                placeholder={t(TEXT.CONTROLS.NEW.EXAMINATION.OTOSCOPY_RIGHT)}
                                                value={formData.otoscopyRight}
                                                onChange={(event) => setters.setFormData({ ...formData, otoscopyRight: event.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Typography variant={TypographyVariant.CAPTION} className="text-[10px] font-black uppercase tracking-widest text-primary-light ml-1">
                                                Otoscopía — Oído Izquierdo
                                            </Typography>
                                            <textarea
                                                className="w-full p-4 rounded-app-md border border-primary-soft bg-primary-soft/30 text-sm min-h-[100px] outline-none focus:bg-white focus:border-primary/30 transition-colors"
                                                placeholder={t(TEXT.CONTROLS.NEW.EXAMINATION.OTOSCOPY_LEFT)}
                                                value={formData.otoscopyLeft}
                                                onChange={(event) => setters.setFormData({ ...formData, otoscopyLeft: event.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {showAudiogram && (
                                        <div className="animate-in slide-in-from-top-4 duration-300">
                                            <AudiometryCapture onChange={setters.setAudiogramData} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {apiSpeciality === MedicalSpeciality.DENTAL && (
                                <textarea
                                    className="w-full p-5 rounded-app-md border border-success/20 bg-success/5 text-sm min-h-[130px] outline-none focus:bg-white focus:border-success/30 transition-colors"
                                    placeholder="Hallazgos odontológicos, estado de piezas dentales, encías..."
                                    value={formData.generalFindings}
                                    onChange={(event) => setters.setFormData({ ...formData, generalFindings: event.target.value })}
                                />
                            )}

                            {apiSpeciality === MedicalSpeciality.GENERAL && (
                                <textarea
                                    className="w-full p-5 rounded-app-md border border-neutral-100 bg-neutral-50/30 text-sm min-h-[130px] outline-none focus:bg-white focus:border-neutral-300 transition-colors"
                                    placeholder={`${t(TEXT.CONTROLS.NEW.EXAMINATION.LABEL_PREFIX)} ${specialityMeta.label}...`}
                                    value={formData.generalFindings}
                                    onChange={(event) => setters.setFormData({ ...formData, generalFindings: event.target.value })}
                                />
                            )}
                        </section>

                        {/* CAMPOS DINÁMICOS DE PLANTILLA CLÍNICA */}
                        {activeTemplate && activeTemplate.fields.length > 0 && (
                            <section className="space-y-4 pt-4 border-t border-neutral-50">
                                <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-black uppercase tracking-wider text-[10px] ml-1">
                                    {activeTemplate.name}
                                </Typography>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeTemplate.fields.map((field) => {
                                        const currentValue = dynamicFieldValues[field.id] ?? '';
                                        const inputClass = 'w-full px-4 py-3 rounded-app-sm border border-neutral-100 bg-neutral-50/30 text-sm outline-none focus:bg-white focus:border-primary/40 transition-colors';
                                        return (
                                            <div key={field.id} className={field.fieldType === 'textarea' ? 'col-span-2' : ''}>
                                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">
                                                    {field.label}
                                                    {field.required && <span className="text-danger ml-1">*</span>}
                                                </label>
                                                {field.fieldType === 'textarea' && (
                                                    <textarea className={`${inputClass} min-h-[90px]`} placeholder={field.label} value={String(currentValue)}
                                                        onChange={(event) => setters.setDynamicFieldValue(field.id, event.target.value)} />
                                                )}
                                                {field.fieldType === 'text' && (
                                                    <input type="text" className={inputClass} placeholder={field.label} value={String(currentValue)}
                                                        onChange={(event) => setters.setDynamicFieldValue(field.id, event.target.value)} />
                                                )}
                                                {field.fieldType === 'number' && (
                                                    <input type="number" className={inputClass} placeholder={field.label} value={String(currentValue)}
                                                        onChange={(event) => setters.setDynamicFieldValue(field.id, Number(event.target.value))} />
                                                )}
                                                {field.fieldType === 'date' && (
                                                    <input type="date" className={inputClass} value={String(currentValue)}
                                                        onChange={(event) => setters.setDynamicFieldValue(field.id, event.target.value)} />
                                                )}
                                                {field.fieldType === 'boolean' && (
                                                    <div className="flex items-center gap-3 py-2">
                                                        <input type="checkbox" id={`field-${field.id}`} checked={Boolean(currentValue)}
                                                            onChange={(event) => setters.setDynamicFieldValue(field.id, event.target.checked)}
                                                            className="w-4 h-4 rounded border-neutral-300" />
                                                        <label htmlFor={`field-${field.id}`} className="text-sm text-neutral-600">{field.label}</label>
                                                    </div>
                                                )}
                                                {field.fieldType === 'select' && field.options && (
                                                    <select className={`${inputClass} bg-white`} value={String(currentValue)}
                                                        onChange={(event) => setters.setDynamicFieldValue(field.id, event.target.value)}>
                                                        <option value="">— Seleccionar —</option>
                                                        {field.options.map((option) => (
                                                            <option key={option} value={option}>{option}</option>
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
                        <section className="space-y-3 pt-4 border-t border-neutral-50">
                            <div className="flex items-center gap-2 ml-1">
                                <StickyNote size={14} className="text-neutral-400" />
                                <Typography variant={TypographyVariant.CAPTION} className="font-black uppercase tracking-wider text-neutral-400 text-[10px]">
                                    {t(TEXT.CONTROLS.NEW.DIAGNOSIS.LABEL)}
                                </Typography>
                            </div>
                            <textarea
                                className="w-full p-6 rounded-app-xl border border-neutral-100 bg-neutral-50/30 text-sm min-h-[140px] outline-none focus:bg-white focus:ring-4 focus:ring-neutral-50 transition-all"
                                placeholder={t(TEXT.CONTROLS.NEW.DIAGNOSIS.PLACEHOLDER)}
                                value={formData.diagnosis}
                                onChange={(event) => setters.setFormData({ ...formData, diagnosis: event.target.value })}
                            />
                        </section>

                        {/* SEGUIMIENTO */}
                        <section className="p-6 rounded-app-xl border border-dashed border-primary-soft bg-primary-soft/20 space-y-4">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-primary" />
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-primary-dark text-sm">
                                    {t(TEXT.CONTROLS.NEW.SCHEDULING.TITLE)}
                                </Typography>
                            </div>
                            <FollowUpFields />
                        </section>

                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-50">
                            <Button variant={ButtonVariant.CANCEL} text={t(TEXT.CONTROLS.NEW.BUTTONS.CANCEL)} />
                            <Button
                                onClick={methods.handleSave}
                                variant={ButtonVariant.PRIMARY}
                                className="!h-12 !px-10 !rounded-app-sm shadow-lg shadow-primary-soft"
                                disabled={isPending}
                            >
                                <Save size={16} />
                                {isPending ? t(TEXT.CONTROLS.NEW.BUTTONS.SAVING) : t(TEXT.CONTROLS.NEW.BUTTONS.SAVE)}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* HISTORIAL LATERAL */}
                {showHistory && (
                    <div className="hidden md:block w-[35%] space-y-3 h-[calc(100vh-140px)] sticky top-24 overflow-y-auto pr-2">
                        <div className="flex items-center justify-between mb-4">
                            <Typography variant={TypographyVariant.SUBTITLE}>{t(TEXT.CONTROLS.NEW.HISTORY.TITLE)}</Typography>
                            <button
                                onClick={() => navigation.patients.detail(patientId)}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase text-neutral-400 hover:text-primary transition-colors"
                            >
                                Ver todo <ArrowRight size={12} />
                            </button>
                        </div>

                        {!historyData?.data?.length ? (
                            <div className="py-10 text-center border-2 border-dashed border-neutral-100 rounded-app-md">
                                <Typography variant={TypographyVariant.CAPTION} className="text-neutral-300 text-xs font-bold uppercase tracking-widest">
                                    Sin registros previos
                                </Typography>
                            </div>
                        ) : (
                            historyData.data.map((record: MedicalControlResponse) => {
                                const recordSpeciality = record.header?.speciality ?? 'GENERAL';
                                const recordMeta = SPECIALITY_META[recordSpeciality as MedicalSpeciality] ?? SPECIALITY_META[MedicalSpeciality.GENERAL];

                                return (
                                    <div
                                        key={record.uuid}
                                        onClick={() => navigation.patients.viewControl(patientId, record.uuid)}
                                        className="p-4 bg-white rounded-app-md border border-neutral-100 shadow-sm group hover:border-primary/30 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider"
                                                style={{ color: recordMeta.color, backgroundColor: recordMeta.bg }}
                                            >
                                                {recordMeta.label}
                                            </span>
                                            <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400">
                                                {new Date(record.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </Typography>
                                        </div>
                                        <Typography variant={TypographyVariant.CAPTION} className="text-xs text-neutral-500 line-clamp-2 leading-relaxed italic">
                                            {record.clinicalData?.diagnosis || 'Sin diagnóstico registrado'}
                                        </Typography>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
