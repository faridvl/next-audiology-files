import React from 'react';
import { useNavigation } from '@/hooks/use-navigation';
import { useRouter } from 'next/router';
import Sidebar from '../sidebar/sidebar';

type LayoutProps = {
  pageTitle: string;
  children: any
};

export function DashboardLayout({ pageTitle, children }: LayoutProps)  {
  const router = useRouter();
  const { navigateToHome, navigateToAbout } = useNavigation();
  return (
     <div className="flex flex-row justify-start h-screen w-screen">
      
 <Sidebar />
      <main>{children}</main>
    </div>
  );
};

