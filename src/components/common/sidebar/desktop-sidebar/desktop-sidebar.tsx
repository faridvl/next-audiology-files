import React, { useState, useMemo } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from 'react-i18next';
import { TypographyVariant, Typography } from "../../typography/typography";
import { routesPrivate } from "@/shared/navigation/routes";
import { useSidebar } from './use-sidebar';

export default function DesktopSidebar() {
  const router = useRouter();
  const { t } = useTranslation();
  const { userRoleLabel, businessName, tenantLogoUrl, isLoading, filteredNavigation } = useSidebar();
  const [zynkaLogoError, setZynkaLogoError] = useState(false);

  const tenantInitials = useMemo(() => {
    if (!businessName || businessName === 'Zynka') return '??';
    const words = businessName.trim().split(/\s+/);
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return words[0].substring(0, 2).toUpperCase();
  }, [businessName]);

  return (
    <div className="flex h-full max-h-screen flex-col bg-white border-r border-neutral-100">

      {/* Logo Section */}
      <div className="flex h-[80px] items-center px-8 mb-2">
        <Link href={routesPrivate.dashboard} className="flex items-center gap-3 group">

          <div className="h-10 w-10 rounded-app-md flex items-center justify-center text-white font-extrabold text-sm tracking-tight transition-all duration-300 group-hover:scale-105 overflow-hidden">
            {!zynkaLogoError ? (
              <img src="/zynka-logo.png" alt="Zynka" className="h-full w-full object-contain" onError={() => setZynkaLogoError(true)} />
            ) : (
              <div className="h-full w-full bg-primary flex items-center justify-center">Z</div>
            )}
          </div>

          <div className="flex flex-col">
            <Typography
              variant={TypographyVariant.BODY_SEMIBOLD}
              className="text-neutral-900 text-[15px] tracking-tight leading-none"
            >
              Zynka
            </Typography>

            <Typography variant={TypographyVariant.OVERLINE} className="mt-0.5">
              Gestión para Clínicas
            </Typography>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto px-3">
        <nav className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive =
              router.pathname === item.route ||
              router.pathname.startsWith(item.route + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.menuKey}
                href={item.route}
                className={`
                  relative flex items-center gap-3 px-5 py-2.5 rounded-app-sm transition-all duration-200 group
                  ${isActive
                    ? "text-primary bg-primary/10"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 hover:translate-x-1"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
                )}

                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={
                    isActive
                      ? "text-primary"
                      : "text-neutral-400 group-hover:text-neutral-600"
                  }
                />

                <Typography
                  variant={isActive ? TypographyVariant.BODY_SEMIBOLD : TypographyVariant.BODY}
                  className={`text-[13.5px] ${isActive ? "text-primary" : ""}`}
                >
                  {t(item.labelKey)}
                </Typography>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section (Footer) */}
      <div className="px-3 py-6 mt-auto border-t border-neutral-100">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 bg-neutral-50 hover:bg-white rounded-app-md border border-neutral-100 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 group cursor-pointer"
        >
          <div className="h-9 w-9 rounded-app-sm bg-primary group-hover:bg-primary-dark flex items-center justify-center font-bold text-white text-[11px] flex-shrink-0 transition-colors shadow-sm overflow-hidden">
            {isLoading ? '?' : tenantLogoUrl ? (
              <img src={tenantLogoUrl} alt={businessName} className="h-full w-full object-cover" />
            ) : (
              tenantInitials
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <Typography variant={TypographyVariant.CAPTION} className="font-bold text-neutral-800 truncate group-hover:text-primary-dark transition-colors">
              {isLoading ? t('menu.sidebar.footer.loading') : businessName}
            </Typography>
            <Typography variant={TypographyVariant.HELPER} className="truncate text-neutral-400">
              {isLoading ? t('menu.sidebar.footer.loadingRole') : userRoleLabel}
            </Typography>
          </div>

          <div className="text-neutral-300 group-hover:text-primary-light transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
