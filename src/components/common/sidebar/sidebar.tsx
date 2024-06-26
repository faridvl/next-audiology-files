import React from 'react';
import { DesktopView } from '../views/desktop-view/desktop-view';
import DesktopSidebar from './desktop-sidebar/desktop-sidebar';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-gray-900 text-white w-64">
      <DesktopView className="fixed top-0 bottom-0 w-60">
        <DesktopSidebar />
      </DesktopView>
    </aside>
  );
};

export default Sidebar;
