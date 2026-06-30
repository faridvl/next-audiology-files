import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/hooks/use-session';
import { UserRole } from '@/types/auth/auth';
import { NAVIGATION_PATHS } from '@/shared/constants/sidebar';

export function useSidebar() {
  const { user, tenant, isLoading: sessionLoading } = useSession();
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userName = useMemo(() => user?.fullName ?? t('menu.sidebar.footer.loading'), [user, t]);

  const userRoleLabel = useMemo(() => {
    if (!user?.role) return t('menu.sidebar.footer.loadingRole');
    return t(`users.create.roles.${user.role}`, { defaultValue: user.role });
  }, [user?.role, t]);

  const businessName = useMemo(() => tenant?.businessName ?? 'Zynka', [tenant]);

  const initials = useMemo(() => {
    if (!user?.fullName) return '??';
    const names = user.fullName.trim().split(/\s+/);
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return names[0][0]?.toUpperCase() ?? '?';
  }, [user?.fullName]);

  const filteredNavigation = useMemo(() => {
    if (!user?.role) return NAVIGATION_PATHS;
    return NAVIGATION_PATHS.filter((item) => {
      if (!item.allowedRoles) return true;
      return item.allowedRoles.includes(user.role as UserRole);
    });
  }, [user?.role]);

  return {
    userName,
    userRoleLabel,
    businessName,
    initials,
    avatarUrl: user?.avatarUrl ?? null,
    tenantLogoUrl: tenant?.logoUrl ?? null,
    filteredNavigation,
    isLoading: !isMounted || sessionLoading,
  };
}
