
import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';

const Dashboard: React.FC = () => {
  // const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <DashboardLayout
        isMainPage
        contentStyle={BoxedLayoutStyle.FULL}
        title={"Titulo Dashboard"}
      >
        <div className=''>
          <h1>Titulo de prueba Dashboard</h1>
          <div>contenido de prueba Dashboard</div>
        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();


export default Dashboard;
