import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { ConsultaMantenimientoContainer } from '@/components/containers/patients/consulta/consulta-mantenimiento-container';

const ConsultaMantenimientoPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  return (
    <>
      <Head><title>Mantenimiento — Zynka</title></Head>
      <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title="Mantenimiento">
        <ConsultaMantenimientoContainer patientUuid={uuid as string} />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default ConsultaMantenimientoPage;
