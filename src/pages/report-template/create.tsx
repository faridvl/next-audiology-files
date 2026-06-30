import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { ReportTemplateCreateContainer } from '@/components/containers/report-template/form-report-template';
import { TEXT } from '@/static/texts/i18n';

const CreateReportTemplatePage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <Head><title>{t(TEXT.REPORT_TEMPLATE.INFO_TITLE)} | Zynka</title></Head>
            <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title={t(TEXT.REPORT_TEMPLATE.BUTTONS.SAVE)}>
                <ReportTemplateCreateContainer />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default CreateReportTemplatePage;