import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { authorizeServerSidePage } from '@/hocs/auth';
import { UsersContainer } from '@/components/containers/users/users-list/user-list-container';

const UsersPage = () => {
    return (
        <DashboardLayout contentStyle={BoxedLayoutStyle.FULL} title="Gestión de Personal">
            <UsersContainer />
        </DashboardLayout>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default UsersPage;