// pages/_app.tsx

import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.scss'; // Importa los estilos globales aquí
import '@/shared/i18n/i18n';
import { DashboardContextProvider } from '@/layouts/dashboard/dashboard-context'; 
import { NavigationContextProvider } from '@/shared/context/navigation-context'; 
import { PageLoadingBar } from '@/components/common/page-loading-bar/page-loading-bar'; 
import { BannerContainer } from '@/components/common/banner-container/banner-container'; 

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/next.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/next.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, minimal-ui" />
      </Head>

      <NavigationContextProvider>
        <DashboardContextProvider>
          <PageLoadingBar />
          <BannerContainer />
          <Component {...pageProps} />
        </DashboardContextProvider>
      </NavigationContextProvider>
    </>
  );
};

export default MyApp;
