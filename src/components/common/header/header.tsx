import React, { Fragment } from 'react';
import { Settings, Info, Bell, LogOut, User as UserIcon, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { useHeader } from './use-header';

export function Header({ title }: { title?: string }) {
  const { userName, userRole, initials, isLoading, handleLogout } = useHeader();

  return (
    <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black text-slate-800 tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Botones de acción rápidos */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Info size={20} /></button>
            <Link href="/settings">
              <button className="p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><Settings size={20} /></button>
            </Link>
            <button className="p-2 text-slate-400 hover:text-orange-500 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
          </div>

          <div className="w-px h-8 bg-slate-100 mx-1" />

          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex items-center gap-3 pl-1 group outline-none" disabled={isLoading}>
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-black text-slate-800 leading-none mb-0.5">
                  {isLoading ? '...' : userName}
                </span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  En línea
                </span>
              </div>

              {/* Avatar con iniciales */}
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-100/50 uppercase text-[11px]">
                {isLoading ? '?' : initials}
              </div>
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-2xl border border-slate-100 focus:outline-none p-1.5 z-50">
                <div className="px-3 py-2 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cuenta</p>
                  <p className="text-xs font-bold text-slate-600 truncate">{isLoading ? 'Cargando...' : userName}</p>
                  <p className="text-[9px] font-bold text-blue-500 uppercase">{userRole}</p>
                </div>

                <MenuItem>
                  {({ active }) => (
                    <Link href="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}>
                      <UserIcon size={16} /> Mi Perfil
                    </Link>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ active }) => (
                    <button className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold w-full text-left ${active ? 'bg-slate-50' : 'text-slate-600'}`}>
                      <LifeBuoy size={16} /> Soporte
                    </button>
                  )}
                </MenuItem>

                <div className="h-px bg-slate-100 my-1" />

                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold w-full text-left ${active ? 'bg-red-50 text-red-600' : 'text-red-500'}`}
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