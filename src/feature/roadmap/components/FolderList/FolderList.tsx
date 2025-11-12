'use client';

import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import { AddFolderCard } from '@/feature/folder';
import { useRootFolder } from '@/feature/folder/hooks/useFolderQueries';
import type { Folder } from '@/feature/roadmap';
import {
  FOLDER_FILTER_TABS as FILTER_TABS,
  FilterTabs,
  FolderCard,
  Pagination,
} from '@/feature/roadmap';
import { tokens } from '@/shared/tokens';

export interface FolderListProps {
  className?: string;
  onAddFolderClick: () => void;
}

const FolderList = ({ className, onAddFolderClick }: FolderListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('latest');

  const { data: rootFolder, isLoading, error } = useRootFolder();

  const folders: Folder[] = useMemo(() => {
    if (!rootFolder?.directories) {
      return [];
    }

    return rootFolder.directories.map((folder) => ({
      id: folder.id,
      name: folder.name,
      description: '', // API 응답에 설명이 없으므로 빈 문자열로 설정
      progress: 0, // TODO: 진행률 계산 로직 필요
      roadmapCount: folder.roadmaps?.length || 0,
      completedCount: 0, // TODO: 완료된 로드맵 개수 계산 필요
      lastRoadmap: '', // TODO: 마지막 로드맵 이름 가져오기
    }));
  }, [rootFolder]);

  const sortedFolders = useMemo(() => {
    return [...folders].sort((a, b) => {
      if (activeTab === 'progress') {
        return b.progress - a.progress;
      }
      if (activeTab === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.id - a.id;
    });
  }, [folders, activeTab]);

  const totalPages = 1; // TODO: 페이지네이션 로직 추가 필요

  if (isLoading) {
    return (
      <StyledContainer className={className}>
        <FilterTabs tabs={FILTER_TABS} activeTab={activeTab} onTabClick={setActiveTab} />
        <StyledMainContent>
          <StyledContent>
            <StyledLoadingText>폴더를 불러오는 중...</StyledLoadingText>
          </StyledContent>
        </StyledMainContent>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer className={className}>
        <FilterTabs tabs={FILTER_TABS} activeTab={activeTab} onTabClick={setActiveTab} />
        <StyledMainContent>
          <StyledContent>
            <StyledErrorText>폴더를 불러오는데 실패했습니다.</StyledErrorText>
          </StyledContent>
        </StyledMainContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer className={className}>
      <FilterTabs tabs={FILTER_TABS} activeTab={activeTab} onTabClick={setActiveTab} />
      <StyledMainContent>
        <StyledContent>
          <StyledFolderGrid>
            {sortedFolders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
            <AddFolderCard key="add-folder" onClick={onAddFolderClick} />
          </StyledFolderGrid>
        </StyledContent>
        <StyledPaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </StyledPaginationWrapper>
      </StyledMainContent>
    </StyledContainer>
  );
};

export default FolderList;

const StyledContainer = styled.div`
  width: 100%;
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.large};
  background-color: ${tokens.colors.white};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StyledMainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
  min-height: 524px;
`;

const StyledContent = styled.div`
  padding: ${tokens.spacing.large};
`;

const StyledFolderGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.spacing.medium};
  width: 100%;
  max-width: 1032px;
`;

const StyledPaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  > div {
    padding: 0;
  }
`;

const StyledLoadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: ${tokens.colors.neutral[600]};
  font-size: 16px;
`;

const StyledErrorText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: ${tokens.colors.error[200]};
  font-size: 16px;
`;
