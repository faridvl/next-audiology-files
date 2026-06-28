// src/components/containers/clinical-templates/use-clinical-templates-list.ts
// TODO(!): P3-3 — Actualmente usa localStorage.
// Implementar GET /clinical-templates en API para persistencia real.

import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/use-session';
import { useNavigation } from '@/hooks/use-navigation';
import { ClinicalTemplate } from '@/types/clinical-template/clinical-template.types';
import { loadTemplates, saveTemplates } from '@/shared/utils/clinical-templates-storage';

export interface UseClinicalTemplatesListResult {
  templates: ClinicalTemplate[];
  isLoading: boolean;
  handleCreate: () => void;
  handleEdit: (templateId: string) => void;
  handleDelete: (templateId: string) => void;
}

export function useClinicalTemplatesList(): UseClinicalTemplatesListResult {
  const { tenant, isLoading: isLoadingSession } = useSession();
  const navigation = useNavigation();
  const [templates, setTemplates] = useState<ClinicalTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoadingSession || !tenant?.uuid) return;
    setTemplates(loadTemplates(tenant.uuid));
    setIsLoading(false);
  }, [isLoadingSession, tenant?.uuid]);

  const handleCreate = useCallback(() => {
    navigation.clinicalTemplates.create();
  }, [navigation]);

  const handleEdit = useCallback(
    (templateId: string) => {
      navigation.clinicalTemplates.detail(templateId);
    },
    [navigation],
  );

  const handleDelete = useCallback(
    (templateId: string) => {
      if (!tenant?.uuid) return;
      const updated = templates.filter((template) => template.id !== templateId);
      saveTemplates(tenant.uuid, updated);
      setTemplates(updated);
    },
    [templates, tenant?.uuid],
  );

  return { templates, isLoading, handleCreate, handleEdit, handleDelete };
}
