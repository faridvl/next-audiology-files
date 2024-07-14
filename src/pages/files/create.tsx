
import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { PatientForm } from '@/components/containers/add-patient/add-patient';

const AddPatient: React.FC = () => {
    // const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>Agregar Pacientes</title>
            </Head>

            <DashboardLayout
                isMainPage
                contentStyle={BoxedLayoutStyle.FULL}
                title={"Agregar Paciente"}
            >

                <PatientForm />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();


export default AddPatient;
