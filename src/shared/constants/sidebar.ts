// src/shared/navigation/navigationPaths.ts
import { INavigationPath } from '@/types/system/navigation-path';
import { routesPrivate } from '../navigation/routes';
import { LayoutDashboard, Users, Calendar, Activity, Archive, Settings } from 'lucide-react';

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
    menuKey: 'tests',
    default: false,
    icon: Activity,
    labelKey: 'Pruebas',
    route: routesPrivate.tests,
  },
  {
    menuKey: 'inventory',
    default: false,
    icon: Archive,
    labelKey: 'Inventario',
    route: routesPrivate.inventory,
  },
  {
    menuKey: 'users',
    default: false,
    icon: Settings,
    labelKey: 'Usuarios',
    route: routesPrivate.users.index,
  },
];
