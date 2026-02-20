import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { InventoryDetailContainer } from '@/components/containers/inventory/inventory-deail/inventory-detail-container';

const ProductDetailPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <Head><title>Detalle de Producto | Sistema Médico</title></Head>
            <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title="Detalle de Artículo">
                <InventoryDetailContainer productId={id as string} />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default ProductDetailPage;