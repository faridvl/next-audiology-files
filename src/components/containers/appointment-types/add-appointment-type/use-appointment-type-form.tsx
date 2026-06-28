import * as Yup from 'yup';
import { useCreateAppointmentTypeMutation } from '@/shared/api/mutations/appointment-types/create-appointment-type-mutation';
import { useNavigation } from '@/hooks/use-navigation';

export type AppointmentTypeFormValues = {
  name: string;
  duration: number;
  color: string;
};

export function useAppointmentTypeForm() {
  const { executeCreate, isPending } = useCreateAppointmentTypeMutation();
  const navigation = useNavigation();

  const initialValues: AppointmentTypeFormValues = {
    name: '',
    duration: 30,
    color: 'blue',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre del servicio es requerido'),
    duration: Yup.number().min(5, 'Mínimo 5 min').required('Requerido'),
    color: Yup.string().required(),
  });

  const handleSubmit = (values: AppointmentTypeFormValues) => {
    executeCreate(
      { name: values.name, duration: values.duration, color: values.color },
      { onSuccess: () => navigation.appointmentType.list() },
    );
  };

  return { initialValues, validationSchema, handleSubmit, isLoading: isPending };
}
