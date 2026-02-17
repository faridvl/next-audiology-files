import React from 'react';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { authorizeServerSidePage } from '@/hocs/auth';
import { NewControlContainer } from '@/components/containers/controls/new-control-v1/new-control';
import Head from 'next/head';

const NewControlPage = () => {
    const router = useRouter();
    const { id } = router.query;

    if (!id) {
        return (
            <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Cargando Expediente...">
                <div className="flex h-96 items-center justify-center">
                    <div className="animate-pulse text-slate-300 font-bold uppercase tracking-widest text-xs">
                        Preparando entorno clínico...
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <>
            <Head>
                <title>Control de Paciente </title>
            </Head>
            <DashboardLayout
                contentStyle={BoxedLayoutStyle.FULL}
                title="Nuevo Registro Clínico"
            >
                <NewControlContainer patientId={id as string} />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();

export default NewControlPage;