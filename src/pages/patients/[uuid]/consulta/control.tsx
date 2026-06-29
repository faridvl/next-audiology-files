import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { ConsultaControlContainer } from '@/components/containers/patients/consulta/consulta-control-container';

const ConsultaControlPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return (
    <>
      <Head><title>Control Clínico — Zynka</title></Head>
      <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title="Control clínico">
        <ConsultaControlContainer patientUuid={uuid as string} />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default ConsultaControlPage;
