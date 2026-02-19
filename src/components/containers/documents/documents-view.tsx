// src/components/containers/documents/documents-container.tsx
import React from 'react';
import {
    Trash2, Link as LinkIcon, ShieldCheck,
    Receipt, FilePlus, Search, Upload, Eye, FileText
} from 'lucide-react';
import { useDocuments, DocCategory } from './use-documents';

interface DocumentsContainerProps {
    patientId: string;
}

export const DocumentsContainer: React.FC<DocumentsContainerProps> = ({ patientId }) => {
    // El hook useDocuments ahora debería recibir el patientId para filtrar
    const { filter, setFilter, setSearch, filteredDocs, handleUpload } = useDocuments(patientId);

    const getIcon = (category: DocCategory) => {
        switch (category) {
            case DocCategory.RECEIPT: return <Receipt size={16} />;
            case DocCategory.WARRANTY: return <ShieldCheck size={16} />;
            case DocCategory.EXTERNAL_TEST: return <FilePlus size={16} />;
            default: return <FileText size={16} />;
        }
    };

    const getIconStyle = (category: DocCategory) => {
        switch (category) {
            case DocCategory.RECEIPT: return 'bg-emerald-50 text-emerald-600';
            case DocCategory.WARRANTY: return 'bg-amber-50 text-amber-600';
            case DocCategory.EXTERNAL_TEST: return 'bg-blue-50 text-blue-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">

            {/* Toolbar de Documentos: Más discreta */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Buscar en archivos..."
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-4 focus:ring-blue-500/5 transition-all w-full md:w-64 outline-none"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleUpload}
                    className="flex items-center justify-center gap-1.5 bg-slate-900 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md shadow-slate-200"
                >
                    <Upload size={14} /> Subir Archivo
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar de Categorías: Estilo minimalista */}
                <aside className="lg:col-span-3">
                    <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                        <span className="hidden lg:block text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] ml-3 mb-2">Filtros</span>

                        <button
                            onClick={() => setFilter('ALL')}
                            className={`flex-none px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-tight transition-all text-left ${filter === 'ALL' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            Todos
                        </button>

                        {(Object.values(DocCategory) as DocCategory[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`flex-none px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-tight transition-all text-left ${filter === cat ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Listado Principal */}
                <main className="lg:col-span-9">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                        {filteredDocs.map((doc) => (
                            <div key={doc.id} className="bg-white border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-all group shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${getIconStyle(doc.category)}`}>
                                        {getIcon(doc.category)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate">
                                            {doc.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                                {doc.date} • {doc.size}
                                            </span>
                                            {doc.controlId && (
                                                <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded text-[8px] font-black uppercase border border-slate-100">
                                                    <LinkIcon size={8} /> Ref: {doc.controlId}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 ml-4">
                                    <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver">
                                        <Eye size={16} />
                                    </button>
                                    <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredDocs.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                <FileText className="mx-auto text-slate-200 mb-2" size={32} />
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No se encontraron archivos</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};