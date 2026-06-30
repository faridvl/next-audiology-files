import { useRef, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  DocumentCategory,
  DocumentCategoryApiValue,
  DocumentFilterType,
  DocumentItem,
  DOCUMENT_CATEGORY_API_TO_DISPLAY,
  DOCUMENT_CATEGORY_DISPLAY_TO_API,
  PatientDocument,
} from '@/types/documents/document.types';
import { usePatientDocumentsQuery, FETCH_PATIENT_DOCUMENTS_KEY } from '@/shared/api/querys/patient-documents-query';
import { useUploadDocumentMutation } from '@/shared/api/mutations/documents/upload-document-mutation';
import { useDeleteDocumentMutation } from '@/shared/api/mutations/documents/delete-document-mutation';

export type { DocumentFilterType };
export { DocumentCategory, DocumentCategoryApiValue };

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function mapApiDocumentToItem(patientUuid: string, document: PatientDocument): DocumentItem {
  const displayCategory =
    DOCUMENT_CATEGORY_API_TO_DISPLAY[document.category] ?? DocumentCategory.OTHER;
  return {
    id: document.uuid,
    patientId: patientUuid,
    name: document.originalName,
    url: document.url,
    category: displayCategory,
    date: formatDate(document.uploadedAt),
    size: formatFileSize(document.size),
    controlId: null,
  };
}

export const useDocuments = (patientId: string) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<DocumentFilterType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategoryApiValue>(
    DocumentCategoryApiValue.OTHER,
  );
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: apiDocuments, isLoading } = usePatientDocumentsQuery(patientId);
  const { executeUploadDocument, isPending: isUploading } = useUploadDocumentMutation();
  const { executeDeleteDocument } = useDeleteDocumentMutation();

  const allDocuments: DocumentItem[] = useMemo(() => {
    if (!apiDocuments) return [];
    return apiDocuments.map((document) => mapApiDocumentToItem(patientId, document));
  }, [apiDocuments, patientId]);

  const filteredDocuments = useMemo(() => {
    return allDocuments.filter((document) => {
      const matchesFilter = filter === 'ALL' || document.category === filter;
      const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [allDocuments, filter, searchTerm]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (file: File) => {
    setPendingFile(file);
  };

  const handleUpload = () => {
    if (!pendingFile) {
      openFilePicker();
      return;
    }

    executeUploadDocument(
      {
        patientUuid: patientId,
        file: pendingFile,
        category: selectedCategory,
      },
      {
        onSuccess: () => {
          toast.success('Documento subido correctamente');
          setPendingFile(null);
          queryClient.invalidateQueries({ queryKey: [FETCH_PATIENT_DOCUMENTS_KEY, patientId] });
        },
        onError: () => {
          toast.error('Error al subir el documento');
        },
      },
    );
  };

  const handleDelete = (documentId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este documento?');
    if (!confirmed) return;

    executeDeleteDocument(
      { patientUuid: patientId, documentId },
      {
        onSuccess: () => {
          toast.success('Documento eliminado');
          queryClient.invalidateQueries({ queryKey: [FETCH_PATIENT_DOCUMENTS_KEY, patientId] });
        },
        onError: () => {
          toast.error('Error al eliminar el documento');
        },
      },
    );
  };

  const handleCategoryChange = (category: DocumentCategoryApiValue) => {
    setSelectedCategory(category);
  };

  const getCategoryDisplayOptions = () =>
    Object.entries(DOCUMENT_CATEGORY_DISPLAY_TO_API).map(([display, apiValue]) => ({
      label: display,
      value: apiValue as DocumentCategoryApiValue,
    }));

  return {
    filter,
    setFilter,
    searchTerm,
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
  };
};
