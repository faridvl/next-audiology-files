import { routesPrivate } from '@/shared/navigation/routes';
import { NextPageContext } from 'next';
import Router from 'next/router';

async function redirect(context: NextPageContext, url: string) {
  if (context.res) {
    context.res.writeHead(302, { Location: url });
    context.res.end();
  } else {
    await Router.push(url);
  }
}

async function checkUrlAndRedirectIfNeeded(context: NextPageContext) {
  const { req } = context;

  if (req && req.url === '/') {
    await redirect(context, routesPrivate.files.index);
  }
}

export function authorizeServerSidePage(
  serverSidePropsHandler?: (context: NextPageContext) => any,
) {
  return async (context: NextPageContext) => {
    if (!serverSidePropsHandler) {
      await checkUrlAndRedirectIfNeeded(context);
      return {
        props: {},
      };
    }

    return serverSidePropsHandler(context);
  };
}
