import { LucideIcon } from 'lucide-react';
import { UserRole } from '@/types/auth/auth';

export enum NavigationMenuKey {
  DASHBOARD = 'dashboard',
  APPOINTMENTS = 'appointments',
  PATIENTS = 'patients',
  CLINICAL_TEMPLATES = 'clinicalTemplates',
  INVENTORY = 'inventory',
  APPOINTMENT_TYPES = 'appointmentTypes',
  USERS = 'users',
  REPORT_TEMPLATE = 'reportTemplate',
}

export interface INavigationPath {
  menuKey: NavigationMenuKey;
  default: boolean;
  icon: LucideIcon;
  /** Clave de i18n bajo menu.sidebar.nav.<menuKey> */
  labelKey: string;
  route: string;
  /** Si se omite, el ítem es visible para todos los roles. */
  allowedRoles?: UserRole[];
  /** Rutas hijas que también activan este ítem como activo. */
  activeOnRoutes?: string[];
}
