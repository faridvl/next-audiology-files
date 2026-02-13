import { GetServerSidePropsContext } from 'next';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { routesPublic, routesPrivate } from '@/shared/navigation/routes';

export function authorizeServerSidePage() {
  return async (context: GetServerSidePropsContext) => {
    const token = CookiesManager.getAccessToken(context);

    if (!token) {
      return {
        redirect: {
          destination: routesPublic.login,
          permanent: false,
        },
      };
    }

    return { props: {} };
  };
}

export function unauthorizeServerSidePage() {
  return async (context: GetServerSidePropsContext) => {
    const token = CookiesManager.getAccessToken(context);

    if (token) {
      return {
        redirect: {
          destination: routesPrivate.home,
          permanent: false,
        },
      };
    }

    return { props: {} };
  };
}