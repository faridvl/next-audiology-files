
import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';

const Settings: React.FC = () => {
  // const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <DashboardLayout
        isMainPage
        contentStyle={BoxedLayoutStyle.FULL}
        title={"Titulo Settings"}
      >
        <div className=''>
          <h1>Titulo de prueba Settings</h1>
          <div>contenido de prueba Settings</div>
        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();


export default Settings;
