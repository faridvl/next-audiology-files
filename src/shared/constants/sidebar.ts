import { INavigationPath } from '@/types/system/navigation-path';
import { routesPrivate } from '../navigation/routes';
import { UserRole } from '@/types/auth/auth';
import {
  CalendarDays,
  Users,
  Package,
  ShieldCheck,
  LayoutTemplate,
  ClipboardList,
  Stethoscope,
} from 'lucide-react';

// Recepcionista = STAFF: ve Inicio, Agenda, Inventario. Sin acceso al expediente clínico.
// Médico = DOCTOR: ve todo clínico. Sin Usuarios ni Reportes.
// Admin/Owner = OWNER | ADMIN: acceso completo.
const ADMIN_ROLES = [UserRole.OWNER, UserRole.ADMIN];
const CLINICAL_ROLES = [UserRole.OWNER, UserRole.ADMIN, UserRole.DOCTOR];

// Orden operativo: lo que el clínico necesita primero → al fondo la administración
export const NAVIGATION_PATHS: INavigationPath[] = [
  {
    menuKey: 'appointments',
    default: false,
    icon: CalendarDays,
    labelKey: 'Agenda',
    route: routesPrivate.appointments.index,
  },
  {
    menuKey: 'patients',
    default: true,
    icon: Users,
    labelKey: 'Pacientes',
    route: routesPrivate.patients.index,
    allowedRoles: CLINICAL_ROLES,
  },
  {
    menuKey: 'clinicalTemplates',
    default: false,
    icon: Stethoscope,
    labelKey: 'Plantillas',
    route: routesPrivate.clinicalTemplates.index,
    allowedRoles: CLINICAL_ROLES,
  },
  {
    menuKey: 'inventory',
    default: false,
    icon: Package,
    labelKey: 'Inventario',
    route: routesPrivate.inventory.index,
  },
  {
    menuKey: 'appointmentType',
    default: false,
    icon: ClipboardList,
    labelKey: 'Tipos de Cita',
    route: routesPrivate.appointmentType.index,
    allowedRoles: ADMIN_ROLES,
  },
  {
    menuKey: 'users',
    default: false,
    icon: ShieldCheck,
    labelKey: 'Usuarios',
    route: routesPrivate.users.index,
    allowedRoles: ADMIN_ROLES,
  },
  {
    menuKey: 'report-template',
    default: false,
    icon: LayoutTemplate,
    labelKey: 'Reportes',
    route: routesPrivate.reportTemplate.create,
    allowedRoles: ADMIN_ROLES,
  },
];
