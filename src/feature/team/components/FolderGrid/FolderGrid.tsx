'use client';

import styled from '@emotion/styled';
import { useMemo } from 'react';
import { AddFolderCard } from '@/feature/folder';
import { FilterTabs, FolderCard } from '@/feature/roadmap';
import type { TeamFolder } from '@/feature/team/types/team';
import { mapTeamFolderToFolder } from '@/feature/team/utils/folderMapper';
import { FOLDER_SORT_TABS as FOLDER_FILTER_TABS } from '@/shared/constants/filterTabs';
import { tokens } from '@/shared/tokens';

interface FolderGridProps {
  folders: TeamFolder[];
  teamId: string;
  activeTab: string;
  onTabClick: (tabId: string) => void;
  onAddFolder: () => void;
}

export default function FolderGrid({
  folders,
  teamId,
  activeTab,
  onTabClick,
  onAddFolder,
}: FolderGridProps) {
  // 팀 폴더를 일반 폴더 형식으로 변환
  const mappedFolders = useMemo(() => folders.map(mapTeamFolderToFolder), [folders]);

  // 팀 폴더 네비게이션을 위한 base path
  const basePath = `/team-space/${teamId}`;

  return (
    <StyledContainer>
      <FilterTabs tabs={FOLDER_FILTER_TABS} activeTab={activeTab} onTabClick={onTabClick} />
      <StyledMainContent>
        <StyledContent>
          <StyledGrid>
            {mappedFolders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} basePath={basePath} />
            ))}
            <AddFolderCard onClick={onAddFolder} />
          </StyledGrid>
        </StyledContent>
      </StyledMainContent>
    </StyledContainer>
  );
}

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

const StyledGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.spacing.medium};
  width: 100%;
  max-width: 1032px;
`;
