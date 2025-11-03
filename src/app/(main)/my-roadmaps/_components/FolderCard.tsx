'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

export interface Folder {
  id: number;
  name: string;
  description: string;
  progress: number; // 0-100 범위
  roadmapCount: number;
  completedCount: number;
  lastRoadmap: string;
}

interface FolderCardProps {
  folder: Folder;
}

const FolderCard = ({ folder }: FolderCardProps) => {
  const router = useRouter();

  const handleContinueClick = () => {
    router.push(`/my-roadmaps/${folder.id}`);
  };

  return (
    <StyledFolderItem>
      <StyledFolderHeader>
        <StyledFolderIcon>
          <Icon name="folder" variant="SM" color={tokens.colors.neutral[800]} filled decorative />
        </StyledFolderIcon>
        <StyledFolderInfo>
          <Text as="h3" variant="ST" color={tokens.colors.neutral[800]}>
            {folder.name}
          </Text>
          <Text as="p" variant="B2" color={tokens.colors.neutral[500]}>
            {folder.description}
          </Text>
        </StyledFolderInfo>
      </StyledFolderHeader>

      <StyledProgressSection>
        <StyledProgressHeader>
          <Text as="span" variant="C" color={tokens.colors.neutral[500]}>
            진행률
          </Text>
          <Text as="span" variant="C" color={tokens.colors.primary[500]}>
            {folder.progress}%
          </Text>
        </StyledProgressHeader>
        <StyledProgressBar>
          <StyledProgressFill $progress={folder.progress} />
        </StyledProgressBar>
      </StyledProgressSection>

      <StyledDetailsContainer>
        <StyledFolderStats>
          <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
            로드맵:{' '}
          </Text>
          <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
            {folder.roadmapCount}개
          </Text>
          <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
            {' • '}
          </Text>
          <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
            완료:{' '}
          </Text>
          <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
            {folder.completedCount}개
          </Text>
        </StyledFolderStats>
        <StyledLastRoadmap>
          <StyledLastRoadmapInfo>
            <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
              마지막 로드맵:{' '}
            </Text>
            <StyledRoadmapName as="span" variant="B2" color={tokens.colors.neutral[800]}>
              {folder.lastRoadmap}
            </StyledRoadmapName>
          </StyledLastRoadmapInfo>
          <StyledContinueLink variant="outlined" size="medium" onClick={handleContinueClick}>
            계속하기
          </StyledContinueLink>
        </StyledLastRoadmap>
      </StyledDetailsContainer>
    </StyledFolderItem>
  );
};

export default FolderCard;

const StyledFolderItem = styled.div`
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  padding: ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
  width: 336px;
  box-sizing: border-box;
`;

const StyledFolderHeader = styled.div`
  display: flex;
  gap: ${tokens.spacing.small};
  align-items: center;
`;

const StyledFolderIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StyledFolderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const StyledProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
`;

const StyledProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.small};
  overflow: hidden;
`;

const StyledProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => Math.min(100, Math.max(0, $progress))}%;
  height: 100%;
  background-color: ${tokens.colors.primary[500]};
  transition: width 0.3s ease;
`;

const StyledDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  width: 100%;
`;

const StyledFolderStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
  flex-wrap: wrap;
`;

const StyledLastRoadmap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledLastRoadmapInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
  overflow: hidden;
  flex: 1;
`;

const StyledRoadmapName = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 144px;
`;

const StyledContinueLink = styled(Button)`
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  border: none;
  outline: none;

  &:hover {
    background-color: transparent;
    color: ${tokens.colors.primary[500]};
  }

  &:active {
    background-color: transparent;
    color: ${tokens.colors.primary[500]};
  }
`;
