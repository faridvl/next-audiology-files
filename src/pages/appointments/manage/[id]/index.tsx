import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { ManageAppointmentContainer } from '@/components/containers/appointment/manage-appointment/manage-appointment';
import { authorizeServerSidePage } from '@/hocs/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';

const ManageAppointmentPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <Head><title>Gestionar Cita | Sistema Médico</title></Head>
            <DashboardLayout title="Gestión de Cita y Seguimiento" contentStyle={BoxedLayoutStyle.FULL}>
                <ManageAppointmentContainer id={id as string} />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default ManageAppointmentPage;