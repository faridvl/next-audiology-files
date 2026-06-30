import { useState, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useBulkImportPatientsMutation } from '@/shared/api/mutations/patients/bulk-import-patients-mutation';
import { FETCH_PATIENTS_KEY } from '@/shared/api/querys/patients-query';
import {
  PatientImportRowError,
  PatientImportValidationResult,
  BulkImportApiResult,
  IMPORT_COLUMN_MAP,
  ImportColumn,
} from '@/types/patients/patient-import.types';
import { CreatePatientPayload } from '@/types/patients/patient';

const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv'];
const ACCEPTED_MIME = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
];

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
const PHONE_REGEX = /^\d{4}-\d{4}$/;

const rowSchema = Yup.object({
  firstName: Yup.string()
    .matches(NAME_REGEX, 'Solo letras y espacios')
    .max(60, 'Máximo 60 caracteres')
    .required('Nombre requerido'),
  lastName: Yup.string()
    .matches(NAME_REGEX, 'Solo letras y espacios')
    .max(60, 'Máximo 60 caracteres')
    .required('Apellido requerido'),
  documentId: Yup.string()
    .max(20, 'Máximo 20 caracteres')
    .required('Cédula obligatoria'),
  email: Yup.string()
    .email('Correo inválido')
    .required('Correo requerido'),
  phone: Yup.string()
    .matches(PHONE_REGEX, 'Formato: XXXX-XXXX')
    .required('Teléfono requerido'),
  birthDate: Yup.string()
    .required('Fecha de nacimiento requerida')
    .test('is-date', 'Fecha inválida (use YYYY-MM-DD)', (value) => {
      if (!value) return false;
      const parsed = new Date(value);
      return !isNaN(parsed.getTime()) && parsed <= new Date();
    }),
  address: Yup.string()
    .max(240, 'Máximo 240 caracteres')
    .required('Dirección requerida'),
  gender: Yup.string()
    .oneOf(['male', 'female'], 'Género: "male" o "female"')
    .required('Género requerido'),
});

export type ImportStep = 'idle' | 'errors' | 'success';

export interface UsePatientImportResult {
  step: ImportStep;
  isDragging: boolean;
  fileName: string | null;
  validationErrors: PatientImportRowError[];
  apiResult: BulkImportApiResult | null;
  isPending: boolean;
  dropZoneRef: React.RefObject<HTMLDivElement>;
  handleDragOver: (event: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (event: React.DragEvent) => void;
  handleFileInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownloadTemplate: () => void;
  handleReset: () => void;
}

function isValidFileType(file: File): boolean {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  return ACCEPTED_EXTENSIONS.includes(extension) || ACCEPTED_MIME.includes(file.type);
}

function parseWorkbook(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
        resolve(rows as Record<string, string>[]);
      } catch {
        reject(new Error('No se pudo leer el archivo. Asegúrate de que sea un Excel o CSV válido.'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsBinaryString(file);
  });
}

async function validateRows(
  rawRows: Record<string, string>[],
): Promise<PatientImportValidationResult> {
  const valid: (CreatePatientPayload & { rowIndex: number })[] = [];
  const errors: PatientImportRowError[] = [];

  for (let index = 0; index < rawRows.length; index++) {
    const raw = rawRows[index];
    const rowNumber = index + 2; // +2: 1-based + header row

    const mapped: Record<string, string> = {};
    for (const [column, field] of Object.entries(IMPORT_COLUMN_MAP)) {
      const value = raw[column as ImportColumn];
      mapped[field] = typeof value === 'string' ? value.trim() : String(value ?? '').trim();
    }

    // Normalize phone: remove spaces/dashes and re-format as XXXX-XXXX
    if (mapped.phone) {
      const digits = mapped.phone.replace(/\D/g, '');
      if (digits.length === 8) {
        mapped.phone = `${digits.slice(0, 4)}-${digits.slice(4)}`;
      }
    }

    // Normalize gender to lowercase
    if (mapped.gender) {
      const genderLower = mapped.gender.toLowerCase();
      if (genderLower === 'masculino' || genderLower === 'm') mapped.gender = 'male';
      if (genderLower === 'femenino' || genderLower === 'f') mapped.gender = 'female';
    }

    try {
      const validated = await rowSchema.validate(mapped, { abortEarly: false });
      valid.push({
        rowIndex: rowNumber,
        firstName: validated.firstName,
        lastName: validated.lastName,
        documentId: validated.documentId,
        email: validated.email.toLowerCase(),
        phone: `+506 ${validated.phone}`,
        birthDate: validated.birthDate,
        address: validated.address,
        gender: validated.gender,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        for (const inner of error.inner) {
          errors.push({
            row: rowNumber,
            field: inner.path ?? 'desconocido',
            message: inner.message,
          });
        }
      }
    }
  }

  return { valid, errors };
}

export function usePatientImport(onClose: () => void): UsePatientImportResult {
  const queryClient = useQueryClient();
  const { executeBulkImport, isPending } = useBulkImportPatientsMutation();
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<ImportStep>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<PatientImportRowError[]>([]);
  const [apiResult, setApiResult] = useState<BulkImportApiResult | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (!isValidFileType(file)) {
      toast.error('Formato no permitido. Solo se aceptan archivos .xlsx, .xls o .csv');
      return;
    }
    setFileName(file.name);
    setStep('idle');
    setValidationErrors([]);
    setApiResult(null);

    let rawRows: Record<string, string>[];
    try {
      rawRows = await parseWorkbook(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al leer el archivo.');
      return;
    }

    if (rawRows.length === 0) {
      toast.error('El archivo está vacío o no contiene filas de datos.');
      return;
    }

    if (rawRows.length > 500) {
      toast.error('Máximo 500 pacientes por importación. Divide el archivo en partes.');
      return;
    }

    const { valid, errors } = await validateRows(rawRows);

    if (errors.length > 0) {
      setValidationErrors(errors);
      setStep('errors');
      return;
    }

    const patients = valid.map(({ rowIndex: _, ...rest }) => rest);

    executeBulkImport(
      { patients },
      {
        onSuccess: (result) => {
          const typedResult = result as BulkImportApiResult;
          setApiResult(typedResult);
          setStep('success');
          queryClient.invalidateQueries({ queryKey: [FETCH_PATIENTS_KEY] });
          toast.success(`${typedResult.imported} pacientes importados correctamente`);
        },
        onError: () => {
          toast.error('Error al importar. Revisa tu conexión e intenta nuevamente.');
        },
      },
    );
  }, [executeBulkImport, queryClient]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
    // Reset input so same file can be re-selected
    event.target.value = '';
  }, [processFile]);

  const handleDownloadTemplate = useCallback(() => {
    const headers: (keyof typeof IMPORT_COLUMN_MAP)[] = [
      'Nombre', 'Apellidos', 'Cedula', 'Correo', 'Telefono', 'FechaNacimiento', 'Direccion', 'Genero',
    ];
    const exampleRow = [
      'María', 'González López', '1-2345-6789', 'maria@correo.com',
      '8888-9999', '1990-05-20', 'San José, Costa Rica', 'female',
    ];
    const worksheet = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pacientes');
    XLSX.writeFile(workbook, 'plantilla-importacion-pacientes.xlsx');
  }, []);

  const handleReset = useCallback(() => {
    setStep('idle');
    setFileName(null);
    setValidationErrors([]);
    setApiResult(null);
  }, []);

  return {
    step,
    isDragging,
    fileName,
    validationErrors,
    apiResult,
    isPending,
    dropZoneRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    handleDownloadTemplate,
    handleReset,
  };
}
