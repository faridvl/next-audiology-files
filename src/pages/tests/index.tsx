import React, { useState } from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { FileText, Download, Eye, Search, Filter } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

const TestsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const mockTests = [
        { id: 1, date: '2024-02-14', patient: 'Farid Villacis', test: 'Audiometría Tonal', score: 'Pérdida Leve', type: 'AUDIOLOGY' },
        { id: 2, date: '2024-02-12', patient: 'Ana Lopez', test: 'Timpanometría', score: 'Curva Tipo A', type: 'DENTAL' }, // Solo ejemplo de colores
        { id: 3, date: '2024-02-10', patient: 'Carlos Ruiz', test: 'Logoaudiometría', score: '90% Disc.', type: 'GENERAL' },
    ];

    return (
        <>
            <Head><title>Registro de Pruebas | Sistema Médico</title></Head>
            <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title="Registro de Pruebas">

                <div className="space-y-6">
                    {/* TOOLBAR SUPERIOR */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar por paciente o tipo de prueba..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-200 rounded-2xl text-xs outline-none transition-all"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                            <Filter size={14} /> Filtrar Fecha
                        </button>
                    </div>

                    {/* TABLA DE RESULTADOS */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Fecha de Estudio</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Paciente</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Tipo de Prueba</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Resultado / Score</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {mockTests.map((test) => (
                                    <tr key={test.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-5 text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                                            {test.date}
                                        </td>
                                        <td className="px-8 py-5">
                                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-slate-900">
                                                {test.patient}
                                            </Typography>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-blue-600">
                                                <div className="p-1.5 bg-blue-50 rounded-lg">
                                                    <FileText size={14} />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-tight">{test.test}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                {test.score}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-xl transition-all" title="Ver Expediente">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-white hover:shadow-sm rounded-xl transition-all" title="Descargar PDF">
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default TestsPage;