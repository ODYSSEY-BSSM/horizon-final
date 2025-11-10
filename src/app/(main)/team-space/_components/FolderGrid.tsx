'use client';

import styled from '@emotion/styled';
import type { TeamFolder } from '@/lib/types/team';
import { tokens } from '@/shared/tokens';
import { FOLDER_FILTER_TABS } from '../_constants/FilterTabs.constants';
import { AddFolderCard } from '@/feature/folder';
import { FilterTabs } from '@/feature/roadmap';
import FolderListItem from './FolderListItem';

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
  return (
    <StyledContainer>
      <FilterTabs tabs={FOLDER_FILTER_TABS} activeTab={activeTab} onTabClick={onTabClick} />
      <StyledContent>
        <StyledGrid>
          {folders.map((folder) => (
            <FolderListItem key={folder.id} folder={folder} teamId={teamId} />
          ))}
          <AddFolderCard onClick={onAddFolder} />
        </StyledGrid>
      </StyledContent>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: 12px;
  padding: 12px 24px 24px;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  min-height: 524px;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
