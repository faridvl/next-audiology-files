import { useMemo, useState, useEffect } from 'react';
import { useNavigation } from '@/hooks/use-navigation';
import { useSession } from '@/hooks/use-session';

export function useDashboard() {
  const nav = useNavigation();
  const { user, isLoading: sessionLoading } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayInfo = useMemo(() => {
    if (!isMounted) return { firstName: '', fullGreeting: '', roleName: '' };

    const firstName = user?.fullName?.split(' ')[0] || 'Usuario';
    const roleTitles: Record<string, string> = {
      DOCTOR: 'Dr.',
      AUDIOLOGIST: 'Lic.',
      ADMIN: 'Admin.',
      RECEPTIONIST: 'Asistente',
    };
    const title = roleTitles[user?.role || ''] || '';

    return {
      firstName,
      fullGreeting: title ? `${title} ${firstName}` : firstName,
      roleName: user?.role || 'Personal',
    };
  }, [user, isMounted]);

  const todayFormatted = useMemo(() => {
    if (!isMounted) return '';

    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date());
  }, [isMounted]);

  const appointments = [
    { time: '09:00', patient: 'Mariana Sosa', desc: 'Audiometría Tonal' },
    { time: '10:15', patient: 'Roberto Castro', desc: 'Control de Audífonos' },
    { time: '11:30', patient: 'Lucía Méndez', desc: 'Evaluación Inicial' },
  ];

  return {
    userName: displayInfo.fullGreeting,
    role: displayInfo.roleName,
    todayFormatted,
    appointments,
    isLoading: sessionLoading || !isMounted,
    actions: {
      viewAgenda: () => nav.appointments.list(),
      createPatient: () => nav.patients.create(),
      createAppointment: () => nav.appointments.create(),
      goTests: () => nav.tests(),
      goInventory: () => nav.inventory(),
    },
  };
}
