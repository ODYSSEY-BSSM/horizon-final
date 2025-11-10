import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { MenuItemType } from '@/feature/dashboard/types/dashboard';
import { MENU_ITEMS } from './Sidebar.constants';
import type { SidebarProps } from './Sidebar.types';

export const useSidebar = ({ selected: initialSelected, onMenuSelect }: SidebarProps) => {
  const [selected, setSelected] = useState<MenuItemType>(initialSelected || 'dashboard');
  const router = useRouter();

  useEffect(() => {
    setSelected(initialSelected || 'dashboard');
  }, [initialSelected]);

  const handleMenuClick = (id: MenuItemType) => {
    setSelected(id);
    onMenuSelect?.(id);

    const menuItem = MENU_ITEMS.find((item) => item.id === id);
    if (menuItem?.path) {
      router.push(menuItem.path);
    }
  };

  return {
    selected,
    menuItems: MENU_ITEMS,
    handleMenuClick,
  };
};
