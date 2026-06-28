// TODO(!): P3-3 — Actualmente usa localStorage.
// Implementar GET /clinical-templates en API para persistencia real.

import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { ClinicalTemplatesListContainer } from '@/components/containers/clinical-templates/clinical-templates-list-container';

const ClinicalTemplatesPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Plantillas Clínicas</title>
      </Head>
      <DashboardLayout
        isMainPage={false}
        contentStyle={BoxedLayoutStyle.FULL}
        title="Plantillas de Historia Clínica"
      >
        <ClinicalTemplatesListContainer />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default ClinicalTemplatesPage;
