// src/components/containers/clinical-templates/use-clinical-template-form.ts
// TODO(!): P3-3 — Actualmente usa localStorage.
// Implementar POST/PATCH /clinical-templates en API para persistencia real.

import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/use-session';
import { useNavigation } from '@/hooks/use-navigation';
import {
  ClinicalTemplate,
  ClinicalFieldDefinition,
  ClinicalFieldType,
} from '@/types/clinical-template/clinical-template.types';
import { loadTemplates, saveTemplates } from '@/shared/utils/clinical-templates-storage';
import { toast } from 'sonner';

const FIELD_TYPES: { value: ClinicalFieldType; label: string }[] = [
  { value: 'text', label: 'Texto corto' },
  { value: 'textarea', label: 'Texto largo' },
  { value: 'number', label: 'Número' },
  { value: 'boolean', label: 'Sí / No' },
  { value: 'date', label: 'Fecha' },
  { value: 'select', label: 'Lista de opciones' },
];

const SPECIALITY_OPTIONS = [
  { value: 'AUDIOLOGY', label: 'Audiología' },
  { value: 'DENTAL', label: 'Odontología' },
  { value: 'GENERAL', label: 'Medicina General' },
];

interface NewFieldDraft {
  label: string;
  fieldType: ClinicalFieldType;
  required: boolean;
  selectOptions: string; // separadas por coma
}

const INITIAL_FIELD_DRAFT: NewFieldDraft = {
  label: '',
  fieldType: 'text',
  required: false,
  selectOptions: '',
};

export interface UseClinicalTemplateFormResult {
  // State
  templateName: string;
  templateSpeciality: string;
  fields: ClinicalFieldDefinition[];
  newFieldDraft: NewFieldDraft;
  isEditMode: boolean;
  isSaving: boolean;

  // Setters
  setTemplateName: (name: string) => void;
  setTemplateSpeciality: (speciality: string) => void;
  setNewFieldDraft: (draft: NewFieldDraft) => void;

  // Handlers
  handleAddField: () => void;
  handleRemoveField: (fieldId: string) => void;
  handleMoveFieldUp: (fieldId: string) => void;
  handleMoveFieldDown: (fieldId: string) => void;
  handleSave: () => void;
  handleCancel: () => void;

  // Constants
  fieldTypeOptions: typeof FIELD_TYPES;
  specialityOptions: typeof SPECIALITY_OPTIONS;
}

export function useClinicalTemplateForm(
  templateId: string | undefined,
): UseClinicalTemplateFormResult {
  const { tenant, isLoading: isLoadingSession } = useSession();
  const navigation = useNavigation();

  const isEditMode = !!templateId && templateId !== 'new';

  const [templateName, setTemplateName] = useState('');
  const [templateSpeciality, setTemplateSpeciality] = useState('AUDIOLOGY');
  const [fields, setFields] = useState<ClinicalFieldDefinition[]>([]);
  const [newFieldDraft, setNewFieldDraft] = useState<NewFieldDraft>(INITIAL_FIELD_DRAFT);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar plantilla existente si estamos en modo edición
  useEffect(() => {
    if (isLoadingSession || !tenant?.uuid || !isEditMode || !templateId) return;
    const allTemplates = loadTemplates(tenant.uuid);
    const existingTemplate = allTemplates.find((template) => template.id === templateId);
    if (existingTemplate) {
      setTemplateName(existingTemplate.name);
      setTemplateSpeciality(existingTemplate.speciality);
      setFields(existingTemplate.fields);
    }
  }, [isLoadingSession, tenant?.uuid, isEditMode, templateId]);

  const handleAddField = useCallback(() => {
    if (!newFieldDraft.label.trim()) {
      toast.error('El nombre del campo es obligatorio.');
      return;
    }

    const parsedOptions =
      newFieldDraft.fieldType === 'select'
        ? newFieldDraft.selectOptions
            .split(',')
            .map((option) => option.trim())
            .filter(Boolean)
        : undefined;

    const newField: ClinicalFieldDefinition = {
      id: `field_${Date.now()}`,
      label: newFieldDraft.label.trim(),
      fieldType: newFieldDraft.fieldType,
      required: newFieldDraft.required,
      options: parsedOptions,
      order: fields.length,
    };

    setFields((previousFields) => [...previousFields, newField]);
    setNewFieldDraft(INITIAL_FIELD_DRAFT);
  }, [newFieldDraft, fields.length]);

  const handleRemoveField = useCallback((fieldId: string) => {
    setFields((previousFields) =>
      previousFields
        .filter((field) => field.id !== fieldId)
        .map((field, index) => ({ ...field, order: index })),
    );
  }, []);

  const handleMoveFieldUp = useCallback((fieldId: string) => {
    setFields((previousFields) => {
      const index = previousFields.findIndex((field) => field.id === fieldId);
      if (index <= 0) return previousFields;
      const updated = [...previousFields];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return updated.map((field, i) => ({ ...field, order: i }));
    });
  }, []);

  const handleMoveFieldDown = useCallback((fieldId: string) => {
    setFields((previousFields) => {
      const index = previousFields.findIndex((field) => field.id === fieldId);
      if (index === -1 || index >= previousFields.length - 1) return previousFields;
      const updated = [...previousFields];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return updated.map((field, i) => ({ ...field, order: i }));
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!templateName.trim()) {
      toast.error('El nombre de la plantilla es obligatorio.');
      return;
    }
    if (!tenant?.uuid) return;

    setIsSaving(true);

    const allTemplates = loadTemplates(tenant.uuid);

    if (isEditMode && templateId) {
      const updatedTemplates = allTemplates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              name: templateName.trim(),
              speciality: templateSpeciality,
              fields,
            }
          : template,
      );
      saveTemplates(tenant.uuid, updatedTemplates);
      toast.success('Plantilla actualizada correctamente.');
    } else {
      const newTemplate: ClinicalTemplate = {
        id: `template_${Date.now()}`,
        name: templateName.trim(),
        speciality: templateSpeciality,
        fields,
        createdAt: new Date().toISOString(),
        tenantUuid: tenant.uuid,
      };
      saveTemplates(tenant.uuid, [...allTemplates, newTemplate]);
      toast.success('Plantilla creada correctamente.');
    }

    setIsSaving(false);
    navigation.clinicalTemplates.index();
  }, [templateName, templateSpeciality, fields, tenant?.uuid, isEditMode, templateId, navigation]);

  const handleCancel = useCallback(() => {
    navigation.clinicalTemplates.index();
  }, [navigation]);

  return {
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
    fieldTypeOptions: FIELD_TYPES,
    specialityOptions: SPECIALITY_OPTIONS,
  };
}
