'use client';

import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import Pagination from '@/app/(main)/dashboard/_components/Pagination';
import { tokens } from '@/shared/tokens';
import AddFolderCard from './AddFolderCard';
import FilterTabs from './FilterTabs';
import type { Folder } from './FolderCard';
import FolderCard from './FolderCard';

export interface FolderListProps {
  className?: string;
  onAddFolderClick: () => void;
}

const mockFolders: Folder[] = [
  {
    id: 1,
    name: 'React Study',
    description: '리액트 공부 폴더',
    progress: 50,
    roadmapCount: 10,
    completedCount: 5,
    lastRoadmap: 'React Hooks',
  },
  {
    id: 2,
    name: 'Algorithm',
    description: '알고리즘 문제 풀이',
    progress: 75,
    roadmapCount: 8,
    completedCount: 6,
    lastRoadmap: 'Dynamic Programming',
  },
  {
    id: 3,
    name: 'Next.js Project',
    description: 'Next.js로 사이드 프로젝트',
    progress: 30,
    roadmapCount: 12,
    completedCount: 3,
    lastRoadmap: 'Authentication',
  },
  {
    id: 4,
    name: 'Design System',
    description: '회사 디자인 시스템 구축',
    progress: 100,
    roadmapCount: 15,
    completedCount: 15,
    lastRoadmap: 'Component Documentation',
  },
  {
    id: 5,
    name: 'Vue.js Intro',
    description: 'Vue.js 기초 다지기',
    progress: 10,
    roadmapCount: 5,
    completedCount: 0,
    lastRoadmap: 'Vue Router',
  },
];

const FolderList = ({ className, onAddFolderClick }: FolderListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1; // TODO: 실제 데이터에 따라 동적으로 계산
  const [sortedFolders, setSortedFolders] = useState<Folder[]>([]);
  const [activeTab, setActiveTab] = useState('latest');

  useEffect(() => {
    const foldersToSort = [...mockFolders];
    const sorted = foldersToSort.sort((a, b) => {
      if (activeTab === 'progress') {
        return b.progress - a.progress;
      }
      if (activeTab === 'name') {
        return a.name.localeCompare(b.name);
      }
      // "latest" is the default
      return b.id - a.id;
    });
    setSortedFolders(sorted);
  }, [activeTab]);

  return (
    <StyledContainer className={className}>
      <FilterTabs activeTab={activeTab} onTabClick={setActiveTab} />
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
  width: 1032px;
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
