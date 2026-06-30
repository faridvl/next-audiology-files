import { useCreateUserMutation } from '@/shared/api/mutations/users/create-user-matation';
import { UserRole, UserSpecialty } from '@/types/auth/auth';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export type UserFormValues = {
  fullName: string;
  email: string;
  role: UserRole;
  specialty?: UserSpecialty | '';
  phoneNumber?: string;
  password?: string;
};

type useUserFormReturn = {
  form: UseFormReturn<UserFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

export function useUserForm(onSuccess?: () => void): useUserFormReturn {
  const { executeCreateUser, isPending } = useCreateUserMutation();

  const form = useForm<UserFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      role: UserRole.DOCTOR,
      specialty: '',
      phoneNumber: '',
      password: '',
    },
  });

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyPhoneMask(e.target.value);
    form.setValue('phoneNumber', masked, { shouldValidate: true });
  }

  async function handleSave(values: UserFormValues) {
    const payload = {
      ...values,
      specialty: values.specialty || undefined,
      phoneNumber: values.phoneNumber || undefined,
    };

    executeCreateUser(payload, {
      onSuccess: () => {
        toast.success('Usuario creado correctamente.');
        form.reset();
        if (onSuccess) onSuccess();
      },
      onError: () => {
        toast.error('No se pudo crear el usuario. Intente más tarde.');
      },
    });
  }

  return {
    form,
    onSubmit: form.handleSubmit(handleSave),
    isLoading: form.formState.isSubmitting || isPending,
    handlePhoneChange,
  };
}
