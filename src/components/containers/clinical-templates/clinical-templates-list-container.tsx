import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { useClinicalTemplatesList } from './use-clinical-templates-list';
import { ClinicalTemplate } from '@/types/clinical-template/clinical-template.types';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

const SPECIALITY_LABELS: Record<string, string> = {
  AUDIOLOGY: 'Audiología',
  DENTAL: 'Odontología',
  GENERAL: 'Medicina General',
};

export const ClinicalTemplatesListContainer: React.FC = () => {
  const { templates, isLoading, handleCreate, handleEdit, handleDelete } =
    useClinicalTemplatesList();

  if (isLoading) {
    return (
      <div className="py-12 px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-neutral-100 rounded w-1/3" />
          <div className="h-24 bg-neutral-100 rounded-app-md" />
          <div className="h-24 bg-neutral-100 rounded-app-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-6 space-y-8">
      {/* ENCABEZADO */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant={TypographyVariant.HEADER} className="text-xl font-black text-neutral-900 tracking-tight">
            Plantillas de Historia Clínica
          </Typography>
          <Typography variant={TypographyVariant.HELPER} className="mt-1">
            Define campos personalizados para cada especialidad del tenant.
          </Typography>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-app-sm text-sm font-bold transition-colors shadow-md shadow-primary-soft"
        >
          <Plus size={16} />
          Nueva plantilla
        </button>
      </div>

      {/* LISTA */}
      {templates.length === 0 ? (
        <div className="text-center py-20 text-neutral-300">
          <FileText size={48} className="mx-auto mb-4 opacity-40" />
          <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-400">No hay plantillas creadas aún.</Typography>
          <Typography variant={TypographyVariant.HELPER} className="mt-1">
            Crea una plantilla para personalizar los campos del control médico.
          </Typography>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Encabezado columnas */}
          <div className="grid grid-cols-3 gap-4 px-6 pb-1">
            <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-300 uppercase tracking-widest text-xs">Nombre</Typography>
            <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-300 uppercase tracking-widest text-xs text-center">Campos</Typography>
            <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-300 uppercase tracking-widest text-xs text-right">Creado</Typography>
          </div>
          {templates.map((template: ClinicalTemplate) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-6 bg-white border border-neutral-100 rounded-app-md shadow-sm hover:border-primary/30 transition-all"
            >
              <div className="flex-1 grid grid-cols-3 gap-4 items-center min-w-0">
                <div className="space-y-1">
                  <Typography variant={TypographyVariant.BODY_BOLD} className="text-neutral-900">{template.name}</Typography>
                  <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400">
                    {SPECIALITY_LABELS[template.speciality] ?? template.speciality}
                  </Typography>
                </div>
                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400 text-center">
                  {template.fields.length} {template.fields.length === 1 ? 'campo' : 'campos'}
                </Typography>
                <Typography variant={TypographyVariant.OVERLINE} className="text-neutral-400 text-right">
                  {template.createdAt
                    ? format(new Date(template.createdAt), "dd MMM yyyy", { locale: es })
                    : '—'}
                </Typography>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(template.id ?? '')}
                  className="p-2 text-neutral-400 hover:text-primary hover:bg-primary-soft rounded-lg transition-colors"
                  title="Editar plantilla"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(template.id ?? '')}
                  className="p-2 text-neutral-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  title="Eliminar plantilla"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
