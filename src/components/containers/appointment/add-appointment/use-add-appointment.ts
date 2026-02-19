import { useState, useMemo, useEffect } from 'react';
import { useNavigation } from '@/hooks/use-navigation';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { toast } from 'sonner';
import { useCreateAppointmentMutation } from '@/shared/api/mutations/appointments/create-appointment-mutation';
import { AppointmentStatus } from '@/types/appointments/appointment';
import { usePatientsQuery } from '@/shared/api/querys/patients-query';

export const useCreateAppointment = () => {
  const navigation = useNavigation();
  const { executeCreateAppointment, isPending, isSuccess, error } = useCreateAppointmentMutation();

  // TODO(!): Implementar un buscador con debounce para filtrar esta lista
  const { data: patientsData, isLoading: isLoadingPatients } = usePatientsQuery(1, 100, '');

  const [formData, setFormData] = useState({
    patientUuid: '',
    speciality: MedicalSpeciality.GENERAL,
    typeId: '',
    date: '',
    startTime: '',
    notes: '',
  });

  // TODO(!): Estos servicios deberían venir de una base de datos (useAppointmentTypesQuery)
  const servicesCatalog = {
    [MedicalSpeciality.AUDIOLOGY]: [
      { id: '550e8400-e29b-41d4-a716-446655440000', label: 'Audiometría Tonal' },
    ],
    [MedicalSpeciality.DENTAL]: [
      { id: 'd-1', label: 'Limpieza / Profilaxis' },
      { id: 'd-2', label: 'Extracción' },
    ],
    [MedicalSpeciality.GENERAL]: [{ id: 'g-1', label: 'Consulta General' }],
  };

  const availableServices = useMemo(() => {
    return servicesCatalog[formData.speciality] || [];
  }, [formData.speciality]);

  // Manejo de redirección y alertas
  useEffect(() => {
    if (isSuccess) {
      toast.success('¡Cita agendada con éxito!');
      navigation.appointments.list();
    }
  }, [isSuccess, navigation]);

  useEffect(() => {
    if (error) {
      toast.error('Error al agendar: Verifica la disponibilidad del horario.');
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientUuid || !formData.typeId || !formData.date || !formData.startTime) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }

    // Construcción de fechas ISO para el backend
    // TODO(!): Ajustar lógica si el backend requiere el offset local del cliente
    const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // +30 min por defecto

    const payload = {
      patientUUID: formData.patientUuid,
      typeUUID: formData.typeId,
      speciality: formData.speciality,
      status: AppointmentStatus.PENDING,
      date: startDateTime.toISOString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      notes: formData.notes,
    };

    executeCreateAppointment(payload);
  };

  return {
    formData,
    setFormData,
    loading: isPending || isLoadingPatients,
    handleSubmit,
    navigation,
    patients: patientsData?.data || [],
    availableServices,
  };
};
