import React, { useState } from 'react';
import { useNavigation } from '@/hooks/use-navigation';
import { useRouter } from 'next/router';
import { Header } from '../header/header';
import { DashboardLayoutContent } from './dasboard-content';
import { BoxedLayoutStyle } from './boxed-container/boxed-container';
import { MenuAction } from '@/types/system/type-table-actions';
import useWindowDimensions from '@/hooks/use-windows-dimensions';
import DesktopSidebar from '../sidebar/desktop-sidebar/desktop-sidebar';

export type UseDashboardLayoutHook = {
  setPageTitle: (title: string) => void;
  setHasBackButton: (value: boolean) => void;
  setHeaderMenu: (actionButtonProps: MenuAction[]) => void;
  setActionsButton: (actionButtonProps: MenuAction) => void;
  setBackNavigationHandler: (handler: () => void) => void;
  setContentClassNames: (classNames: string) => void;
  setDashBoardPadding: (bottomPadding: string) => void;
  setBoxClassName: (classnames: string) => void;
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
  const { navigateToHome, navigateToAbout } = useNavigation();
  const [pageTitle, setPageTitle] = useState(title);
  const [contentClassNames, setContentClassNames] = useState('');
  const [bottomPadding, setDashBoardPadding] = useState('');
  const [backNavigationHandler, setBackNavigationHandler] = useState<() => void>();
  const [headerMenu, setHeaderMenu] = useState<MenuAction[]>([]);
  const [actionsButton, setActionsButton] = useState<MenuAction>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasBackButton, setHasBackButton] = useState(true);
  const { isDesktop } = useWindowDimensions();
  const [boxClassName, setBoxClassName] = useState('');

  const isChildrenRenderProperty = children && typeof children === 'function';


  return (
    <div className="flex flex-row justify-start h-screen w-screen">

      <DesktopSidebar />
      <div className="flex flex-col flex-1 h-full">
        <Header title={pageTitle} />
        <DashboardLayoutContent
          contentClassNames={contentClassNames}
          onScroll={onScroll}
          contentStyle={contentStyle}
          //  bottomPadding={bottomPadding}
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
            })
            : children}
        </DashboardLayoutContent>
      </div>
    </div>
  );
};

