import React from 'react';
import {
  Trash2, Link as LinkIcon, ShieldCheck,
  Receipt, FilePlus, Search, Upload, Eye, FileText, Loader2,
} from 'lucide-react';
import { useDocuments } from './use-documents';
import { DocumentCategory, DocumentCategoryApiValue } from '@/types/documents/document.types';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

interface DocumentsContainerProps {
  patientId: string;
}

export const DocumentsContainer: React.FC<DocumentsContainerProps> = ({ patientId }) => {
  const {
    filter,
    setFilter,
    setSearchTerm,
    filteredDocuments,
    handleUpload,
    handleDelete,
    isLoading,
    isUploading,
    pendingFile,
    handleFileSelected,
    fileInputRef,
    selectedCategory,
    handleCategoryChange,
    getCategoryDisplayOptions,
    openFilePicker,
  } = useDocuments(patientId);

  const getIcon = (category: DocumentCategory) => {
    switch (category) {
      case DocumentCategory.RECEIPT: return <Receipt size={16} />;
      case DocumentCategory.WARRANTY: return <ShieldCheck size={16} />;
      case DocumentCategory.EXTERNAL_TEST: return <FilePlus size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getIconStyle = (category: DocumentCategory) => {
    switch (category) {
      case DocumentCategory.RECEIPT: return 'bg-success/10 text-success';
      case DocumentCategory.WARRANTY: return 'bg-warning/10 text-warning';
      case DocumentCategory.EXTERNAL_TEST: return 'bg-primary-soft text-primary';
      default: return 'bg-neutral-50 text-neutral-600';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      {/* BARRA DE ACCIONES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50/50 p-4 rounded-app-md border border-neutral-100">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" size={14} />
          <input
            type="text"
            placeholder="Buscar en archivos..."
            className="pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-app-sm text-xs focus:ring-4 focus:ring-primary/5 transition-all w-full md:w-64 outline-none"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {/* UPLOAD PANEL */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Input file oculto */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFileSelected(file);
              event.target.value = '';
            }}
          />

          {pendingFile ? (
            <>
              {/* Nombre del archivo seleccionado */}
              <span
                className="text-[10px] font-bold text-neutral-600 truncate max-w-[160px] bg-white border border-neutral-200 px-3 py-2 rounded-app-sm cursor-pointer hover:border-primary/40 transition-all"
                title={pendingFile.name}
                onClick={openFilePicker}
              >
                {pendingFile.name}
              </span>

              {/* Selector de categoría */}
              <select
                value={selectedCategory}
                onChange={(event) => handleCategoryChange(event.target.value as DocumentCategoryApiValue)}
                className="text-[10px] font-bold text-neutral-700 bg-white border border-neutral-200 px-3 py-2 rounded-app-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all"
              >
                {getCategoryDisplayOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Botón confirmar upload */}
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center justify-center gap-1.5 bg-primary text-white px-5 py-2 rounded-app-sm font-black text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all shadow-md shadow-primary-soft disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {isUploading ? 'Subiendo...' : 'Confirmar'}
              </button>

              {/* Cancelar */}
              <button
                onClick={() => handleFileSelected(null as unknown as File)}
                className="text-[10px] font-bold text-neutral-400 hover:text-danger px-3 py-2 rounded-app-sm transition-all"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={openFilePicker}
              className="flex items-center justify-center gap-1.5 bg-neutral-900 text-white px-5 py-2 rounded-app-sm font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-md shadow-neutral-200"
            >
              <Upload size={14} /> Subir Archivo
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            <Typography variant={TypographyVariant.OVERLINE} className="hidden lg:block ml-3 mb-2">Filtros</Typography>
            <button
              onClick={() => setFilter('ALL')}
              className={`flex-none px-4 py-2 rounded-app-sm font-bold text-[11px] uppercase tracking-tight transition-all text-left ${filter === 'ALL' ? 'bg-primary-soft text-primary' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              Todos
            </button>
            {(Object.values(DocumentCategory) as DocumentCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`flex-none px-4 py-2 rounded-app-sm font-bold text-[11px] uppercase tracking-tight transition-all text-left ${filter === category ? 'bg-primary-soft text-primary' : 'text-neutral-500 hover:bg-neutral-50'}`}
              >
                {category}
              </button>
            ))}
          </nav>
        </aside>

        <main className="lg:col-span-9">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="mx-auto text-primary-light animate-spin mb-2" size={28} />
              <Typography variant={TypographyVariant.OVERLINE}>Cargando documentos...</Typography>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="bg-white border border-neutral-100 p-3.5 rounded-app-md flex items-center justify-between hover:border-primary/30 transition-all group shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-app-sm flex items-center justify-center shrink-0 ${getIconStyle(document.category)}`}>
                      {getIcon(document.category)}
                    </div>
                    <div className="min-w-0">
                      <Typography variant={TypographyVariant.CAPTION} className="font-black text-neutral-800 leading-tight group-hover:text-primary transition-colors truncate">
                        {document.name}
                      </Typography>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400 font-bold">
                          {document.date} • {document.size}
                        </Typography>
                        {document.controlId && (
                          <div className="flex items-center gap-1 bg-neutral-50 text-neutral-500 px-1.5 py-0.5 rounded text-[8px] font-black uppercase border border-neutral-100">
                            <LinkIcon size={8} /> Ref: {document.controlId}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-neutral-300 hover:text-primary hover:bg-primary-soft rounded-lg transition-all"
                      title="Ver documento"
                    >
                      <Eye size={16} />
                    </a>
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="p-2 text-neutral-300 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredDocuments.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-app-lg border border-dashed border-neutral-200">
                  <FileText className="mx-auto text-neutral-200 mb-2" size={32} />
                  <Typography variant={TypographyVariant.OVERLINE}>No se encontraron archivos</Typography>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
