// navigationPaths.ts
import { INavigationPath } from '@/types/system/navigation-path';
import { routesPrivate } from './routes';

export enum ParentMenuKeys {
    CONFIGURATION = 'configuration',
    INVENTORY = 'inventory',
    TRANSACTIONS = 'transactions',
}

export const NAVIGATION_PATHS: INavigationPath[] = [
    {
        menuKey: ParentMenuKeys.INVENTORY,
        default: false,
        icon: undefined,
        labelKey: "Home",
        route: routesPrivate.home,
        // Ejemplo comentado para subrutas:
        // subRoutes: [
        //   {
        //     menuKey: 'inventory.products',
        //     parentMenuKey: ParentMenuKeys.INVENTORY,
        //     parentLabel: "Home",
        //     labelKey: "Products",
        //     route: routesPrivate.home,
        //   },
        // ],
    },
    {
        menuKey: ParentMenuKeys.TRANSACTIONS,
        default: false,
        icon: undefined,
        labelKey: "About",
        route: routesPrivate.about,
    },
];
