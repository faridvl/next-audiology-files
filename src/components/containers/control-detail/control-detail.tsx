import React from 'react';
import {
    ArrowLeft, User, Calendar, Activity,
    ShieldCheck, Hash, Phone, Clock, FileText,
    Download, Printer, Bookmark,
    Stethoscope
} from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useNavigation } from '@/hooks/use-navigation';

interface Props {
    patientId: string;
    controlId: string;
}

export const ControlDetailContainer: React.FC<Props> = ({ patientId, controlId }) => {
    const navigation = useNavigation();

    // Data Mock
    const data = {
        patient: {
            name: "CARLOS EDUARDO RODRÍGUEZ",
            age: "45 AÑOS",
            id: "1-1234-5678",
            bloodType: "O POSITIVO",
            phone: "+506 8888-8888",
            gender: "MASCULINO"
        },
        control: {
            date: '15 FEB 2026',
            hour: '14:30',
            speciality: 'AUDIOLOGÍA CLÍNICA',
            specialist: 'DR. ROBERTO GÓMEZ SOLANO',
            license: 'COD. MED-7742',
            institution: 'CENTRO MÉDICO HOSPITALARIO',
            findings: "Paciente refiere tinnitus leve en oído derecho tras exposición a ruido. En la otoscopia se observa conducto auditivo externo sin obstrucciones, membrana timpánica íntegra y translúcida en ambos oídos. No se observa eritema ni abombamiento.",
            diagnosis: "HIPOACUSIA NEUROSENSORIAL BILATERAL DE PREDOMINIO DERECHO.",
            plan: [
                "Uso de protectores auditivos en ambientes ruidosos.",
                "Limpieza técnica de moldes y revisión de filtros.",
                "Reevaluación en 6 meses con nueva audiometría tonal."
            ],
            nextAppointment: "15 AGOSTO 2026"
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 space-y-8 font-['Roboto',sans-serif] animate-in fade-in duration-700">

            {/* ACCIONES DE SISTEMA */}
            <div className="flex justify-between items-center no-print">
                <button
                    onClick={() => navigation.patients.detail(patientId)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-medium text-xs uppercase tracking-widest transition-all"
                >
                    <ArrowLeft size={14} /> Volver al Registro del Paciente
                </button>
                <div className="flex gap-4">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Printer size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Download size={18} /></button>
                </div>
            </div>

            {/* EXPEDIENTE MÉDICO */}
            <div className="bg-white border border-slate-300 shadow-sm rounded-none">

                {/* ENCABEZADO HOSPITALARIO */}
                <div className="p-10 border-b-4 border-slate-900 flex justify-between items-start bg-slate-50">
                    <div className="space-y-1">
                        <p className="text-xl font-black text-slate-900 tracking-tighter uppercase">{data.control.institution}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Sistema de Gestión de Expedientes Digitales</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-block bg-slate-900 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                            Copia de Archivo
                        </div>
                    </div>
                </div>

                {/* BANNER DE DATOS DEL PACIENTE (TABLA TÉCNICA) */}
                <div className="bg-white grid grid-cols-2 md:grid-cols-4 border-b border-slate-200">
                    <HeaderCell label="Paciente" value={data.patient.name} className="col-span-2" />
                    <HeaderCell label="Identificación" value={data.patient.id} />
                    <HeaderCell label="Género" value={data.patient.gender} />
                    <HeaderCell label="Edad" value={data.patient.age} />
                    <HeaderCell label="Tipo Sangre" value={data.patient.bloodType} />
                    <HeaderCell label="Fecha Consulta" value={data.control.date} />
                    <HeaderCell label="ID Documento" value={controlId.toUpperCase()} />
                </div>

                {/* CUERPO DEL REGISTRO */}
                <div className="p-12 md:p-16 space-y-12">

                    {/* FILA: ESPECIALIDAD */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] self-start pt-1">
                            Especialidad
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                                {data.control.speciality}
                            </p>
                        </div>
                    </div>

                    {/* FILA: HALLAZGOS (Mismo peso que el diagnóstico) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] self-start pt-1">
                            Notas Clínicas
                        </div>
                        <div className="md:col-span-3 text-slate-600 text-sm leading-relaxed text-justify">
                            {data.control.findings}
                        </div>
                    </div>

                    {/* FILA: DIAGNÓSTICO (Sin énfasis extra, solo ordenado) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-slate-50 pt-8">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] self-start pt-1">
                            Diagnóstico
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-sm font-bold text-slate-900 leading-snug">
                                {data.control.diagnosis}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                                Codificación: H90.3 / Confirmado
                            </p>
                        </div>
                    </div>

                    {/* FILA: PLAN */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2 border-t border-slate-50 pt-8">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] self-start pt-1">
                            Plan Médico
                        </div>
                        <div className="md:col-span-3">
                            <ul className="space-y-3">
                                {data.control.plan.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-3">
                                        <span className="text-[10px] font-black text-slate-300 pt-0.5">{i + 1}.</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* PIE DE PÁGINA TÉCNICO */}
                <div className="bg-slate-50 p-6 text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center border-t border-slate-200">
                    Propiedad Privada del Paciente - Confidencialidad bajo Ley de Protección de Datos
                </div>
            </div>
        </div>
    );
};

const HeaderCell = ({ label, value, className = "" }: any) => (
    <div className={`p-5 border-r border-slate-100 last:border-r-0 ${className}`}>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xs font-bold text-slate-900 tracking-tight uppercase">{value}</p>
    </div>
);