import { useCallback, useState } from 'react';

export const useDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // TODO: API 연동 시 검색 로직 구현
  }, []);

  const handleAddRoadmap = useCallback(() => {
    // TODO: 로드맵 추가 모달 오픈 로직 구현
  }, []);

  return {
    searchQuery,
    handleSearch,
    handleAddRoadmap,
  };
};
