
import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { useRouter } from 'next/router';

const About: React.FC = () => {
  // const { t } = useTranslation();
  const router = useRouter()

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
          <button onClick={() => { router.push('/home') }} >hola</button>

          <h1>Titulo de prueba About</h1>
          <div>contenido de prueba About</div>
        </>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();


export default About;
