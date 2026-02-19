import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { AppointmentTypesContainer } from '@/components/containers/appointment-types/appointment-types-container';

const AppointmentTypesPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Mantenimiento de Citas </title>
            </Head>
            <DashboardLayout
                isMainPage={false}
                contentStyle={BoxedLayoutStyle.FULL}
                title="Configuración de Servicios"
            >
                <AppointmentTypesContainer />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default AppointmentTypesPage;