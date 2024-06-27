
import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';

const Customers: React.FC = () => {
  // const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Customers</title>
      </Head>

      <DashboardLayout
        isMainPage
        contentStyle={BoxedLayoutStyle.FULL}
        title={"Titulo Customers"}
      >
        <div className=''>
          <h1>Titulo de prueba Customers</h1>
          <div>contenido de prueba Customers</div>
        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();


export default Customers;
