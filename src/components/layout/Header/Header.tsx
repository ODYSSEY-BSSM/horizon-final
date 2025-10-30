'use client';

import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { DEFAULT_SEARCH_PLACEHOLDER } from './Header.constants';
import { useHeader } from './Header.hooks';
import {
  BreadcrumbNav,
  BreadcrumbSeparator,
  HeaderActions,
  HeaderContainer,
  ProfileButton,
  SearchBarContainer,
  SearchIconButton,
  SearchInput,
} from './Header.styles';
import type { BreadcrumbNavigationProps, HeaderProps, SearchBarProps } from './Header.types';

const BreadcrumbNavigation = ({ items }: BreadcrumbNavigationProps) => {
  return (
    <BreadcrumbNav data-node-id="4452:787">
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
          <Text as="span" variant="ST" color={tokens.colors.neutral[700]}>
            {item}
          </Text>
        </span>
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
      <SearchBarContainer data-node-id="4452:820">
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="로드맵 검색"
        />
        <SearchIconButton type="button" onClick={handleSearchClick} aria-label="검색">
          <Icon name="search" variant="SM" color={tokens.colors.neutral[400]} decorative />
        </SearchIconButton>
      </SearchBarContainer>
    </form>
  );
};

const Profile = () => {
  return (
    <ProfileButton aria-label="프로필" data-node-id="4452:834">
      <Icon name="person" variant="LG" filled color={tokens.colors.neutral[200]} decorative />
    </ProfileButton>
  );
};

const Header = ({ breadcrumbs = ['Dashboard'], onSearch, className }: HeaderProps) => {
  return (
    <HeaderContainer className={className} data-node-id="4452:845">
      <BreadcrumbNavigation items={breadcrumbs} />
      <HeaderActions>
        <SearchBar onSearch={onSearch} />
        <Profile />
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;
