export const routesPrivate = {
  dashboard: '/dashboard',
  users: {
    index: '/users',
    create: '/users/create',
    detail: (id: string | number) => `/users/${id}`,
    edit: (id: string | number) => `/users/edit/${id}`,
  },
  patients: {
    index: '/patients',
    create: '/patients/create',
    detail: (id: string | number) => `/patients/${id}`,
  },
  appointments: {
    index: '/appointments',
    create: '/appointments/create',
    manage: (id: string | number) => `/appointments/manage/${id}`,
  },
  controls: {
    detail: (patientUUID: string | number, controlUUID: string) =>
      `/controls/detail/${patientUUID}/${controlUUID}`,
    create: (id: string | number) => `/controls/${id}`,
  },
  tests: '/tests',
  inventory: '/inventory',
  settings: '/settings',
  documents: '/documents',
  profile: '/profile',
  appointmentType: { index: '/appointment-type', create: '/appointment-type/create' },
};

export const routesPublic = {
  login: '/login',
  register: '/register',
};
