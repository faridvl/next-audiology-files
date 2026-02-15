import React from 'react';
import { Settings, Info, Bell, LogOut, User as UserIcon, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { useLogout } from '@/hooks/use-logout';

const UserAvatar = ({ name, avatarUrl, size = 'sm' }: { name: string, avatarUrl?: string, size?: 'sm' | 'md' }) => {
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(/\s+/);
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return names[0][0]?.toUpperCase() || '?';
  };

  const sizeClasses = size === 'sm' ? 'h-9 w-9 text-[11px]' : 'h-11 w-11 text-xs';

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses} rounded-xl object-cover border border-slate-100 shadow-sm`}
      />
    );
  }

  return (
    <div className={`${sizeClasses} rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-100/50 uppercase tracking-tighter`}>
      {getInitials(name)}
    </div>
  );
};

type Props = {
  title?: string;
};

export function Header({ title }: Props) {
  const user = {
    name: "Farid Villacis",
    avatarUrl: undefined
  };
  const { handleLogout } = useLogout();
  return (
    <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">

        {/* Lado Izquierdo: Título */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black text-slate-800 tracking-tight">
            {title}
          </h1>
        </div>

        {/* Lado Derecho: Acciones y Usuario */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group" title="Información">
              <Info size={20} strokeWidth={2.2} />
            </button>

            <Link href="/settings">
              <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all" title="Configuración">
                <Settings size={20} strokeWidth={2.2} />
              </button>
            </Link>

            <button className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all relative group">
              <Bell size={20} strokeWidth={2.2} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
          </div>

          <div className="w-px h-8 bg-slate-100 mx-1" />

          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex items-center gap-3 pl-1 group outline-none">
              <div className="hidden md:flex flex-col items-end transition-opacity group-hover:opacity-80">
                <span className="text-xs font-black text-slate-800 leading-none mb-0.5">
                  {user.name}
                </span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  En línea
                </span>
              </div>
              <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />
            </MenuButton>

            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems
                anchor="bottom end"
                className="w-56 mt-2 origin-top-right rounded-2xl bg-white shadow-2xl shadow-slate-200 border border-slate-100 focus:outline-none z-50 overflow-hidden p-1.5"
              >
                <div className="px-3 py-2 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cuenta</p>
                  <p className="text-xs font-bold text-slate-600 truncate">{user.name}</p>
                </div>

                <MenuItem>
                  {({ active }) => (
                    <Link href="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}>
                      <UserIcon size={16} /> Mi Perfil
                    </Link>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ active }) => (
                    <button className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold w-full transition-colors ${active ? 'bg-slate-50 text-slate-900' : 'text-slate-600'}`}>
                      <LifeBuoy size={16} /> Soporte Técnico
                    </button>
                  )}
                </MenuItem>

                <div className="h-px bg-slate-100 my-1" />

                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold w-full transition-colors ${active ? 'bg-red-50 text-red-600' : 'text-red-500'}`}
                    >
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>

        </div>
      </div>
    </header>
  );
}