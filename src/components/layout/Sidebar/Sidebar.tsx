'use client';

import Image from 'next/image';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { useSidebar } from './Sidebar.hooks';
import {
  LogoArea,
  LogoImage,
  LogoText,
  MenuItemButton,
  MenuItemContent,
  MenuList,
  SidebarContainer,
} from './Sidebar.styles';
import type { MenuItemProps, SidebarProps } from './Sidebar.types';

const MenuItem = ({ item, selected, onClick }: MenuItemProps) => {
  return (
    <MenuItemButton
      $selected={selected}
      onClick={onClick}
      aria-current={selected ? 'page' : undefined}
    >
      <MenuItemContent $selected={selected}>
        <Icon name={item.icon} variant="SM" filled={selected} decorative />
        <Text as="span" variant="B1">
          {item.label}
        </Text>
      </MenuItemContent>
      {item.checked && (
        <Icon name="check" variant="SM" color={tokens.colors.success[200]} decorative />
      )}
    </MenuItemButton>
  );
};

const Sidebar = ({ className, ...restProps }: SidebarProps) => {
  const { selected, menuItems, handleMenuClick } = useSidebar(restProps);

  return (
    <SidebarContainer className={className}>
      <LogoArea>
        <LogoImage>
          <Image src="/logo.svg" alt="HORIZON Logo" width={40} height={40} priority />
        </LogoImage>
        <LogoText>HORIZON</LogoText>
      </LogoArea>

      <MenuList>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            selected={selected === item.id}
            onClick={() => handleMenuClick(item.id)}
          />
        ))}
      </MenuList>
    </SidebarContainer>
  );
};

export default Sidebar;
