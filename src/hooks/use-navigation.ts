import { useRouter } from 'next/router';
import { routesPrivate, routesPublic } from '@/shared/navigation/routes';

export const useNavigation = () => {
  const router = useRouter();

  return {
    // Autenticación y General
    auth: {
      login: () => router.push(routesPublic.login),
      register: () => router.push(routesPublic.register),
    },

    common: {
      dashboard: () => router.push(routesPrivate.dashboard),
      settings: () => router.push(routesPrivate.settings),
      back: () => router.back(),
    },

    // Módulo de Usuarios
    users: {
      list: () => router.push(routesPrivate.users.index),
      create: () => router.push(routesPrivate.users.create),
      detail: (id: string | number) => router.push(routesPrivate.users.detail(id)),
      edit: (id: string | number) => router.push(routesPrivate.users.edit(id)),
    },

    // Módulo de Pacientes y Controles
    patients: {
      list: () => router.push(routesPrivate.patients.index),
      create: () => router.push(routesPrivate.patients.create),
      detail: (id: string | number) => router.push(routesPrivate.patients.detail(id)),
      addControl: (id: string | number) => router.push(routesPrivate.controls.create(id)),
      viewControl: (patientUUID: string | number, controlUUID: string) =>
        router.push(routesPrivate.controls.detail(patientUUID, controlUUID)),
    },

    // Módulo de Citas
    appointments: {
      list: () => router.push(routesPrivate.appointments.index),
      create: () => router.push(routesPrivate.appointments.create),
    },

    // Otros
    inventory: () => router.push(routesPrivate.inventory),
    tests: () => router.push(routesPrivate.tests),
    documents: () => router.push(routesPrivate.documents),
  };
};
