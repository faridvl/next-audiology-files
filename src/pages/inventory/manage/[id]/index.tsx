import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { InventoryManageContainer } from '@/components/containers/inventory/inventory-manage/inventory-manage';

const ProductManagePage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <Head><title>Gestionar Stock | Sistema Médico</title></Head>
            <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title="Gestión de Inventario">
                <InventoryManageContainer productId={id as string} />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default ProductManagePage;