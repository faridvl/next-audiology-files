
import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';

const Home: React.FC = () => {
  // const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <DashboardLayout
        isMainPage
        contentStyle={BoxedLayoutStyle.FULL}
        title={"Titulo Home"}
      >
        <div className=''>
          <h1>Titulo de prueba Home</h1>
          <div>contenido de prueba Home</div>
        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();


export default Home;
