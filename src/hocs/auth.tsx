import { GetServerSidePropsContext, GetServerSideProps } from 'next';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { routesPublic, routesPrivate } from '@/shared/navigation/routes';

type SSRCallback = (context: GetServerSidePropsContext, token: string) => Promise<any>;

export function authorizeServerSidePage(callback?: SSRCallback): GetServerSideProps {
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

    const additionalProps = callback ? await callback(context, token) : { props: {} };

    return {
      ...additionalProps,
      props: {
        ...(additionalProps.props || {}),
        userName: CookiesManager.getUserName(context) || null,
      },
    };
  };
}

export function unauthorizeServerSidePage(): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    const token = CookiesManager.getAccessToken(context);

    if (token) {
      return {
        redirect: {
          destination: routesPrivate.dashboard,
          permanent: false,
        },
      };
    }

    return { props: {} };
  };
}