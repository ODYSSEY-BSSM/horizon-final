'use client';

import { Fragment } from 'react';
import Icon from '@/components/common/Icon/Icon';
import { tokens } from '@/shared/tokens';
import { DEFAULT_SEARCH_PLACEHOLDER } from './Header.constants';
import { useHeader } from './Header.hooks';
import {
  BreadcrumbItem,
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
    <BreadcrumbNav>
      {items.map((item, index) => (
        <Fragment key={item}>
          {index > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
          <BreadcrumbItem
            style={{
              color:
                index === items.length - 1
                  ? tokens.colors.neutral[700]
                  : tokens.colors.neutral[500],
            }}
          >
            {item}
          </BreadcrumbItem>
        </Fragment>
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
  return (
    <ProfileButton aria-label="프로필">
      <Icon name="person" variant="LG" filled color={tokens.colors.neutral[200]} decorative />
    </ProfileButton>
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
