import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import {
    Save, History, User, Activity, Calendar, Trash2, StickyNote, Clock, X, Plus, ChevronRight, Settings
} from 'lucide-react';
import { AudiometryCapture } from '@/components/containers/audiogram-capture/audiogram-capture';
import { PatientSummaryHeader } from '@/components/containers/patient-summary/patent-summary-header';

enum Speciality {
    AUDIOLOGY = 'Audiología',
    DENTAL = 'Odontología',
    DERMA = 'Dermatología',
    GENERAL = 'Medicina General'
}

const NewControlPage: React.FC = () => {
    const [showHistory, setShowHistory] = useState(true);
    const [showAudiogram, setShowAudiogram] = useState(false);
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        speciality: Speciality.AUDIOLOGY,
        nextMaintenanceDate: '',
        nextControlNotes: '',
        comments: '',
    });

    const setQuickDate = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        setFormData({ ...formData, nextMaintenanceDate: date.toISOString().split('T')[0] });
    };

    // Componente Reutilizable de Seguimiento
    const FollowUpFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {[7, 30, 90, 180].map((days) => (
                        <button
                            key={days}
                            type="button"
                            onClick={() => setQuickDate(days)}
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
                        onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>
            <textarea
                className="w-full p-4 bg-slate-50/50 rounded-xl border border-slate-200 text-sm min-h-[100px] outline-none focus:bg-white focus:border-blue-500"
                placeholder="Instrucciones para la próxima cita..."
                value={formData.nextControlNotes}
                onChange={(e) => setFormData({ ...formData, nextControlNotes: e.target.value })}
            />
        </div>
    );

    return (
        <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Expediente Digital">
            <>


                {/* MODAL DE SEGUIMIENTO */}
                {isFollowUpModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95">
                            <div className="flex justify-between items-center mb-6">
                                <Typography variant={TypographyVariant.SUBTITLE}>Programar Seguimiento</Typography>
                                <button onClick={() => setIsFollowUpModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                            </div>
                            <FollowUpFields />
                            <Button variant={ButtonVariant.PRIMARY} className="w-full mt-6 !h-12 !rounded-xl" onClick={() => setIsFollowUpModalOpen(false)}>Confirmar Fecha</Button>
                        </div>
                    </div>
                )}

                <div className="flex gap-8 max-w-[1600px] mx-auto pb-20 px-6">

                    <div className={`flex-1 transition-all duration-700 ${showHistory ? 'max-w-[65%]' : 'max-w-4xl mx-auto'}`}>

                        {/* INFO PACIENTE (MOCK) */}
                        <PatientSummaryHeader
                            onOpenFollowUp={() => setIsFollowUpModalOpen(true)}
                            onToggleHistory={() => setShowHistory(!showHistory)}
                            showHistory={showHistory}
                        />

                        <div className="space-y-6 bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl shadow-slate-200/20">

                            {/* SELECTOR ESPECIALIDAD */}
                            <section className="space-y-3">
                                <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 font-bold uppercase tracking-wider ml-1">Especialidad / Motivo</Typography>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(Speciality).map((spec) => (
                                        <button
                                            key={spec}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, speciality: spec })}
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
                                        <Typography variant={TypographyVariant.BODY_BOLD}>Exploración de {formData.speciality}</Typography>
                                    </div>
                                    {formData.speciality === Speciality.AUDIOLOGY && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAudiogram(!showAudiogram)}
                                            className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${showAudiogram ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}
                                        >
                                            {showAudiogram ? 'Quitar Audiometría' : '+ Audiometría'}
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.speciality === Speciality.AUDIOLOGY ? (
                                        <>
                                            <textarea className="w-full p-5 rounded-2xl border border-slate-100 bg-slate-50/30 text-sm min-h-[110px] outline-none focus:bg-white focus:border-red-200" placeholder="Otoscopia Oído Derecho..." />
                                            <textarea className="w-full p-5 rounded-2xl border border-slate-100 bg-slate-50/30 text-sm min-h-[110px] outline-none focus:bg-white focus:border-blue-200" placeholder="Otoscopia Oído Izquierdo..." />
                                            {showAudiogram && <div className="col-span-2 pt-2 animate-in slide-in-from-top-4"><AudiometryCapture /></div>}
                                        </>
                                    ) : (
                                        <textarea className="col-span-2 w-full p-5 rounded-2xl border border-slate-100 bg-slate-50/30 text-sm min-h-[130px] outline-none focus:bg-white focus:border-blue-200" placeholder={`Hallazgos clínicos de ${formData.speciality}...`} />
                                    )}
                                </div>
                            </section>

                            {/* COMENTARIOS FINALES */}
                            <section className="space-y-3 pt-4">
                                <div className="flex items-center gap-2 text-slate-400 ml-1">
                                    <StickyNote size={16} />
                                    <Typography variant={TypographyVariant.CAPTION} className="font-bold uppercase tracking-wider">Diagnóstico y Observaciones</Typography>
                                </div>
                                <textarea className="w-full p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30 text-sm min-h-[150px] outline-none focus:bg-white focus:ring-4 focus:ring-slate-50 transition-all" placeholder="Escriba el plan de tratamiento o conclusiones..." />
                            </section>

                            {/* SEGUIMIENTO EN PANTALLA (LIMPIO) */}
                            <section className="p-8 rounded-[2.5rem] bg-blue-50/30 border border-blue-100/50 space-y-5">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-blue-600" />
                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-blue-900">Programar Seguimiento</Typography>
                                </div>
                                <FollowUpFields />
                            </section>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                                <Button variant={ButtonVariant.CANCEL} text="Cancelar" />
                                <Button variant={ButtonVariant.PRIMARY} className="!h-12 !px-10 !rounded-xl shadow-lg shadow-blue-200">
                                    <Save size={18} /> Guardar Consulta
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* HISTORIAL (MOCK) */}
                    {showHistory && (
                        <div className="w-[35%] space-y-4 h-[calc(100vh-140px)] sticky top-24 overflow-y-auto pr-2">
                            <div className="flex items-center justify-between mb-4">
                                <Typography variant={TypographyVariant.SUBTITLE}>Historial</Typography>
                                <Settings size={16} className="text-slate-300" />
                            </div>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">Consulta</span>
                                        <span className="text-[10px] text-slate-400 font-medium">10/02/2026</span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">"El paciente presenta buena evolución, se recomienda continuar con el uso de auxiliares..."</p>
                                    <div className="mt-3 flex items-center text-[10px] font-bold text-slate-400 group-hover:text-blue-500 cursor-pointer">
                                        VER DETALLES <ChevronRight size={12} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </>

        </DashboardLayout>
    );
};

export default NewControlPage;