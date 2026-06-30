import React, { Fragment } from 'react';
import { LogOut, User as UserIcon, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { useHeader } from './use-header';
import { Typography, TypographyVariant } from '../typography/typography';
import { routesPrivate } from '@/shared/navigation/routes';

export function Header({ title }: { title?: string }) {
  const { userName, userRole, initials, isLoading, handleLogout } = useHeader();

  return (
    <header className="h-16 border-b border-neutral-100 bg-white/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-3">

        {/* Logo mobile — solo visible cuando el sidebar está oculto */}
        <Link href={routesPrivate.dashboard} className="md:hidden flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 bg-primary rounded-app-sm flex items-center justify-center text-white font-extrabold text-xs">
            Z
          </div>
          <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm font-black text-neutral-800 tracking-tight">Zynka</Typography>
        </Link>

        {/* Title Section */}
        <div className="hidden md:flex items-center gap-4 flex-1 min-w-0">
          {title && (
            <Typography
              variant={TypographyVariant.ACCENT}
              className="text-neutral-900 truncate"
            >
              {title}
            </Typography>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          <div className="w-px h-8 bg-neutral-100" />

          <Menu as="div" className="relative inline-block text-left">
            <MenuButton
              className="flex items-center gap-3 outline-none group"
              disabled={isLoading}
            >
              {/* User Info */}
              <div className="hidden md:flex flex-col items-end leading-tight">
                <Typography
                  variant={TypographyVariant.BODY_SEMIBOLD}
                  className="text-[13px] text-neutral-800"
                >
                  {isLoading ? '...' : userName}
                </Typography>

                <Typography
                  variant={TypographyVariant.CAPTION}
                  className="text-primary uppercase tracking-wide"
                >
                  {userRole}
                </Typography>
              </div>

              {/* Avatar */}
              <div className="h-9 w-9 rounded-app-sm bg-primary flex items-center justify-center font-semibold text-white uppercase text-[11px] transition-all duration-200 group-hover:opacity-90">
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
              <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-app-sm bg-white shadow-lg border border-neutral-100 focus:outline-none p-1.5 z-50">

                {/* Account Info */}
                <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                  <Typography
                    variant={TypographyVariant.OVERLINE}
                  >
                    Cuenta
                  </Typography>

                  <Typography
                    variant={TypographyVariant.BODY_SEMIBOLD}
                    className="truncate"
                  >
                    {isLoading ? 'Cargando...' : userName}
                  </Typography>

                  <Typography
                    variant={TypographyVariant.CAPTION}
                    className="text-primary uppercase"
                  >
                    {userRole}
                  </Typography>
                </div>

                {/* Profile */}
                <MenuItem>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                        ${active ? 'bg-neutral-50' : ''}
                      `}
                    >
                      <UserIcon size={16} className="text-neutral-500" />
                      <Typography variant={TypographyVariant.BODY}>
                        Mi Perfil
                      </Typography>
                    </Link>
                  )}
                </MenuItem>

                {/* Support */}
                <MenuItem>
                  {({ active }) => (
                    <button
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors
                        ${active ? 'bg-neutral-50' : ''}
                      `}
                    >
                      <LifeBuoy size={16} className="text-neutral-500" />
                      <Typography variant={TypographyVariant.BODY}>
                        Soporte
                      </Typography>
                    </button>
                  )}
                </MenuItem>

                <div className="h-px bg-neutral-100 my-1" />

                {/* Logout */}
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors
                        ${active ? 'bg-danger/10' : ''}
                      `}
                    >
                      <LogOut size={16} className="text-danger" />
                      <Typography
                        variant={TypographyVariant.BODY}
                        className="text-danger"
                      >
                        Cerrar Sesión
                      </Typography>
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
