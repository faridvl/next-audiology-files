import React, { useState, useMemo } from 'react';
import {
    Save, Activity, Clock, StickyNote, Search, Calendar, ExternalLink, Settings, ChevronRight
} from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { PatientSummaryHeader } from '@/components/containers/patient-summary/patent-summary-header';
import { useNewControl } from './use-new-control';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { useMedicalControlsQuery } from '@/shared/api/querys/medical-controls-query';
import { useNavigation } from '@/hooks/use-navigation';
import { MedicalHistorySidebar } from '../control-history/control-history';
import { AudiogramEditor } from '../../audiogram-editor/audiogram-editor';


// --- CONTENEDOR PRINCIPAL ---
export const NewControlContainer: React.FC<{ patientId: string; appointmentId?: string }> = ({
    patientId,
    appointmentId
}) => {
    const { states, setters, methods } = useNewControl(patientId, appointmentId);
    const { speciality, diagnosis, findings, followUp, showHistory, isPending, showAudiogram } = states;

    return (
        <div className="flex gap-10 max-w-[1700px] mx-auto pb-20 px-8 items-start">
            <div className={`flex-1 transition-all duration-700 ease-in-out ${showHistory ? 'max-w-[62%]' : 'max-w-4xl mx-auto'}`}>

                <PatientSummaryHeader
                    patientId={patientId}
                    onOpenFollowUp={() => setters.setFollowUp({ ...followUp, hasFollowUp: true })}
                    onToggleHistory={() => setters.setShowHistory(!showHistory)}
                    showHistory={showHistory}
                />

                <div className="space-y-8 bg-white border border-neutral-100 p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/20">

                    {/* Selector de Especialidad - UX mejorada con Pills */}
                    <section className="space-y-3">
                        <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-bold uppercase tracking-widest ml-1">Especialidad de la Consulta</Typography>
                        <div className="flex gap-2 p-1.5 bg-neutral-50 w-fit rounded-app-md border border-neutral-100">
                            {Object.values(MedicalSpeciality).map((spec) => (
                                <button
                                    key={spec}
                                    onClick={() => methods.handleChangeSpeciality(spec)}
                                    className={`px-6 py-2 rounded-app-sm text-[11px] font-bold uppercase tracking-wider transition-all ${speciality === spec
                                        ? 'bg-white shadow-md text-primary border border-neutral-100'
                                        : 'text-neutral-400 hover:text-neutral-600'}`}
                                >
                                    {spec}
                                </button>
                            ))}
                        </div>
                    </section>



                    {/* Exploración Clínica */}
                    {/* <section className="space-y-6 pt-2">
                        <div className="flex items-center gap-3">
                            <Activity size={20} className="text-primary" />
                            <Typography variant={TypographyVariant.BODY_BOLD} className="uppercase tracking-widest text-sm text-neutral-700">Exploración Clínica</Typography>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {speciality === MedicalSpeciality.AUDIOLOGY ? (
                                <>
                                    <div className="space-y-2">
                                        <Typography variant={TypographyVariant.CAPTION} className="ml-4 font-black text-neutral-400 uppercase text-[9px]">Oído Derecho</Typography>
                                        <textarea
                                            placeholder="Otoscopia y hallazgos..."
                                            value={findings.otoscopyRight}
                                            onChange={(e) => methods.updateFinding('otoscopyRight', e.target.value)}
                                            className="w-full p-5 rounded-[1.5rem] border border-neutral-100 bg-neutral-50/30 text-sm min-h-[110px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Typography variant={TypographyVariant.CAPTION} className="ml-4 font-black text-neutral-400 uppercase text-[9px]">Oído Izquierdo</Typography>
                                        <textarea
                                            placeholder="Otoscopia y hallazgos..."
                                            value={findings.otoscopyLeft}
                                            onChange={(e) => methods.updateFinding('otoscopyLeft', e.target.value)}
                                            className="w-full p-5 rounded-[1.5rem] border border-neutral-100 bg-neutral-50/30 text-sm min-h-[110px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                                        />
                                    </div>
                                    <div className="col-span-2 flex flex-wrap gap-6 px-6 py-4 bg-neutral-50/50 rounded-app-md border border-neutral-100">
                                        {['cleaningPerformed', 'usesAuxiliaries', 'tinnitus'].map((key) => (
                                            <label key={key} className="flex items-center gap-3 text-[10px] font-black text-neutral-500 cursor-pointer hover:text-primary transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-blue-500"
                                                    checked={(findings as any)[key]}
                                                    onChange={(e) => methods.updateFinding(key as any, e.target.checked)}
                                                />
                                                {key === 'cleaningPerformed' ? 'LIMPIEZA REALIZADA' : key === 'usesAuxiliaries' ? 'USA AUXILIARES' : 'PRESENCIA TINNITUS'}
                                            </label>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <textarea
                                    className="col-span-2 w-full p-6 rounded-[2rem] border border-neutral-100 bg-neutral-50/30 text-sm min-h-[150px] outline-none focus:bg-white transition-all shadow-inner"
                                    placeholder={`Hallazgos clínicos de ${speciality}...`}
                                    value={findings.generalNotes || ''}
                                    onChange={(e) => methods.updateFinding('generalNotes', e.target.value)}
                                />
                            )}
                        </div>
                    </section> */}

                    <section className="space-y-6 pt-2">
                        <div className="flex items-center justify-between pr-4"> {/* Justify between para el botón */}
                            <div className="flex items-center gap-3">
                                <Activity size={20} className="text-primary" />
                                <Typography variant={TypographyVariant.BODY_BOLD} className="uppercase tracking-widest text-sm text-neutral-700">
                                    Exploración Clínica
                                </Typography>
                            </div>

                            {/* BOTÓN DE AUDIOMETRÍA */}
                            {speciality === MedicalSpeciality.AUDIOLOGY && (
                                <button
                                    type="button"
                                    onClick={() => setters.setShowAudiogram(!showAudiogram)}
                                    className={`text-[10px] font-black uppercase px-4 py-2 rounded-app-sm border transition-all ${showAudiogram
                                        ? 'bg-danger/10 text-danger border-danger/10 hover:bg-danger/20'
                                        : 'bg-primary-soft text-primary border-primary-soft hover:bg-primary-soft/70'
                                        }`}
                                >
                                    {showAudiogram ? '✕ Quitar Audiometría' : '+ Añadir Audiometría'}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {speciality === MedicalSpeciality.AUDIOLOGY ? (
                                <>
                                    {/* Inputs de Otoscopia */}
                                    <div className="space-y-2">
                                        <Typography variant={TypographyVariant.CAPTION} className="ml-4 font-black text-neutral-400 uppercase text-[9px]">Oído Derecho</Typography>
                                        <textarea
                                            placeholder="Otoscopia y hallazgos..."
                                            value={findings.otoscopyRight}
                                            onChange={(e) => methods.updateFinding('otoscopyRight', e.target.value)}
                                            className="w-full p-5 rounded-[1.5rem] border border-neutral-100 bg-neutral-50/30 text-sm min-h-[110px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Typography variant={TypographyVariant.CAPTION} className="ml-4 font-black text-neutral-400 uppercase text-[9px]">Oído Izquierdo</Typography>
                                        <textarea
                                            placeholder="Otoscopia y hallazgos..."
                                            value={findings.otoscopyLeft}
                                            onChange={(e) => methods.updateFinding('otoscopyLeft', e.target.value)}
                                            className="w-full p-5 rounded-[1.5rem] border border-neutral-100 bg-neutral-50/30 text-sm min-h-[110px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
                                        />
                                    </div>

                                    {/* RENDER CONDICIONAL DEL CAPTURADOR DE AUDIOMETRÍA */}
                                    {showAudiogram && (
                                        <div className="col-span-2 pt-4 animate-in fade-in zoom-in-95 duration-300">
                                            <div className="p-1 bg-neutral-100 rounded-[2.5rem]">
                                                {/* Aquí va tu componente de captura */}
                                                <AudiogramEditor onChange={() => { }} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Checkboxes de Audiología */}
                                    <div className="col-span-2 flex flex-wrap gap-6 px-6 py-4 bg-neutral-50/50 rounded-app-md border border-neutral-100">
                                        {/* ... tus labels de cleaningPerformed, etc */}
                                    </div>
                                </>
                            ) : (
                                /* Medicina General / Otros */
                                <textarea
                                    className="col-span-2 w-full p-6 rounded-[2rem] border border-neutral-100 bg-neutral-50/30 text-sm min-h-[150px] outline-none focus:bg-white transition-all shadow-inner"
                                    placeholder={`Hallazgos clínicos de ${speciality}...`}
                                    value={findings.generalNotes || ''}
                                    onChange={(e) => methods.updateFinding('generalNotes', e.target.value)}
                                />
                            )}
                        </div>
                    </section>

                    {/* Impresión Diagnóstica */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-neutral-400">
                            <StickyNote size={18} />
                            <Typography variant={TypographyVariant.CAPTION} className="font-bold uppercase tracking-[0.2em]">Diagnóstico y Plan</Typography>
                        </div>
                        <textarea
                            className="w-full p-8 rounded-[2.5rem] border border-neutral-100 bg-neutral-50/30 text-sm min-h-[160px] outline-none focus:bg-white focus:ring-4 focus:ring-slate-100/50 transition-all uppercase leading-relaxed"
                            placeholder="Describa el juicio clínico y plan de tratamiento..."
                            value={diagnosis}
                            onChange={(e) => setters.setDiagnosis(e.target.value)}
                        />
                    </section>

                    {/* Seguimiento Integrado (Estética Final) */}
                    <section className="p-8 rounded-[3rem] bg-primary-soft/30 border border-primary-soft/50 space-y-6">
                        <div className="flex items-center gap-3 text-blue-900/60">
                            <Clock size={18} />
                            <Typography variant={TypographyVariant.BODY_BOLD} className="uppercase tracking-widest text-xs">Agendar Próximo Control</Typography>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                                    <input
                                        type="date"
                                        className="w-full pl-12 pr-4 py-4 rounded-app-md border border-primary-soft text-sm outline-none focus:border-blue-400 bg-white transition-all shadow-sm"
                                        value={followUp.tentativeDate}
                                        onChange={(e) => setters.setFollowUp({ ...followUp, tentativeDate: e.target.value, hasFollowUp: !!e.target.value })}
                                    />
                                </div>
                            </div>
                            <textarea
                                className="w-full p-4 rounded-app-md border border-primary-soft text-sm min-h-[60px] outline-none focus:border-blue-400 bg-white transition-all shadow-sm"
                                placeholder="Notas para el agendamiento..."
                                value={followUp.notes}
                                onChange={(e) => setters.setFollowUp({ ...followUp, notes: e.target.value })}
                            />
                        </div>
                    </section>

                    {/* Botonera Final */}
                    <div className="flex justify-end pt-6 border-t border-neutral-50">
                        <Button
                            onClick={methods.handleSave}
                            variant={ButtonVariant.PRIMARY}
                            className="!h-14 !px-12 !rounded-app-md transition-all hover:scale-[1.02] shadow-xl shadow-blue-500/20 active:scale-95 text-[11px] font-black uppercase tracking-[0.2em]"
                            disabled={isPending}
                        >
                            {isPending ? 'GUARDANDO...' : (
                                <>
                                    <Save size={18} className="mr-3" /> GUARDAR CONSULTA
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sidebar de Historial Condicional */}
            {showHistory && <MedicalHistorySidebar patientId={patientId} />}
        </div>
    );
};