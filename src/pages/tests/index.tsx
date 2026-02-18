import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { FileText, Download, Eye } from 'lucide-react';

const Tests: React.FC = () => {
    const mockTests = [
        { id: 1, date: '2024-02-14', patient: 'Farid Villacis', test: 'Audiometría Tonal', score: 'Pérdida Leve' },
        { id: 2, date: '2024-02-12', patient: 'Ana Lopez', test: 'Timpanometría', score: 'Curva Tipo A' },
        { id: 3, date: '2024-02-10', patient: 'Carlos Ruiz', test: 'Logoaudiometría', score: '90% Disc.' },
    ];

    return (
        <>
            <Head><title>Pruebas </title></Head>
            <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title="Registro de Pruebas">
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Fecha</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Paciente</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Prueba</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Resultado</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mockTests.map((test) => (
                                <tr key={test.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{test.date}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{test.patient}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-2 text-sm text-blue-600 font-bold">
                                            <FileText size={14} /> {test.test}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{test.score}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Eye size={16} /></button>
                                            <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><Download size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default Tests;