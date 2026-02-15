import React from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { TypographyVariant, Typography } from "../../typography/typography";
import { AudioWaveform, Mountain } from "lucide-react";
import { routesPrivate } from "@/shared/navigation/routes";
import { NAVIGATION_PATHS } from '@/shared/constants/sidebard';

const UserAvatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-[11px] shadow-lg shadow-blue-100/50">
      {initials}
    </div>
  );
};

export default function DesktopSidebar() {
  const { t } = useTranslation();
  const router = useRouter();

  const user = {
    name: "Farid Villacis",
    role: "Especialista"
  };

  return (
    <div className="flex h-full max-h-screen flex-col bg-white border-r border-slate-100/80">

      <div className="flex h-[80px] items-center px-8 mb-2">
        <Link href={routesPrivate.dashboard} className="flex items-center gap-3" prefetch={false}>
          <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <AudioWaveform size={20} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col">
            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-slate-900 text-[15px] tracking-tight leading-none">
              Audio<span className="text-blue-600">Flow</span>
            </Typography>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-0.5">
              Sistema Clínico
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-auto px-3">
        <nav className="space-y-0.5">
          {NAVIGATION_PATHS.map((item) => {
            const isActive = router.pathname.startsWith(item.route);
            const Icon = item.icon;

            return (
              <Link
                key={item.menuKey}
                href={item.route}
                className={`
                  relative flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 group
                  ${isActive
                    ? "text-blue-600 bg-blue-50/50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                `}
                prefetch={false}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full" />
                )}

                {Icon && (
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}
                  />
                )}

                <Typography
                  variant={isActive ? TypographyVariant.BODY_SEMIBOLD : TypographyVariant.BODY}
                  className={`text-[13.5px] ${isActive ? "text-blue-600" : ""}`}
                >
                  {item.labelKey}
                </Typography>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 py-6 mt-auto border-t border-slate-50">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <UserAvatar name={user.name} />
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-black text-slate-800 truncate">
              {user.name}
            </span>
            <span className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-tighter italic">
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}