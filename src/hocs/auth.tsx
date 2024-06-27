import { routesPublic } from "@/shared/navigation/routes";
import { NextPageContext } from "next";
import { useRouter } from 'next/router';

export async function redirect(context: NextPageContext, url: string) {
  const isServerSide = context.res && typeof window === 'undefined';

  if (isServerSide) {
    context.res?.writeHead(302, { Location: url });
    context.res?.end();
  } else {
    const router = useRouter();
    await router.push(url);
  }
}

async function checkUrlAndRedirectIfNeeded(context: NextPageContext) {
  // await redirect(context, routesPublic.home);
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