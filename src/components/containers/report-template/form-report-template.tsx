// import React, { useState } from 'react';
// import dynamic from 'next/dynamic';
// import { Save, ArrowLeft, FileText, Layout, Info, Eye, Bold, Italic, List, ListOrdered, Type } from 'lucide-react';
// import { Typography, TypographyVariant } from '@/components/common/typography/typography';
// import { Button, ButtonVariant } from '@/components/common/button/button';
// import { useNavigation } from '@/hooks/use-navigation';

// // Importación dinámica para evitar errores de SSR con Quill
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// import 'react-quill/dist/quill.snow.css';

// export const ReportTemplateCreateContainer: React.FC = () => {
//     const { common } = useNavigation();
//     const [template, setTemplate] = useState({
//         name: '',
//         title: 'Reporte Audiológico',
//         content: '',
//         footer: 'Cualquier consulta o duda, favor contactarse al número de teléfono 8447-9893. Se extiende el presente reporte a solicitud del interesado a los 04 días del mes de febrero del 2026.'
//     });

//     const handleChange = (field: string, value: string) => {
//         setTemplate(prev => ({ ...prev, [field]: value }));
//     };

//     // Configuración de la barra de herramientas
//     const modules = {
//         toolbar: [
//             [{ 'header': [1, 2, false] }],
//             ['bold', 'italic', 'underline', 'strike'],
//             [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//             ['clean']
//         ],
//     };

//     return (
//         <div className="max-w-7xl mx-auto pb-20">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-8">
//                 <button onClick={() => common.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
//                     <ArrowLeft size={20} />
//                     <Typography variant={TypographyVariant.BODY_SEMIBOLD}>Volver a Plantillas</Typography>
//                 </button>

//                 <Button variant={ButtonVariant.PRIMARY} className="rounded-2xl px-8 shadow-lg shadow-blue-500/20">
//                     <Save size={18} />
//                     <Typography variant={TypographyVariant.BUTTON_TEXT}>Guardar Plantilla</Typography>
//                 </Button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

//                 {/* Panel de Edición */}
//                 <div className="space-y-6">
//                     <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8">
//                         <div className="flex items-center gap-3 text-blue-600 border-b border-slate-50 pb-6">
//                             <Layout size={22} />
//                             <Typography variant={TypographyVariant.BODY_BOLD}>Configurar Machote</Typography>
//                         </div>

//                         {/* Nombre Interno */}
//                         <div className="space-y-2">
//                             <Typography variant={TypographyVariant.OVERLINE} className="ml-1 text-slate-400 font-bold">Nombre de la Plantilla (Interno)</Typography>
//                             <input
//                                 type="text"
//                                 placeholder="Ej: Reporte Estándar de Audiometría"
//                                 value={template.name}
//                                 onChange={(e) => handleChange('name', e.target.value)}
//                                 className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
//                             />
//                         </div>

//                         {/* Cuerpo del Reporte con Editor de Formato */}
//                         <div className="space-y-3">
//                             <div className="flex justify-between items-center ml-1">
//                                 <Typography variant={TypographyVariant.OVERLINE} className="text-slate-400 font-bold">Cuerpo del Mensaje</Typography>
//                                 <div className="group relative cursor-help">
//                                     <Info size={14} className="text-blue-400" />
//                                     <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
//                                         Variables: <b>{"{paciente}"}, {"{cedula}"}, {"{fecha}"}</b>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Editor de Texto Enriquecido */}
//                             <div className="quill-container border border-slate-100 rounded-[2rem] overflow-hidden bg-slate-50/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
//                                 <ReactQuill
//                                     theme="snow"
//                                     value={template.content}
//                                     onChange={(content) => handleChange('content', content)}
//                                     modules={modules}
//                                     placeholder="Escribe la leyenda aquí y dale formato..."
//                                     className="border-none"
//                                 />
//                             </div>

//                             {/* Estilos CSS personalizados para Quill para que encaje con tu diseño */}
//                             <style jsx global>{`
//                                 .ql-toolbar.ql-snow {
//                                     border: none !important;
//                                     background: #f8fafc;
//                                     padding: 12px 20px !important;
//                                     border-bottom: 1px solid #f1f5f9 !important;
//                                 }
//                                 .ql-container.ql-snow {
//                                     border: none !important;
//                                     font-family: inherit !important;
//                                     font-size: 0.875rem !important;
//                                     min-h: 300px;
//                                 }
//                                 .ql-editor {
//                                     padding: 24px 24px !important;
//                                     min-height: 300px !important;
//                                 }
//                                 .ql-editor.ql-blank::before {
//                                     color: #cbd5e1 !important;
//                                     font-style: normal !important;
//                                     left: 24px !important;
//                                 }
//                             `}</style>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Vista Previa */}
//                 <div className="sticky top-10">
//                     <div className="flex items-center gap-2 mb-4 ml-4 text-slate-400">
//                         <Eye size={16} />
//                         <Typography variant={TypographyVariant.CAPTION} className="font-bold uppercase tracking-widest">Vista Previa</Typography>
//                     </div>

