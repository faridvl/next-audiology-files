// types/system/navigation-path.ts
export interface INavigationPath {
    menuKey?: string;
    default: boolean;
    icon?: any;
    labelKey: string;
    route: string;
    subRoutes?: INavigationPath[];
}
