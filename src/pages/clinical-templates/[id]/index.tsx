// TODO(!): P3-3 — Actualmente usa localStorage.
// Implementar GET/POST/PATCH /clinical-templates en API para persistencia real.

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { ClinicalTemplateFormContainer } from '@/components/containers/clinical-templates/clinical-template-form-container';

const ClinicalTemplateDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const pageTitle = id === 'new' ? 'Nueva plantilla clínica' : 'Editar plantilla clínica';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <DashboardLayout
        isMainPage={false}
        contentStyle={BoxedLayoutStyle.FULL}
        title={pageTitle}
      >
        <ClinicalTemplateFormContainer templateId={id as string | undefined} />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default ClinicalTemplateDetailPage;
