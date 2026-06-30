// src/components/containers/clinical-templates/clinical-template-form-container.tsx
// Form builder de plantilla clínica (P3-3)
// TODO(!): P3-3 — Actualmente usa localStorage.
// Implementar POST/PATCH /clinical-templates en API para persistencia real.

import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, Save, X } from 'lucide-react';
import { useClinicalTemplateForm } from './use-clinical-template-form';
import { ClinicalFieldDefinition } from '@/types/clinical-template/clinical-template.types';

interface Props {
  templateId?: string; // undefined o 'new' para crear, uuid para editar
}

const FIELD_TYPE_LABELS: Record<string, string> = {
  text: 'Texto corto',
  textarea: 'Texto largo',
  number: 'Número',
  boolean: 'Sí / No',
  date: 'Fecha',
  select: 'Lista',
};

export const ClinicalTemplateFormContainer: React.FC<Props> = ({ templateId }) => {
  const {
    templateName,
    templateSpeciality,
    fields,
    newFieldDraft,
    isEditMode,
    isSaving,
    setTemplateName,
    setTemplateSpeciality,
    setNewFieldDraft,
    handleAddField,
    handleRemoveField,
    handleMoveFieldUp,
    handleMoveFieldDown,
    handleSave,
    handleCancel,
    fieldTypeOptions,
    specialityOptions,
  } = useClinicalTemplateForm(templateId);

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-8">
      {/* ENCABEZADO */}
      <div>
        <h1 className="text-xl font-black text-neutral-900 tracking-tight">
          {isEditMode ? 'Editar plantilla' : 'Nueva plantilla clínica'}
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Define los campos personalizados que aparecerán en el formulario de control médico.
        </p>
      </div>

      {/* INFO BÁSICA */}
      <div className="bg-white border border-neutral-100 rounded-app-md p-6 space-y-4 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Nombre de la plantilla
          </label>
          <input
            type="text"
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            placeholder="Ej. Audiología General"
            className="w-full px-4 py-3 border border-neutral-200 rounded-app-sm text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Especialidad
          </label>
          <select
            value={templateSpeciality}
            onChange={(event) => setTemplateSpeciality(event.target.value)}
            className="w-full px-4 py-3 border border-neutral-200 rounded-app-sm text-sm outline-none focus:border-primary transition-colors bg-white"
          >
            {specialityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CAMPOS ACTUALES */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
          Campos de la plantilla ({fields.length})
        </h2>

        {fields.length === 0 && (
          <p className="text-sm text-neutral-300 italic py-4 text-center">
            No hay campos aún. Agrega el primero desde el panel inferior.
          </p>
        )}

        {fields.map((field: ClinicalFieldDefinition, index: number) => (
          <div
            key={field.id}
            className="flex items-center gap-3 p-4 bg-white border border-neutral-100 rounded-app-sm shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleMoveFieldUp(field.id)}
                disabled={index === 0}
                className="p-1 text-neutral-300 hover:text-neutral-600 disabled:opacity-30 transition-colors"
                title="Subir"
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={() => handleMoveFieldDown(field.id)}
                disabled={index === fields.length - 1}
                className="p-1 text-neutral-300 hover:text-neutral-600 disabled:opacity-30 transition-colors"
                title="Bajar"
              >
                <ArrowDown size={14} />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-neutral-900 truncate">{field.label}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wide">
                  {FIELD_TYPE_LABELS[field.fieldType] ?? field.fieldType}
                </span>
                {field.required && (
                  <span className="text-[10px] font-bold text-primary bg-primary-soft px-1.5 py-0.5 rounded">
                    Obligatorio
                  </span>
                )}
                {field.options && field.options.length > 0 && (
                  <span className="text-[10px] text-neutral-400">
                    Opciones: {field.options.join(', ')}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleRemoveField(field.id)}
              className="p-2 text-neutral-300 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
              title="Eliminar campo"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* AGREGAR CAMPO */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-app-md p-6 space-y-4">
        <h3 className="text-sm font-bold text-neutral-600 uppercase tracking-wider">
          Agregar campo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
              Nombre del campo
            </label>
            <input
              type="text"
              value={newFieldDraft.label}
              onChange={(event) =>
                setNewFieldDraft({ ...newFieldDraft, label: event.target.value })
              }
              placeholder="Ej. Otoscopia OD"
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-white outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
              Tipo de campo
            </label>
            <select
              value={newFieldDraft.fieldType}
              onChange={(event) =>
                setNewFieldDraft({
                  ...newFieldDraft,
                  fieldType: event.target.value as typeof newFieldDraft.fieldType,
                })
              }
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-white outline-none focus:border-primary transition-colors"
            >
              {fieldTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {newFieldDraft.fieldType === 'select' && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
              Opciones (separadas por coma)
            </label>
            <input
              type="text"
              value={newFieldDraft.selectOptions}
              onChange={(event) =>
                setNewFieldDraft({ ...newFieldDraft, selectOptions: event.target.value })
              }
              placeholder="Ej. Normal, Alterado, Pendiente"
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-white outline-none focus:border-primary transition-colors"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="field-required"
            checked={newFieldDraft.required}
            onChange={(event) =>
              setNewFieldDraft({ ...newFieldDraft, required: event.target.checked })
            }
            className="w-4 h-4 rounded border-neutral-300"
          />
          <label htmlFor="field-required" className="text-sm text-neutral-600">
            Campo obligatorio
          </label>
        </div>

        <button
          onClick={handleAddField}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-bold transition-colors"
        >
          <Plus size={14} />
          Agregar campo
        </button>
      </div>

      {/* ACCIONES */}
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-app-sm text-sm font-bold transition-colors"
        >
          <X size={14} />
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white rounded-app-sm text-sm font-bold transition-colors shadow-md shadow-primary-soft"
        >
          <Save size={14} />
          {isSaving ? 'Guardando...' : 'Guardar plantilla'}
        </button>
      </div>
    </div>
  );
};
