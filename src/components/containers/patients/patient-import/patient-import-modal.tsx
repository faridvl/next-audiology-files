import React, { useRef } from 'react';
import { X, Download, Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, RotateCcw, Loader2 } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { usePatientImport } from './use-patient-import';
import { PatientImportRowError } from '@/types/patients/patient-import.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FIELD_LABELS: Record<string, string> = {
  firstName: 'Nombre',
  lastName: 'Apellidos',
  documentId: 'Cédula',
  email: 'Correo',
  phone: 'Teléfono',
  birthDate: 'Fecha de nacimiento',
  address: 'Dirección',
  gender: 'Género',
};

function groupErrorsByRow(errors: PatientImportRowError[]): Map<number, PatientImportRowError[]> {
  const grouped = new Map<number, PatientImportRowError[]>();
  for (const error of errors) {
    const existing = grouped.get(error.row) ?? [];
    grouped.set(error.row, [...existing, error]);
  }
  return grouped;
}

export const PatientImportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    step,
    isDragging,
    fileName,
    validationErrors,
    apiResult,
    isPending,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    handleDownloadTemplate,
    handleReset,
  } = usePatientImport(onClose);

  if (!isOpen) return null;

  const groupedErrors = groupErrorsByRow(validationErrors);
  const errorRows = Array.from(groupedErrors.entries()).sort(([rowA], [rowB]) => rowA - rowB);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-app-md shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft rounded-lg">
              <FileSpreadsheet size={18} className="text-primary" />
            </div>
            <div>
              <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-900">
                Importar pacientes
              </Typography>
              <Typography variant={TypographyVariant.HELPER} className="text-neutral-400">
                Carga masiva desde Excel o CSV
              </Typography>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Descarga de plantilla — siempre visible */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-100 rounded-app-sm">
            <div>
              <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-800 text-sm">
                Plantilla oficial
              </Typography>
              <Typography variant={TypographyVariant.HELPER} className="text-neutral-400">
                Descarga, completa y sube el archivo
              </Typography>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 hover:border-primary/40 hover:text-primary rounded-lg text-xs font-bold transition-colors"
            >
              <Download size={14} />
              Descargar plantilla
            </button>
          </div>

          {/* ESTADO: idle — Drag & Drop */}
          {step === 'idle' && (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-app-md cursor-pointer transition-all select-none ${
                  isDragging
                    ? 'border-primary bg-primary-soft/60 scale-[1.01]'
                    : 'border-neutral-200 bg-neutral-50 hover:border-primary/40 hover:bg-primary-soft/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileInput}
                />
                {isPending ? (
                  <Loader2 size={32} className="text-primary animate-spin" />
                ) : (
                  <Upload size={32} className={isDragging ? 'text-primary' : 'text-neutral-300'} />
                )}
                <div className="text-center">
                  <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-600">
                    {isPending
                      ? 'Importando pacientes...'
                      : isDragging
                      ? 'Suelta el archivo aquí'
                      : 'Arrastra tu archivo aquí'}
                  </Typography>
                  {!isPending && (
                    <Typography variant={TypographyVariant.HELPER} className="text-neutral-400 mt-1">
                      o haz clic para seleccionar · .xlsx .xls .csv · máx. 500 filas
                    </Typography>
                  )}
                </div>
                {fileName && !isPending && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-100 rounded-md text-xs text-neutral-600 shadow-sm">
                    <FileSpreadsheet size={12} className="text-primary" />
                    {fileName}
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-app-sm px-4 py-3">
                <Typography variant={TypographyVariant.HELPER} className="text-amber-700">
                  <span className="font-bold">Columnas requeridas:</span> Nombre · Apellidos · Cedula · Correo · Telefono · FechaNacimiento · Direccion · Genero
                </Typography>
              </div>
            </>
          )}

          {/* ESTADO: errors — Reporte línea por línea */}
          {step === 'errors' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-danger/5 border border-danger/20 rounded-app-sm">
                <AlertTriangle size={18} className="text-danger shrink-0 mt-0.5" />
                <div>
                  <Typography variant={TypographyVariant.BODY_BOLD} className="text-danger">
                    Se encontraron {validationErrors.length} error{validationErrors.length !== 1 ? 'es' : ''} en {groupedErrors.size} fila{groupedErrors.size !== 1 ? 's' : ''}
                  </Typography>
                  <Typography variant={TypographyVariant.HELPER} className="text-neutral-500 mt-0.5">
                    No se importó ningún registro. Corrige el archivo y vuelve a subirlo.
                  </Typography>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {errorRows.map(([rowNumber, rowErrors]) => (
                  <div
                    key={rowNumber}
                    className="p-3 bg-white border border-neutral-100 rounded-lg"
                  >
                    <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-500 font-bold mb-1.5">
                      Fila {rowNumber}
                    </Typography>
                    <ul className="space-y-0.5">
                      {rowErrors.map((error, errorIndex) => (
                        <li key={errorIndex} className="flex items-start gap-2 text-xs text-neutral-700">
                          <span className="text-danger mt-0.5">•</span>
                          <span>
                            <span className="font-semibold">{FIELD_LABELS[error.field] ?? error.field}:</span>{' '}
                            {error.message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 w-full justify-center px-4 py-2.5 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-app-sm text-sm font-bold transition-colors"
              >
                <RotateCcw size={14} />
                Subir otro archivo
              </button>
            </div>
          )}

          {/* ESTADO: success */}
          {step === 'success' && apiResult && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="p-4 bg-success/10 rounded-full">
                  <CheckCircle2 size={32} className="text-success" />
                </div>
                <div>
                  <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-900 text-lg">
                    Importación completada
                  </Typography>
                  <Typography variant={TypographyVariant.HELPER} className="text-neutral-400 mt-1">
                    El listado de pacientes se ha actualizado
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-success/8 border border-success/20 rounded-app-sm text-center">
                  <Typography variant={TypographyVariant.SUBTITLE} className="text-success font-black text-2xl">
                    {apiResult.imported}
                  </Typography>
                  <Typography variant={TypographyVariant.HELPER} className="text-neutral-500">
                    Importados
                  </Typography>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-app-sm text-center">
                  <Typography variant={TypographyVariant.SUBTITLE} className="text-neutral-600 font-black text-2xl">
                    {apiResult.skipped}
                  </Typography>
                  <Typography variant={TypographyVariant.HELPER} className="text-neutral-500">
                    Omitidos
                  </Typography>
                </div>
              </div>

              {apiResult.errors.length > 0 && (
                <div className="space-y-1.5">
                  <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-500 font-bold">
                    Filas con error en servidor
                  </Typography>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {apiResult.errors.map((error, index) => (
                      <div key={index} className="flex gap-2 text-xs text-neutral-600 p-2 bg-neutral-50 rounded-md">
                        <span className="font-bold shrink-0">Fila {error.row}:</span>
                        <span>{error.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleReset}
                className="flex items-center gap-2 w-full justify-center px-4 py-2.5 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-app-sm text-sm font-bold transition-colors"
              >
                <RotateCcw size={14} />
                Importar otro archivo
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-app-sm transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
