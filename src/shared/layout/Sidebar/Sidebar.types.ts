import type { MenuItem, MenuItemType } from '@/feature/dashboard/types/dashboard';

export interface SidebarProps {
  className?: string;
  selected?: MenuItemType;
  onMenuSelect?: (id: MenuItemType) => void;
}

export interface MenuItemProps {
  item: MenuItem;
  selected: boolean;
  onClick?: () => void;
}
