import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { PatientForm } from '@/components/containers/add-patient/add-patient';
import { toast } from 'sonner';

const AddPatient: React.FC = () => {
    const router = useRouter();

    const handleSuccess = () => {
        toast.success('Paciente registrado correctamente.');
        router.push('/patients');
    };

    return (
        <>
            <Head>
                <title>Nuevo Paciente</title>
            </Head>

            <DashboardLayout
                isMainPage
                contentStyle={BoxedLayoutStyle.FULL}
                title="Nuevo Paciente"
            >
                <PatientForm onShowSuccess={handleSuccess} />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();

export default AddPatient;