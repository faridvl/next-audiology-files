import { useCreateUserMutation } from '@/shared/api/mutations/users/create-user-matation';
import { UserRole } from '@/types/auth/auth';
import { useForm, UseFormReturn } from 'react-hook-form';
//todo(!): cambiar alerta por showSucces
import { toast } from 'sonner';
export type UserFormValues = {
  fullName: string;
  email: string;
  role: UserRole;
  specialty: string;
  password?: string;
};

type useUserFormReturn = {
  form: UseFormReturn<UserFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
};

export function useUserForm(onSuccess?: () => void): useUserFormReturn {
  const { executeCreateUser, isPending } = useCreateUserMutation();

  const form = useForm<UserFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      role: UserRole.DOCTOR,
      specialty: '',
      password: '',
    },
  });

  async function handleSave(values: UserFormValues) {
    console.log(values);
    executeCreateUser(values, {
      onSuccess: () => {
        toast.success('Operación realizada con éxito');
        form.reset();
        if (onSuccess) onSuccess();
      },
      onError: () => {
        toast.error('No se pudo completar la solicitud. Intente más tarde.');
      },
    });
  }

  return {
    form,
    onSubmit: form.handleSubmit(handleSave),
    isLoading: form.formState.isSubmitting || isPending,
  };
}
