// types/system/navigation-path.ts
import { UserRole } from '@/types/auth/auth';

export interface INavigationPath {
    menuKey?: string;
    default: boolean;
    icon?: any;
    labelKey: string;
    route: string;
    /** Roles que pueden ver este ítem. Si no se define, todos los roles lo ven. */
    allowedRoles?: UserRole[];
    subRoutes?: INavigationPath[];
}