//                     <div className="bg-white shadow-2xl shadow-slate-300/50 rounded-lg aspect-[1/1.41] p-16 border border-slate-100 relative overflow-hidden overflow-y-auto">
//                         <div className="flex justify-end mb-16">
//                             <div className="text-right">
//                                 <div className="h-10 w-32 bg-slate-50 rounded mb-2 ml-auto border border-slate-100" />
//                                 <Typography variant={TypographyVariant.CAPTION} className="text-slate-300">FECHA: 00/00/0000</Typography>
//                             </div>
//                         </div>

//                         <div className="text-center mb-12">
//                             <Typography variant={TypographyVariant.BODY_BOLD} className="uppercase tracking-[0.2em] text-slate-800 border-b-2 border-slate-800 pb-2 inline-block">
//                                 {template.title}
//                             </Typography>
//                         </div>

//                         {/* Aquí usamos dangerouslySetInnerHTML para renderizar el HTML del editor en la previa */}
//                         <div className="space-y-6 text-slate-700">
//                             <div
//                                 className="text-[13px] leading-relaxed preview-content"
//                                 dangerouslySetInnerHTML={{ __html: template.content || '<p class="text-slate-300 italic">La previsualización aparecerá aquí...</p>' }}
//                             />

//                             <div className="pt-12 mt-12 border-t border-slate-100">
//                                 <Typography variant={TypographyVariant.CAPTION} className="text-slate-400 italic leading-snug">
//                                     {template.footer}
//                                 </Typography>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


import { Save, AlertCircle } from 'lucide-react'; // Asumiendo que usas lucide-react
import React, { useState } from 'react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { ClipboardList, MessageSquare, CheckCircle2, Circle } from 'lucide-react';

interface Question {
    id: string;
    label: string;
    value: 'si' | 'no' | 'na' | null;
    notes: string;
}



// 1. Definimos la estructura de una "Pregunta de Historia Clínica"
interface HistoryQuestion {
    id: string;
    category: string;
    question: string;
}

interface HistoryResponse {
    value: boolean;
    note: string;
}

export const ReportTemplateCreateContainer: React.FC = () => {
    // Ejemplo de cómo vendrían las preguntas desde una base de datos o config
    const [questions] = useState<HistoryQuestion[]>([
        { id: '1', category: 'Cita al año', question: '¿Ha tenido cirugías previas en el oído?' },
        { id: '2', category: 'Cita al año', question: '¿Padece de hipertensión o diabetes?' },
        { id: '3', category: 'Cita al año', question: '¿Siente mareos o vértigo frecuentemente?' },
        { id: '4', category: 'Cita al año', question: '¿Presenta dolor punzante actualmente?' },
        { id: '5', category: 'Cita al año', question: '¿Trabaja en ambientes con ruido extremo?' },
    ]);

    // Estado para almacenar las respuestas { "id_pregunta": { value: true, note: "..." } }
    const [responses, setResponses] = useState<Record<string, HistoryResponse>>({});

    const handleToggle = (id: string) => {
        setResponses(prev => ({
            ...prev,
            [id]: {
                value: !prev[id]?.value,
                note: prev[id]?.note || ''
            }
        }));
    };

    const handleNoteChange = (id: string, note: string) => {
        setResponses(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                note
            }
        }));
    };

    // Agrupamos preguntas por categoría para el renderizado
    const categories = Array.from(new Set(questions.map(q => q.category)));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {categories.map((category) => (
                <div key={category} className="space-y-4">
                    {/* Título de Categoría */}
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-slate-400 uppercase tracking-wider text-[11px]">
                            {category}
                        </Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {questions
                            .filter(q => q.category === category)
                            .map((q) => {
                                const isChecked = responses[q.id]?.value;
                                return (
                                    <div
                                        key={q.id}
                                        className={`group p-5 rounded-[2rem] border transition-all duration-300 ${isChecked
                                            ? 'bg-blue-50 border-blue-100 shadow-sm'
                                            : 'bg-white border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div
                                                className="flex-1 cursor-pointer"
                                                onClick={() => handleToggle(q.id)}
                                            >
                                                <Typography variant={TypographyVariant.BODY} className="text-slate-700">
                                                    {q.question}
                                                </Typography>
                                            </div>

                                            {/* Switch / Check Personalizado */}
                                            <button
                                                onClick={() => handleToggle(q.id)}
                                                className={`transition-colors ${isChecked ? 'text-blue-600' : 'text-slate-200'}`}
                                            >
                                                {isChecked ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                                            </button>
                                        </div>

                                        {/* Área de Nota (Se expande si hay nota o si está marcado) */}
                                        <div className={`mt-4 overflow-hidden transition-all ${isChecked ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="flex items-center gap-2 bg-white/50 rounded-2xl px-4 py-2 border border-blue-100/50">
                                                <MessageSquare size={14} className="text-blue-300" />
                                                <input
                                                    type="text"
                                                    placeholder="Agregar detalles o notas..."
                                                    value={responses[q.id]?.note || ''}
                                                    onChange={(e) => handleNoteChange(q.id, e.target.value)}
                                                    className="w-full bg-transparent text-xs py-1 outline-none text-slate-600 placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            ))}

            {/* Empty State si no hay preguntas */}
            {questions.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <ClipboardList size={48} className="mx-auto text-slate-200 mb-4" />
                    <Typography variant={TypographyVariant.BODY} className="text-slate-400">
                        No hay preguntas configuradas para esta especialidad.
                    </Typography>
                </div>
            )}
        </div>
    );
};