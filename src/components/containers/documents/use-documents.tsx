// src/components/containers/documents/use-documents.ts
import { useState, useMemo, useEffect } from 'react';

export enum DocCategory {
    RECEIPT = 'Recibos',
    WARRANTY = 'Garantías',
    EXTERNAL_TEST = 'Pruebas Externas'
}

export type FilterType = 'ALL' | DocCategory;

export interface DocumentItem {
    id: string;
    patientId: string; // Añadido para vinculación real
    name: string;
    category: DocCategory;
    date: string;
    size: string;
    controlId: string | null;
}

// Mock extendido para simular datos de diferentes pacientes
const MOCK_DOCUMENTS: DocumentItem[] = [
    { id: '1', patientId: 'MS-9920', name: 'Factura_Phonak_Audeo.pdf', category: DocCategory.RECEIPT, date: '12 Feb 2026', size: '1.2 MB', controlId: 'CTR-992' },
    { id: '2', patientId: 'MS-9920', name: 'Garantia_Limitada_3Anos.png', category: DocCategory.WARRANTY, date: '01 Feb 2026', size: '2.4 MB', controlId: null },
    { id: '3', patientId: 'OTRO-ID', name: 'Examen_Otro_Paciente.pdf', category: DocCategory.EXTERNAL_TEST, date: '15 Ene 2026', size: '0.8 MB', controlId: 'CTR-850' },
    { id: '4', patientId: 'MS-9920', name: 'Audiometría_Clinica.pdf', category: DocCategory.EXTERNAL_TEST, date: '15 Ene 2026', size: '0.8 MB', controlId: 'CTR-850' },
];

export const useDocuments = (patientId: string) => {
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Simulamos una carga de datos cuando el patientId cambia
    useEffect(() => {
        if (patientId) {
            setIsLoading(true);
            // Aquí iría tu fetch(`/api/patients/${patientId}/documents`)
            const timer = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [patientId]);

    const filteredDocs = useMemo(() => {
        return MOCK_DOCUMENTS.filter(doc => {
            // Primero: Solo documentos de ESTE paciente
            const belongsToPatient = true //doc.patientId === patientId;
            // Segundo: Aplicar filtros de categoría
            const matchesFilter = filter === 'ALL' || doc.category === filter;
            // Tercero: Aplicar búsqueda por nombre
            const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());

            return belongsToPatient && matchesFilter && matchesSearch;
        });
    }, [patientId, filter, search]);

    const handleUpload = () => {
        // En un caso real, aquí podrías abrir un modal que ya sepa 
        // que el archivo nuevo pertenece a patientId
        console.log(`Subiendo archivo para el paciente: ${patientId}`);

        // Ejemplo de lógica:
        // const fileInput = document.createElement('input');
        // fileInput.type = 'file';
        // fileInput.onchange = (e) => { ... lógica de upload ... };
        // fileInput.click();
    };

    const handleDelete = (docId: string) => {
        console.log(`Eliminando documento ${docId} del paciente ${patientId}`);
        // Aquí iría la lógica de mutación
    };

    return {
        filter,
        setFilter,
        search,
        setSearch,
        filteredDocs,
        handleUpload,
        handleDelete,
        isLoading
    };
};