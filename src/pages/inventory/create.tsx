import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { InventoryCreateContainer } from '@/components/containers/inventory/inventory-form/inventory-form';

const CreateProductPage: React.FC = () => {
    return (
        <>
            <Head><title>Nuevo Artículo </title></Head>
            <DashboardLayout isMainPage={false} contentStyle={BoxedLayoutStyle.FULL} title="Agregar al Inventario">
                <InventoryCreateContainer />
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default CreateProductPage;