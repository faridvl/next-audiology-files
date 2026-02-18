import React from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { ControlDetailContainer } from '@/components/containers/control-detail/control-detail-v1';
import Head from 'next/head';

const ControlDetailPage = () => {
    const router = useRouter();

    const { patientUUID, controlUUID } = router.query;

    if (!patientUUID || !controlUUID) {
        return <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Cargando...">
            <div className="flex justify-center items-center h-64">Cargando datos del control...</div>
        </DashboardLayout>;
    }

    return (
        <>
            <Head>
                <title>Control de Paciente </title>
            </Head>

            <DashboardLayout
                contentStyle={BoxedLayoutStyle.FULL}
                title={`Control Médico - ${controlUUID}`}
            >
                <ControlDetailContainer
                    patientId={patientUUID as string}
                    controlId={controlUUID as string}
                />
            </DashboardLayout>
        </>

    );
};

export default ControlDetailPage;