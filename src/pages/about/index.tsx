
import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';

const About: React.FC = () => {
  // const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>About</title>
      </Head>

      <DashboardLayout
        isMainPage
        contentStyle={BoxedLayoutStyle.FULL}
        title={"Titulo Home"}
      >
        <>
          <h1>Titulo de prueba About</h1>
          <div>contenido de prueba About</div>
        </>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();


export default About;
