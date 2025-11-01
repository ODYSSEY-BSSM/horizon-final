import { useCallback, useState } from 'react';

export const useMyRoadmapsData = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // TODO: API 연동 시 검색 로직 구현
  }, []);

  return {
    searchQuery,
    handleSearch,
  };
};
