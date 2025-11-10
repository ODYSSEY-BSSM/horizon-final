import { type FormEvent, useState } from 'react';
import type { HeaderProps } from './Header.types';

export const useHeader = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    handleSearchClick,
  };
};
