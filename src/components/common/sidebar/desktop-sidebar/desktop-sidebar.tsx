import React from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import { TypographyVariant, Typography } from "../../typography/typography";
import { routesPrivate } from "@/shared/navigation/routes";
import { NAVIGATION_PATHS } from '@/shared/constants/sidebar';
import { useSidebar } from './use-sidebar';

export default function DesktopSidebar() {
  const router = useRouter();
  const { userName, userRole, businessName, initials, isLoading } = useSidebar();

  return (
    <div className="flex h-full max-h-screen flex-col bg-white border-r border-slate-100">

      {/* Logo Section */}
      <div className="flex h-[80px] items-center px-8 mb-2">
        <Link href={routesPrivate.dashboard} className="flex items-center gap-3 group">

          {/* Logo Box */}
          <div className="h-10 w-10 bg-[#1E3A8A] rounded-2xl flex items-center justify-center text-white font-extrabold text-sm tracking-tight transition-all duration-300 group-hover:scale-105">
            Z
          </div>

          <div className="flex flex-col">
            <Typography
              variant={TypographyVariant.BODY_SEMIBOLD}
              className="text-slate-900 text-[15px] tracking-tight leading-none"
            >
              Zynka
            </Typography>

            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.18em] mt-0.5">
              Gestión para Clínicas
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto px-3">
        <nav className="space-y-1">
          {NAVIGATION_PATHS.map((item) => {
            const isActive = router.pathname.startsWith(item.route);
            const Icon = item.icon;

            return (
              <Link
                key={item.menuKey}
                href={item.route}
                className={`
                  relative flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? "text-[#1E3A8A] bg-[#1E3A8A]/10"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:translate-x-1"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-[#1E3A8A] rounded-r-full" />
                )}

                {Icon && (
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={
                      isActive
                        ? "text-[#1E3A8A]"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  />
                )}

                <Typography
                  variant={isActive ? TypographyVariant.BODY_SEMIBOLD : TypographyVariant.BODY}
                  className={`text-[13.5px] ${isActive ? "text-[#1E3A8A]" : ""}`}
                >
                  {item.labelKey}
                </Typography>
              </Link>
            );
          })}
        </nav>
      </div>


      {/* User Section (Footer) */}
      <div className="px-3 py-6 mt-auto border-t border-slate-100">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 group cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-[#1E3A8A] group-hover:bg-blue-600 flex items-center justify-center font-bold text-white text-[11px] flex-shrink-0 transition-colors shadow-sm">
            {isLoading ? '?' : initials}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12px] font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
              {isLoading ? 'Cargando...' : businessName}
            </span>
            <span className="text-[10px] text-slate-400 font-black truncate uppercase tracking-widest">
              {isLoading ? '...' : userRole}
            </span>
          </div>

          <div className="text-slate-300 group-hover:text-blue-400 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
