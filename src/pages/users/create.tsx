import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { authorizeServerSidePage } from '@/hocs/auth';
import { useNavigation } from '@/hooks/use-navigation';
import { UserFormContainer } from '@/components/containers/users-form/user-form';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/common/back-button/back-button';
import { useSession } from '@/hooks/use-session';
import { UserRole } from '@/types/auth/auth';

const ALLOWED_ROLES: UserRole[] = [UserRole.OWNER, UserRole.ADMIN];

const CreateUserPage = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user, isLoading: sessionLoading } = useSession();

  useEffect(() => {
    if (!sessionLoading && user && !ALLOWED_ROLES.includes(user.role)) {
      navigation.users.list();
    }
  }, [user, sessionLoading, navigation]);

  if (sessionLoading || !user || !ALLOWED_ROLES.includes(user.role)) {
    return null;
  }

  return (
    <DashboardLayout
      contentStyle={BoxedLayoutStyle.FULL}
      title={t('users.create.layoutTitle')}
    >
      <div className="px-6 py-8 max-w-5xl">
        <BackButton onClick={() => navigation.common.back()} />
        <div className="mt-6">
          <UserFormContainer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default CreateUserPage;
