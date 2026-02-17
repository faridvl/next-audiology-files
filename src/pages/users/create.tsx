import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { ChevronLeft } from 'lucide-react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { useNavigation } from '@/hooks/use-navigation';
import { UserFormContainer } from '@/components/containers/users-form/user-form';
import { useTranslation } from 'react-i18next';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

//todo(!): agregar a un componente separado 
interface BackButtonProps {
    onClick: () => void;
    label?: string;
}

export const BackButton = ({ onClick, label }: BackButtonProps) => {
    const { t } = useTranslation();

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6 group"
        >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-[13px]">
                {label || t('common.navigation.backToList')}
            </Typography>
        </button>
    );
};

const CreateUserPage = () => {
    const { t } = useTranslation();
    const nav = useNavigation();

    return (
        <DashboardLayout
            contentStyle={BoxedLayoutStyle.FULL}
            title={t('pages.users.create.layoutTitle')}
        >
            <div className="max-w-3xl mx-auto px-6">
                <BackButton onClick={() => nav.common.back()} />
                <UserFormContainer />
            </div>
        </DashboardLayout>
    );
};

export const getServerSideProps = authorizeServerSidePage();

export default CreateUserPage;