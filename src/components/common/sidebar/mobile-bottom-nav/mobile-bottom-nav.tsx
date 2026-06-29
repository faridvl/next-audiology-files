import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSidebar } from '../desktop-sidebar/use-sidebar';

export default function MobileBottomNav() {
  const router = useRouter();
  const { filteredNavigation } = useSidebar();

  // Mostrar solo los primeros 5 items para no saturar la barra
  const visibleItems = filteredNavigation.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {visibleItems.map((item) => {
          const isActive = router.pathname.startsWith(item.route);
          const Icon = item.icon;

          return (
            <Link
              key={item.menuKey}
              href={item.route}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'text-[#1E3A8A]'
                  : 'text-slate-400'
              }`}
            >
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-[#1E3A8A]/10' : ''
              }`}>
                {Icon && (
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={isActive ? 'text-[#1E3A8A]' : 'text-slate-400'}
                  />
                )}
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#1E3A8A] rounded-full" />
                )}
              </div>
              <span className={`text-[9px] font-bold truncate max-w-full uppercase tracking-wide ${
                isActive ? 'text-[#1E3A8A]' : 'text-slate-400'
              }`}>
                {item.labelKey}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
