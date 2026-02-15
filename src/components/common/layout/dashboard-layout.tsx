import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../header/header';
import { DashboardLayoutContent } from './dasboard-content';
import { BoxedLayoutStyle } from './boxed-container/boxed-container';
import { MenuAction } from '@/types/system/type-table-actions';
import useWindowDimensions from '@/hooks/use-windows-dimensions';
import DesktopSidebar from '../sidebar/desktop-sidebar/desktop-sidebar';
import { SuccessAlert } from '../alerts/success-alert';

export type UseDashboardLayoutHook = {
  setPageTitle: (title: string) => void;
  setHasBackButton: (value: boolean) => void;
  setHeaderMenu: (actionButtonProps: MenuAction[]) => void;
  setActionsButton: (actionButtonProps: MenuAction) => void;
  setBackNavigationHandler: (handler: () => void) => void;
  setContentClassNames: (classNames: string) => void;
  setDashBoardPadding: (bottomPadding: string) => void;
  setBoxClassName: (classnames: string) => void;
  setShowSuccess: (value: boolean) => void;
};

type LayoutProps = {
  title?: string;
  contentStyle?: BoxedLayoutStyle;
  isMainPage?: boolean;
  children?: JSX.Element | ((useDashboardLayout: UseDashboardLayoutHook) => JSX.Element);
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
};

export function DashboardLayout({
  children,
  isMainPage = true,
  title,
  contentStyle = BoxedLayoutStyle.BOXED,
  onScroll,
}: LayoutProps) {
  const router = useRouter();

  const [pageTitle, setPageTitle] = useState(title);
  const [contentClassNames, setContentClassNames] = useState('');
  const [bottomPadding, setDashBoardPadding] = useState('');
  const [backNavigationHandler, setBackNavigationHandler] = useState<() => void>();
  const [headerMenu, setHeaderMenu] = useState<MenuAction[]>([]);
  const [actionsButton, setActionsButton] = useState<MenuAction>();
  const [hasBackButton, setHasBackButton] = useState(true);
  const [boxClassName, setBoxClassName] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const isChildrenRenderProperty = children && typeof children === 'function';

  return (
    <div className="flex flex-row justify-start h-screen w-screen overflow-hidden relative">

      {/* Notificación Flotante de Éxito */}
      <div className="absolute top-6 right-6 z-[100] pointer-events-none">
        {showSuccess && (
          <div className="pointer-events-auto animate-in fade-in slide-in-from-top-5 duration-300">
            <SuccessAlert onClose={() => setShowSuccess(false)} />
          </div>
        )}
      </div>

      <DesktopSidebar />

      <div className="flex flex-col flex-1 h-full bg-slate-50">
        <Header title={pageTitle} />

        <DashboardLayoutContent
          contentClassNames={contentClassNames}
          onScroll={onScroll}
          contentStyle={contentStyle}
          boxClassName={boxClassName}
        >
          {isChildrenRenderProperty
            ? children({
              setPageTitle,
              setHasBackButton,
              setBackNavigationHandler,
              setHeaderMenu,
              setActionsButton,
              setContentClassNames,
              setDashBoardPadding,
              setBoxClassName,
              setShowSuccess,
            })
            : children}
        </DashboardLayoutContent>
      </div>
    </div>
  );
};