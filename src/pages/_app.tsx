import React, { useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '../styles/globals.scss';
import '@/shared/i18n/i18n';
import { DashboardContextProvider } from '@/layouts/dashboard/dashboard-context';
import { NavigationContextProvider } from '@/shared/context/navigation-context';
import { PageLoadingBar } from '@/components/common/page-loading-bar/page-loading-bar';
import { BannerContainer } from '@/components/common/banner-container/banner-container';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/zynka-logo.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, minimal-ui" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <NavigationContextProvider>
          <DashboardContextProvider>
            <PageLoadingBar />
            <BannerContainer />
            <Component {...pageProps} />
          </DashboardContextProvider>
        </NavigationContextProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default MyApp;