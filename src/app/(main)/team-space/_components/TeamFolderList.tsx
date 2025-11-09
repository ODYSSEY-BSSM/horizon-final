'use client';

import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import Pagination from '@/app/(main)/dashboard/_components/Pagination';
import AddFolderCard from '@/app/(main)/my-roadmaps/_components/AddFolderCard';
import type { Folder } from '@/app/(main)/my-roadmaps/_components/FolderCard';
import FolderCard from '@/app/(main)/my-roadmaps/_components/FolderCard';
import type { FilterTab, TeamFolder } from '@/lib/types/team';
import { tokens } from '@/shared/tokens';
import TeamFilterTabs from './TeamFilterTabs';

interface TeamFolderListProps {
  folders: TeamFolder[];
  activeTab: FilterTab;
  onTabClick: (tab: FilterTab) => void;
  onAddFolderClick: () => void;
}

const TeamFolderList = ({
  folders,
  activeTab,
  onTabClick,
  onAddFolderClick,
}: TeamFolderListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;
  const [sortedFolders, setSortedFolders] = useState<Folder[]>([]);

  useEffect(() => {
    // Convert TeamFolder to Folder format
    const convertedFolders: Folder[] = folders.map((folder) => ({
      id: Number.parseInt(folder.id.split('-')[1] || '0', 10),
      name: folder.name,
      description: folder.description,
      progress: folder.progress,
      roadmapCount: folder.roadmapCount,
      completedCount: folder.createdRoadmapCount,
      lastRoadmap: folder.lastRoadmapName ?? '로드맵 없음',
    }));

    const foldersToSort = [...convertedFolders];
    const sorted = foldersToSort.sort((a, b) => {
      if (activeTab === 'progress') {
        return b.progress - a.progress;
      }
      if (activeTab === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.id - a.id;
    });
    setSortedFolders(sorted);
  }, [folders, activeTab]);

  return (
    <StyledContainer>
      <TeamFilterTabs activeTab={activeTab} onTabClick={onTabClick} />
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

export default TeamFolderList;

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
