import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@/hooks/use-navigation';
import { ClinicalTemplate } from '@/types/clinical-template/clinical-template.types';
import {
  useClinicalTemplatesQuery,
  FETCH_CLINICAL_TEMPLATES_KEY,
} from '@/shared/api/querys/clinical-templates-query';
import { useDeleteClinicalTemplateMutation } from '@/shared/api/mutations/clinical-templates/delete-clinical-template-mutation';
import { toast } from 'sonner';

export interface UseClinicalTemplatesListResult {
  templates: ClinicalTemplate[];
  isLoading: boolean;
  handleCreate: () => void;
  handleEdit: (templateId: string) => void;
  handleDelete: (templateId: string) => void;
}

export function useClinicalTemplatesList(): UseClinicalTemplatesListResult {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data, isLoading } = useClinicalTemplatesQuery();
  const { executeDeleteClinicalTemplate } = useDeleteClinicalTemplateMutation();

  const templates = data ?? [];

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
      if (!window.confirm('¿Seguro que deseas eliminar esta plantilla?')) return;
      executeDeleteClinicalTemplate(templateId, {
        onSuccess: () => {
          toast.success('Plantilla eliminada correctamente.');
          queryClient.invalidateQueries({ queryKey: [FETCH_CLINICAL_TEMPLATES_KEY] });
        },
        onError: () => {
          toast.error('Error al eliminar la plantilla.');
        },
      });
    },
    [executeDeleteClinicalTemplate, queryClient],
  );

  return { templates, isLoading, handleCreate, handleEdit, handleDelete };
}
