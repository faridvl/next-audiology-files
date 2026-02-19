import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { CreateAppointmentContainer } from '@/components/containers/appointment/add-appointment/add-appointment';

const CreateAppointmentPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Nueva Cita | Sistema Médico</title>
            </Head>
            <DashboardLayout
                title="Agendar Nueva Cita"
                contentStyle={BoxedLayoutStyle.FULL}
            >
                <CreateAppointmentContainer />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default CreateAppointmentPage;