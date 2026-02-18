import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { PatientListContainer } from '@/components/containers/patients/patients-list/patient-list-container';

const PatientsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Pacientes </title>
      </Head>

      <DashboardLayout
        isMainPage
        contentStyle={BoxedLayoutStyle.FULL}
        title="Gestión de Pacientes"
      >
        <PatientListContainer />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();

export default PatientsPage;