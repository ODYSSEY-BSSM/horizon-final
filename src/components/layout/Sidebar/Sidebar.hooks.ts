import { useState } from 'react';
import type { MenuItemType } from '@/lib/types/dashboard';
import { MENU_ITEMS } from './Sidebar.constants';
import type { SidebarProps } from './Sidebar.types';

export const useSidebar = ({ selected: initialSelected, onMenuSelect }: SidebarProps) => {
  const [selected, setSelected] = useState<MenuItemType>(initialSelected || 'dashboard');

  const handleMenuClick = (id: MenuItemType) => {
    setSelected(id);
    onMenuSelect?.(id);
  };

  return {
    selected,
    menuItems: MENU_ITEMS,
    handleMenuClick,
  };
};
