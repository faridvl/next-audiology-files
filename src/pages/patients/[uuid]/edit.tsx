import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { PatientEditContainer } from '@/components/containers/patients/patient-edit/patient-edit-container';

const PatientEditPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  return (
    <>
      <Head>
        <title>Editar Paciente</title>
      </Head>
      <DashboardLayout
        isMainPage={false}
        contentStyle={BoxedLayoutStyle.FULL}
        title="Editar Paciente"
      >
        <PatientEditContainer patientUuid={uuid as string} />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();

export default PatientEditPage;
