import { INavigationPath } from '@/types/system/navigation-path';
import { routesPrivate } from '../navigation/routes';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  Archive,
  ShieldCheck,
  FileText,
  ClipboardList,
} from 'lucide-react';

export const NAVIGATION_PATHS: INavigationPath[] = [
  {
    menuKey: 'dashboard',
    default: false,
    icon: LayoutDashboard,
    labelKey: 'Dashboard',
    route: routesPrivate.dashboard,
  },
  {
    menuKey: 'patients',
    default: true,
    icon: Users,
    labelKey: 'Pacientes',
    route: routesPrivate.patients.index,
  },
  {
    menuKey: 'appointments',
    default: false,
    icon: Calendar,
    labelKey: 'Agenda',
    route: routesPrivate.appointments.index,
  },
  {
    menuKey: 'inventory',
    default: false,
    icon: Archive,
    labelKey: 'Inventario',
    route: routesPrivate.inventory.index,
  },
  {
    menuKey: 'users',
    default: false,
    icon: ShieldCheck,
    labelKey: 'Usuarios',
    route: routesPrivate.users.index,
  },
  {
    menuKey: 'appointmentType',
    default: false,
    icon: ClipboardList,
    labelKey: 'Tipos de Citas',
    route: routesPrivate.appointmentType.index,
  },
];
