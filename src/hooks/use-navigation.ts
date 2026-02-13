// // src/hooks/useNavigation.ts

// import { useContext } from 'react';
// import { useRouter } from 'next/router';
// import { routesPrivate, routesPublic } from '@/shared/navigation/routes';

// type UseNavigationHook = {
//     navigateToHome: () => void;
//     navigateToAbout: () => void;
//     // Agrega más funciones de navegación según las rutas definidas
// };

// export const useNavigation = (): UseNavigationHook => {
//     const router = useRouter();

//     const navigateToHome = () => {
//         router.push(routesPublic.home);
//     };

//     const navigateToAbout = () => {
//         router.push(routesPrivate.about);
//     };

//     return {
//         navigateToHome,
//         navigateToAbout,
//         // Devuelve más funciones de navegación según las rutas definidas
//     };
// };
// src/hooks/useNavigation.ts

import { useRouter } from 'next/router';
import { routesPrivate, routesPublic } from '@/shared/navigation/routes';

type UseNavigationHook = {
  navigateToLogin: () => void;
  navigateToFiles: () => void;
  navigateToCreateFile: () => void;
  goBack: () => void;
};

export const useNavigation = (): UseNavigationHook => {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push(routesPublic.login);
  };

  const navigateToFiles = () => {
    router.push(routesPrivate.files.index);
  };

  const navigateToCreateFile = () => {
    router.push(routesPrivate.files.create);
  };

  const goBack = () => {
    router.back();
  };

  return {
    navigateToLogin,
    navigateToFiles,
    navigateToCreateFile,
    goBack,
  };
};
