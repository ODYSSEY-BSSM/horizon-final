'use client';

import { useRouter } from 'next/navigation';
import { useLogout } from '@/feature/auth/hooks/useSignIn';
import { useDropdown } from '@/shared/hooks/useDropdown';
import { tokens } from '@/shared/tokens';
import { Icon } from '@/shared/ui';
import { DEFAULT_SEARCH_PLACEHOLDER } from './Header.constants';
import { useHeader } from './Header.hooks';
import {
  BreadcrumbItem,
  BreadcrumbNav,
  DropdownItem,
  HeaderActions,
  HeaderContainer,
  ProfileButton,
  ProfileContainer,
  ProfileDropdown,
  SearchBarContainer,
  SearchIconButton,
  SearchInput,
} from './Header.styles';
import type { BreadcrumbNavigationProps, HeaderProps, SearchBarProps } from './Header.types';

const BreadcrumbNavigation = ({ items }: BreadcrumbNavigationProps) => {
  return (
    <BreadcrumbNav>
      {items.map((item, index) => (
        <BreadcrumbItem key={item} $isLast={index === items.length - 1}>
          {item}
        </BreadcrumbItem>
      ))}
    </BreadcrumbNav>
  );
};

const SearchBar = ({ onSearch, placeholder = DEFAULT_SEARCH_PLACEHOLDER }: SearchBarProps) => {
  const { searchQuery, setSearchQuery, handleSearchSubmit, handleSearchClick } = useHeader({
    onSearch,
  });

  return (
    <form onSubmit={handleSearchSubmit}>
      <SearchBarContainer>
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="로드맵 검색"
        />
        <SearchIconButton type="button" onClick={handleSearchClick} aria-label="검색">
          <Icon
            name="search"
            variant="SM"
            color={tokens.colors.neutral[400]}
            size={20}
            decorative
          />
        </SearchIconButton>
      </SearchBarContainer>
    </form>
  );
};

const Profile = () => {
  const router = useRouter();
  const { mutate: logout } = useLogout();
  const { isOpen, dropdownRef, handleToggle, highlightedIndex, handleKeyDown } = useDropdown({
    itemCount: 1,
    onSelect: (index) => {
      if (index === 0) {
        handleLogout();
      }
    },
  });

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push('/signin');
      },
    });
  };

  return (
    <ProfileContainer ref={dropdownRef} onKeyDown={handleKeyDown}>
      <ProfileButton onClick={handleToggle} aria-label="프로필" aria-expanded={isOpen}>
        <Icon name="person" variant="LG" filled color={tokens.colors.neutral[200]} decorative />
      </ProfileButton>
      {isOpen && (
        <ProfileDropdown>
          <DropdownItem
            onClick={handleLogout}
            $isHighlighted={highlightedIndex === 0}
            type="button"
          >
            로그아웃
          </DropdownItem>
        </ProfileDropdown>
      )}
    </ProfileContainer>
  );
};

const Header = ({ breadcrumbs = ['Dashboard'], onSearch, className }: HeaderProps) => {
  return (
    <HeaderContainer className={className}>
      <BreadcrumbNavigation items={breadcrumbs} />
      <HeaderActions>
        <SearchBar onSearch={onSearch} />
        <Profile />
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;
