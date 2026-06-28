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
    ficha: (uuid: string | number) => `/patients/${uuid}/ficha`,
    edit: (uuid: string | number) => `/patients/${uuid}/edit`,
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
  inventory: {
    index: '/inventory',
    create: '/inventory/create',
    detail: (inventoryUUID: string | number) => `/inventory/${inventoryUUID}`,
    manage: (inventoryUUID: string | number) => `/inventory/manage/${inventoryUUID}`,
  },
  settings: '/settings',
  documents: '/documents',
  profile: '/profile',
  appointmentType: { index: '/appointment-type', create: '/appointment-type/create' },
  reportTemplate: { index: '/report-template', create: '/report-template/create' },
  clinicalTemplates: {
    index: '/clinical-templates',
    create: '/clinical-templates/new',
    detail: (id: string) => `/clinical-templates/${id}`,
  },
};

export const routesPublic = {
  login: '/login',
  register: '/register',
};
