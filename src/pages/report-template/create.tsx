import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { ReportTemplateCreateContainer } from '@/components/containers/report-template/form-report-template';

const CreateReportTemplatePage: React.FC = () => {
    return (
        <>
            <Head><title>Nueva Plantilla | Sistema Médico</title></Head>
            <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title="Crear Machote de Reporte">
                <ReportTemplateCreateContainer />
            </DashboardLayout>
        </>
    );
};

// export const getServerSideProps = authorizeServerSidePage();
export default CreateReportTemplatePage;