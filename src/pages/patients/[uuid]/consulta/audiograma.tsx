import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { ConsultaAudiogramaContainer } from '@/components/containers/patients/consulta/consulta-audiograma-container';

const ConsultaAudiogramaPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return (
    <>
      <Head><title>Audiograma — Zynka</title></Head>
      <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title="Audiograma">
        <ConsultaAudiogramaContainer patientUuid={uuid as string} />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default ConsultaAudiogramaPage;
