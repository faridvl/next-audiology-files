import { INavigationPath } from '@/types/system/navigation-path';
import { routesPrivate } from '../navigation/routes';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Package,
  ShieldCheck,
  LayoutTemplate,
  ClipboardList,
  Stethoscope,
} from 'lucide-react';

// Orden operativo: lo que el clínico necesita primero → al fondo la administración
export const NAVIGATION_PATHS: INavigationPath[] = [
  {
    menuKey: 'dashboard',
    default: false,
    icon: LayoutDashboard,
    labelKey: 'Inicio',
    route: routesPrivate.dashboard,
  },
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
  },
  {
    menuKey: 'clinicalTemplates',
    default: false,
    icon: Stethoscope,
    labelKey: 'Plantillas',
    route: routesPrivate.clinicalTemplates.index,
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
  },
  {
    menuKey: 'users',
    default: false,
    icon: ShieldCheck,
    labelKey: 'Usuarios',
    route: routesPrivate.users.index,
  },
  {
    menuKey: 'report-template',
    default: false,
    icon: LayoutTemplate,
    labelKey: 'Reportes',
    route: routesPrivate.reportTemplate.create,
  },
];
