import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { AppointmentTypesContainer } from '@/components/containers/appointment-types/appointment-types-container';
import { AppointmentTypeForm } from '@/components/containers/appointment-types/add-appointment-type/appointment-type-form';

const AppointmentTypesCreatePage: React.FC = () => {
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
                <AppointmentTypeForm />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default AppointmentTypesCreatePage;