import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { ConsultaResumenContainer } from '@/components/containers/patients/consulta/consulta-resumen-container';

const ConsultaResumenPage: React.FC = () => {
  const router = useRouter();
  const { uuid, encounterUuid } = router.query;
  return (
    <>
      <Head><title>Resumen de Consulta — Zynka</title></Head>
      <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title="Resumen">
        <ConsultaResumenContainer patientUuid={uuid as string} encounterUuid={encounterUuid as string} />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default ConsultaResumenPage;
