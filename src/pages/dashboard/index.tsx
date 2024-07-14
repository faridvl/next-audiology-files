
import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Table } from '@/components/common/table/table';

const Dashboard: React.FC = () => {
  // const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>hola</title>
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
        {/* <Table
          /> */}
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();


export default Dashboard;
