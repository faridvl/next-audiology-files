import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { PatientCreateContainer } from '@/components/containers/patients/patient-create/patient-create-container';
import { useNavigation } from '@/hooks/use-navigation';
import { TEXT } from '@/static/texts/i18n';
import { toast } from 'sonner';

const AddPatient: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const handleSuccess = () => {
        toast.success(t(TEXT.PATIENTS.CREATE.SUCCESS));
        navigation.patients.list();
    };

    return (
        <>
            <Head>
                <title>{t(TEXT.PATIENTS.CREATE.PAGE_TITLE)}</title>
            </Head>

            <DashboardLayout
                isMainPage
                contentStyle={BoxedLayoutStyle.FULL}
                title={t(TEXT.PATIENTS.CREATE.PAGE_TITLE)}
            >
                <PatientCreateContainer onShowSuccess={handleSuccess} />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();

export default AddPatient;
