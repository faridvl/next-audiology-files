import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@/hooks/use-navigation';
import { MedicalSpeciality } from '@/types/medical-controls/medical-control.types';
import { toast } from 'sonner';
import { useCreateAppointmentMutation } from '@/shared/api/mutations/appointments/create-appointment-mutation';
import { AppointmentStatus } from '@/types/appointments/appointment';
import { usePatientsQuery } from '@/shared/api/querys/patients-query';
import { useAppointmentTypesQuery, AppointmentType } from '@/shared/api/querys/appointment-types-query';
import { useSession } from '@/hooks/use-session';

export const useCreateAppointment = () => {
  const navigation = useNavigation();
  const { executeCreateAppointment, isPending, isSuccess, error } = useCreateAppointmentMutation();
  const { user } = useSession();

  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [debouncedPatientSearch, setDebouncedPatientSearch] = useState('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedPatientSearch(patientSearchTerm);
    }, 300);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [patientSearchTerm]);

  const { data: patientsData, isLoading: isLoadingPatients } = usePatientsQuery(1, 100, debouncedPatientSearch);
  const { data: appointmentTypes, isLoading: isLoadingTypes } = useAppointmentTypesQuery();

  const userSpeciality = (user?.specialty as MedicalSpeciality) ?? MedicalSpeciality.GENERAL;

  const [formData, setFormData] = useState({
    patientUuid: '',
    speciality: MedicalSpeciality.GENERAL,
    typeId: '',
    date: '',
    startTime: '',
    notes: '',
  });

  useEffect(() => {
    if (user?.specialty) {
      setFormData((prev) => ({ ...prev, speciality: user.specialty as MedicalSpeciality }));
    }
  }, [user?.specialty]);

  const availableServices = (appointmentTypes as AppointmentType[] ?? []).map((type: AppointmentType) => ({
    id: type.uuid,
    label: type.name,
  }));

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
      date: new Date(`${formData.date}T00:00:00.000Z`).toISOString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      notes: formData.notes,
    };

    executeCreateAppointment(payload);
  };

  return {
    formData,
    setFormData,
    isLoading: isPending || isLoadingPatients || isLoadingTypes,
    isLoadingTypes,
    hasNoTypes: !isLoadingTypes && (appointmentTypes as AppointmentType[] ?? []).length === 0,
    handleSubmit,
    navigation,
    patients: patientsData?.data || [],
    availableServices,
    patientSearchTerm,
    setPatientSearchTerm,
    userSpeciality,
  };
};
