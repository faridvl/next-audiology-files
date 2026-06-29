import { useState, useEffect, useMemo } from 'react';
import { useSession } from '@/hooks/use-session';
import { UserRole } from '@/types/auth/auth';
import { NAVIGATION_PATHS } from '@/shared/constants/sidebar';

export function useSidebar() {
  const { user, tenant, isLoading: sessionLoading } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userName = useMemo(() => user?.fullName || 'Usuario', [user]);
  const userRole = useMemo(() => user?.role || 'Personal', [user]);
  const businessName = useMemo(() => tenant?.businessName || 'Zynka', [tenant]);

  const initials = useMemo(() => {
    if (!user?.fullName) return '??';
    const names = user.fullName.trim().split(/\s+/);
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return names[0][0]?.toUpperCase() || '?';
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
    userRole,
    businessName,
    initials,
    filteredNavigation,
    isLoading: !isMounted || sessionLoading,
  };
}
