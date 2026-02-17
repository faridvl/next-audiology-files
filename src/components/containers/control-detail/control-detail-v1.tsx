import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';
import { useControlDetail } from './use-control-detail';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';

interface Props { patientId: string; controlId: string; }

export const ControlDetailContainer: React.FC<Props> = ({ patientId, controlId }) => {
    const navigation = useNavigation();
    const { data, isLoading, isError } = useControlDetail(patientId, controlId);

    if (isLoading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando Expediente...</div>;
    if (isError || !data) return <div className="p-20 text-center text-slate-500 font-medium">Error al recuperar el registro médico.</div>;

    const { patient, control } = data;

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 space-y-8 font-['Roboto',sans-serif] animate-in fade-in duration-700">
            {/* ACCIONES */}
            <div className="flex justify-between items-center no-print">
                <button
                    onClick={() => navigation.patients.detail(patientId)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all"
                >
                    <ArrowLeft size={14} /> Volver al detalle del paciente
                </button>
                <button onClick={() => window.print()} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <Printer size={18} />
                </button>
            </div>

            <div className="bg-white border border-slate-300 shadow-sm rounded-none print:shadow-none print:border-slate-200">
                {/* CABECERA HOSPITALARIA */}
                <div className="p-10 border-b-4 border-slate-900 flex justify-between items-start bg-slate-50">
                    <div className="space-y-1">
                        <p className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">{control.institution}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Expediente Clínico Digital</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-block bg-slate-900 text-white px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase">
                            Copia de Archivo
                        </div>
                    </div>
                </div>

                {/* TABLA DE DATOS DEL PACIENTE */}
                <div className="bg-white grid grid-cols-2 md:grid-cols-4 border-b border-slate-200">
                    <HeaderCell label="Nombre del Paciente" value={patient.fullName} className="col-span-2" />
                    <HeaderCell label="ID Registro" value={patient.documentId} />
                    <HeaderCell label="Género" value={patient.gender} />
                    <HeaderCell label="Edad Cronológica" value={patient.age} />
                    <HeaderCell label="Tipo Sangre" value={patient.bloodType} />
                    <HeaderCell label="Fecha Emisión" value={control.date} />
                    <HeaderCell label="Folio Interno" value={control.id.substring(0, 8).toUpperCase()} />
                </div>

                {/* CUERPO TÉCNICO */}
                <div className="p-12 md:p-16 space-y-12">
                    <DetailRow label="Especialidad" value={control.speciality === MedicalSpeciality.AUDIOLOGY ? 'AUDIOLOGÍA CLÍNICA' : control.speciality} isBold />

                    {/* HALLAZGOS AUDIOLÓGICOS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 border-t border-slate-50 pt-8">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-1 leading-relaxed">Hallazgos Clínicos</div>
                        <div className="md:col-span-3 space-y-8">
                            {/* Observaciones de Otoscopía */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase mb-2 tracking-wide">Otoscopía Derecha</p>
                                    <p className="text-sm text-slate-600 leading-relaxed border-l border-slate-900 pl-4 uppercase text-xs">{control.findings.otoscopyRight}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase mb-2 tracking-wide">Otoscopía Izquierda</p>
                                    <p className="text-sm text-slate-600 leading-relaxed border-l border-slate-900 pl-4 uppercase text-xs">{control.findings.otoscopyLeft}</p>
                                </div>
                            </div>

                            {/* Notas Adicionales con Viñetas */}
                            <div className="space-y-2 border-t border-slate-100 pt-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Observaciones Técnicas</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                    <StatusRow label="Limpieza técnica realizada" status={control.findings.cleaningPerformed} />
                                    <StatusRow label="Usuario de auxiliares auditivos" status={control.findings.usesAuxiliaries} />
                                    <StatusRow label="Presencia de Tinnitus" status={control.findings.tinnitus} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DetailRow label="Diagnóstico Final" value={control.diagnosis} isBold />

                    {/* PLAN MÉDICO */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-slate-50 pt-8">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-1">Plan de Tratamiento</div>
                        <ul className="md:col-span-3 space-y-3">
                            {control.plan.map((item, i) => (
                                <li key={i} className="text-[13px] text-slate-700 flex gap-3 font-medium uppercase tracking-tight">
                                    <span className="text-slate-300 font-black">{i + 1}.</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* FIRMA Y SELLO */}
                <div className="p-16 pt-0 mt-12 flex justify-start">
                    <div className="w-72 border-t-2 border-slate-900 pt-4">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{control.specialistName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Firma y Cédula Profesional</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 text-[8px] text-slate-400 font-black uppercase tracking-[0.3em] text-center border-t border-slate-200">
                    Generado digitalmente por sistema clínico • {new Date().toLocaleString('es-ES')}
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTES AUXILIARES ---

const StatusRow = ({ label, status }: { label: string, status: boolean }) => (
    <div className="flex items-center gap-2">
        <span className={`text-[10px] ${status ? 'text-slate-900' : 'text-slate-300'}`}>
            {status ? '•' : '○'}
        </span>
        <span className={`text-[11px] font-bold uppercase tracking-tight ${status ? 'text-slate-700' : 'text-slate-400 line-through decoration-slate-200'}`}>
            {label}
        </span >
    </div >
);

const HeaderCell: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = "" }) => (
    <div className={`p-6 border-r border-b border-slate-100 last:border-r-0 ${className}`}>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-xs font-bold text-slate-900 truncate uppercase">{value || "---"}</p>
    </div>
);

const DetailRow = ({ label, value, isBold = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-slate-50 pt-8 first:border-0 first:pt-0">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-1">{label}</div>
        <div className={`md:col-span-3 text-[13px] leading-relaxed uppercase tracking-tight ${isBold ? 'font-black text-slate-900' : 'text-slate-600 font-medium'}`}>
            {value}
        </div>
    </div>
);