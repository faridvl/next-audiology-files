import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { DashboardContainer } from '@/components/containers/dashboard/dashboard';

const DashboardPage: React.FC = () => {
  return (
    <>
      <Head><title>Panel de Control | Sistema Médico</title></Head>
      <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title="Inicio">
        <DashboardContainer />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default DashboardPage;