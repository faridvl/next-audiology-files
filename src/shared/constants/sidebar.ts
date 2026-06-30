import { INavigationPath, NavigationMenuKey } from '@/types/system/navigation-path';
import { routesPrivate } from '../navigation/routes';
import { UserRole } from '@/types/auth/auth';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Package,
  ListChecks,
  UserCog,
  LayoutTemplate,
} from 'lucide-react';

const ADMIN_ROLES = [UserRole.OWNER, UserRole.ADMIN];
const CLINICAL_ROLES = [UserRole.OWNER, UserRole.ADMIN, UserRole.DOCTOR];

/**
 * Orden operativo: flujo diario del clínico primero, administración al fondo.
 * allowedRoles ausente = visible para todos los roles.
 */
export const NAVIGATION_PATHS: INavigationPath[] = [
  {
    menuKey: NavigationMenuKey.DASHBOARD,
    default: true,
    icon: LayoutDashboard,
    labelKey: 'menu.sidebar.nav.dashboard',
    route: routesPrivate.dashboard,
  },
  {
    menuKey: NavigationMenuKey.APPOINTMENTS,
    default: false,
    icon: CalendarDays,
    labelKey: 'menu.sidebar.nav.appointments',
    route: routesPrivate.appointments.index,
  },
  {
    menuKey: NavigationMenuKey.PATIENTS,
    default: false,
    icon: Users,
    labelKey: 'menu.sidebar.nav.patients',
    route: routesPrivate.patients.index,
    allowedRoles: CLINICAL_ROLES,
  },
  {
    menuKey: NavigationMenuKey.CLINICAL_TEMPLATES,
    default: false,
    icon: FileText,
    labelKey: 'menu.sidebar.nav.clinicalTemplates',
    route: routesPrivate.clinicalTemplates.index,
    allowedRoles: CLINICAL_ROLES,
  },
  {
    menuKey: NavigationMenuKey.INVENTORY,
    default: false,
    icon: Package,
    labelKey: 'menu.sidebar.nav.inventory',
    route: routesPrivate.inventory.index,
  },
  {
    menuKey: NavigationMenuKey.APPOINTMENT_TYPES,
    default: false,
    icon: ListChecks,
    labelKey: 'menu.sidebar.nav.appointmentTypes',
    route: routesPrivate.appointmentType.index,
    allowedRoles: ADMIN_ROLES,
  },
  {
    menuKey: NavigationMenuKey.USERS,
    default: false,
    icon: UserCog,
    labelKey: 'menu.sidebar.nav.users',
    route: routesPrivate.users.index,
    allowedRoles: ADMIN_ROLES,
  },
  {
    menuKey: NavigationMenuKey.REPORT_TEMPLATE,
    default: false,
    icon: LayoutTemplate,
    labelKey: 'menu.sidebar.nav.reportTemplate',
    route: routesPrivate.reportTemplate.create,
    allowedRoles: ADMIN_ROLES,
  },
];
