import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { authorizeServerSidePage } from '@/hocs/auth';
import { useNavigation } from '@/hooks/use-navigation';
import { UserFormContainer } from '@/components/containers/users-form/user-form';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/common/back-button/back-button';

const CreateUserPage = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <DashboardLayout
      contentStyle={BoxedLayoutStyle.FULL}
      title={t('pages.users.create.layoutTitle')}
    >
      <div className="max-w-3xl mx-auto px-6">
        <BackButton onClick={() => navigation.common.back()} />
        <UserFormContainer />
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default CreateUserPage;
