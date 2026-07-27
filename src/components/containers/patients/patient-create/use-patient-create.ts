import { useCreatePatientMutation } from '@/shared/api/mutations/patients/create-patients-mutation';
import { CreatePatientPayload } from '@/types/patients/patient';
import { useNavigation } from '@/hooks/use-navigation';
import { toast } from 'sonner';
import {
  DocumentType,
  PatientGender,
  patientCreateValidationSchema,
} from '@/components/containers/patients/patient-validation';

export type PatientCreateFormValues = {
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentId: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  gender: PatientGender;
};

function resolveApiError(error: unknown): { field: 'documentId' | 'email' | null; message: string } {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  if (message.includes('document') || message.includes('cédula') || message.includes('cedula') || message.includes('already exists')) {
    if (message.includes('document') || message.includes('cedula')) {
      return { field: 'documentId', message: 'Esta cédula ya está registrada en el sistema.' };
    }
    if (message.includes('email') || message.includes('correo')) {
      return { field: 'email', message: 'Este correo ya está registrado en el sistema.' };
    }
    return { field: null, message: 'Un paciente con estos datos ya existe.' };
  }
  if (message.includes('email')) {
    return { field: 'email', message: 'Este correo ya está registrado en el sistema.' };
  }
  return { field: null, message: 'Error al registrar el paciente. Verifica los datos e intenta nuevamente.' };
}

export function usePatientCreate(onSuccess?: () => void) {
  const navigation = useNavigation();
  const { executeCreatePatient, isPending } = useCreatePatientMutation();

  const initialValues: PatientCreateFormValues = {
    firstName: '',
    lastName: '',
    documentType: DocumentType.NATIONAL,
    documentId: '',
    phone: '',
    email: '',
    birthDate: '',
    address: '',
    gender: PatientGender.MALE,
  };

  const handleSubmit = async (
    values: PatientCreateFormValues,
    { resetForm, setFieldError }: { resetForm: () => void; setFieldError: (field: string, message: string) => void },
  ) => {
    const payload: CreatePatientPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: `+506 ${values.phone}`,
      birthDate: values.birthDate,
      email: values.email.trim().toLowerCase(),
      documentId: values.documentId,
      gender: values.gender,
      address: values.address.trim(),
    };

    executeCreatePatient(payload, {
      onSuccess: () => {
        resetForm();
        if (onSuccess) {
          onSuccess();
        } else {
          toast.success('Paciente registrado correctamente.');
          navigation.patients.list();
        }
      },
      onError: (error) => {
        const { field, message } = resolveApiError(error);
        if (field) {
          setFieldError(field, message);
        } else {
          toast.error(message);
        }
      },
    });
  };

  return {
    initialValues,
    validationSchema: patientCreateValidationSchema,
    handleSubmit,
    isLoading: isPending,
  };
}
