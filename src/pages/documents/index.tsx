import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import {
    Trash2, Link as LinkIcon, ShieldCheck,
    Receipt, FilePlus, Search, Upload, Eye
} from 'lucide-react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { authorizeServerSidePage } from '@/hocs/auth';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';

// --- TIPOS ---
enum DocCategory {
    RECEIPT = 'Recibos',
    WARRANTY = 'Garantías',
    EXTERNAL_TEST = 'Pruebas Externas'
}

type FilterType = 'ALL' | DocCategory;

interface DocumentItem {
    id: string;
    name: string;
    category: DocCategory;
    date: string;
    size: string;
    controlId: string | null;
}

// --- MOCKS ---
const MOCK_DOCUMENTS: DocumentItem[] = [
    { id: '1', name: 'Factura_Phonak_Audeo.pdf', category: DocCategory.RECEIPT, date: '12 Feb 2026', size: '1.2 MB', controlId: 'CTR-992' },
    { id: '2', name: 'Garantia_Limitada_3Anos.png', category: DocCategory.WARRANTY, date: '01 Feb 2026', size: '2.4 MB', controlId: null },
    { id: '3', name: 'Audiometria_Clinica_Nacional.pdf', category: DocCategory.EXTERNAL_TEST, date: '15 Ene 2026', size: '0.8 MB', controlId: 'CTR-850' },
    { id: '4', name: 'Recibo_Mantenimiento.pdf', category: DocCategory.RECEIPT, date: '10 Ene 2026', size: '1.1 MB', controlId: null },
];

const Documents: React.FC = () => {
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [search, setSearch] = useState('');

    const filteredDocs = useMemo(() => {
        return MOCK_DOCUMENTS.filter(doc => {
            const matchesFilter = filter === 'ALL' || doc.category === filter;
            const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filter, search]);

    // Helpers Visuales dentro del componente para evitar errores de scope
    const getIcon = (category: DocCategory) => {
        switch (category) {
            case DocCategory.RECEIPT: return <Receipt size={22} />;
            case DocCategory.WARRANTY: return <ShieldCheck size={22} />;
            case DocCategory.EXTERNAL_TEST: return <FilePlus size={22} />;
        }
    };

    const getIconStyle = (category: DocCategory) => {
        switch (category) {
            case DocCategory.RECEIPT: return 'bg-emerald-50 text-emerald-600';
            case DocCategory.WARRANTY: return 'bg-amber-50 text-amber-600';
            case DocCategory.EXTERNAL_TEST: return 'bg-blue-50 text-blue-600';
        }
    };

    return (
        <>
            <Head><title>Expediente Digital | Documentos</title></Head>
            <DashboardLayout
                isMainPage
                contentStyle={BoxedLayoutStyle.FULL}
                title="Documentos y Garantías"
            >
                <div className="space-y-8 animate-in fade-in duration-500">

                    {/* HEADER DE ACCIONES */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8">
                        <div>
                            <Typography variant={TypographyVariant.HEADER} className="text-3xl font-black text-slate-900">
                                Archivos del Paciente
                            </Typography>
                            <p className="text-slate-400 font-medium">Mariana Sosa • ID: MS-9920</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre..."
                                    className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 transition-all w-64"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                                <Upload size={18} />
                                Subir
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* BARRA LATERAL (Categorías) */}
                        <div className="lg:col-span-3 space-y-6">
                            <nav className="flex flex-col gap-1">
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-slate-400 text-[10px] uppercase tracking-widest ml-4 mb-2">
                                    Categorías
                                </Typography>

                                {/* Botón "Todos" */}
                                <button
                                    onClick={() => setFilter('ALL')}
                                    className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${filter === 'ALL' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    Todos los archivos
                                </button>

                                {/* Mapeo de Enums (Aquí corregimos el error de Typescript) */}
                                {(Object.values(DocCategory) as DocCategory[]).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${filter === cat ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </nav>

                            <div className="p-6 bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-[2rem] text-center group hover:bg-blue-50 transition-all cursor-pointer">
                                <FilePlus className="mx-auto text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                                <p className="text-[11px] font-bold text-blue-700 uppercase tracking-tight">Carga Rápida</p>
                            </div>
                        </div>

                        {/* LISTADO DE DOCUMENTOS */}
                        <div className="lg:col-span-9">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {filteredDocs.map((doc) => (
                                    <div key={doc.id} className="bg-white border border-slate-100 p-5 rounded-[2rem] flex items-center justify-between hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${getIconStyle(doc.category)}`}>
                                                {getIcon(doc.category)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-tight">{doc.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{doc.date} • {doc.size}</span>
                                                    {doc.controlId && (
                                                        <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                                                            <LinkIcon size={10} /> {doc.controlId}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {filteredDocs.length === 0 && (
                                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                        <p className="text-slate-400 font-medium italic">No se encontraron documentos en esta categoría.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default Documents;