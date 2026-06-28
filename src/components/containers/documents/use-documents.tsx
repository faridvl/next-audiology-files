import { useState, useMemo, useEffect } from 'react';
import { DocumentCategory, DocumentFilterType, DocumentItem } from '@/types/documents/document.types';

export type { DocumentFilterType };
export { DocumentCategory };

const MOCK_DOCUMENTS: DocumentItem[] = [
  { id: '1', patientId: 'MS-9920', name: 'Factura_Phonak_Audeo.pdf', category: DocumentCategory.RECEIPT, date: '12 Feb 2026', size: '1.2 MB', controlId: 'CTR-992' },
  { id: '2', patientId: 'MS-9920', name: 'Garantia_Limitada_3Anos.png', category: DocumentCategory.WARRANTY, date: '01 Feb 2026', size: '2.4 MB', controlId: null },
  { id: '3', patientId: 'OTRO-ID', name: 'Examen_Otro_Paciente.pdf', category: DocumentCategory.EXTERNAL_TEST, date: '15 Ene 2026', size: '0.8 MB', controlId: 'CTR-850' },
  { id: '4', patientId: 'MS-9920', name: 'Audiometría_Clinica.pdf', category: DocumentCategory.EXTERNAL_TEST, date: '15 Ene 2026', size: '0.8 MB', controlId: 'CTR-850' },
];

export const useDocuments = (patientId: string) => {
  const [filter, setFilter] = useState<DocumentFilterType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patientId) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [patientId]);

  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS.filter((document) => {
      const belongsToPatient = document.patientId === patientId;
      const matchesFilter = filter === 'ALL' || document.category === filter;
      const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase());
      return belongsToPatient && matchesFilter && matchesSearch;
    });
  }, [patientId, filter, searchTerm]);

  const handleUpload = () => {
    // TODO(!): Conectar al endpoint POST /patients/:uuid/documents cuando esté disponible (P2-1)
  };

  const handleDelete = (_documentId: string) => {
    // TODO(!): Conectar al endpoint DELETE /patients/:uuid/documents/:docId cuando esté disponible (P2-1)
  };

  return {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    filteredDocuments,
    handleUpload,
    handleDelete,
    isLoading,
  };
};
