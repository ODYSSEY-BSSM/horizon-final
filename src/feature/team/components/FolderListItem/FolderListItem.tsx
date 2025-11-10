'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/ui';
import type { TeamFolder } from '@/lib/types/team';
import { tokens } from '@/shared/tokens';

interface FolderListItemProps {
  folder: TeamFolder;
  teamId: string;
}

export default function FolderListItem({ folder, teamId }: FolderListItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/team-space/${teamId}/${folder.id}`);
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/team-space/${teamId}/${folder.id}`);
  };

  return (
    <StyledCard onClick={handleClick}>
      <StyledHeader>
        <StyledIconWrapper>
          <Icon name="folder" variant="SM" filled decorative />
        </StyledIconWrapper>
        <StyledTitleSection>
          <StyledTitle>{folder.name}</StyledTitle>
          <StyledDescription>{folder.description}</StyledDescription>
        </StyledTitleSection>
      </StyledHeader>

      <StyledContent>
        <StyledProgressSection>
          <StyledProgressHeader>
            <StyledProgressLabel>진행률</StyledProgressLabel>
            <StyledProgressPercent>{folder.progress}%</StyledProgressPercent>
          </StyledProgressHeader>
          <StyledProgressBar>
            <StyledProgressFill $progress={folder.progress} />
          </StyledProgressBar>
        </StyledProgressSection>

        <StyledInfoSection>
          <StyledInfo>
            <StyledInfoLabel>로드맵:</StyledInfoLabel>
            <StyledInfoValue>{folder.roadmapCount}개</StyledInfoValue>
            <StyledInfoSeparator>•</StyledInfoSeparator>
            <StyledInfoLabel>완료: </StyledInfoLabel>
            <StyledInfoValue>{folder.createdRoadmapCount}개</StyledInfoValue>
          </StyledInfo>
          <StyledFooter>
            <StyledLastRoadmap>
              <StyledInfoLabel>마지막 로드맵:</StyledInfoLabel>
              <StyledLastRoadmapName>{folder.lastRoadmapName || '-'}</StyledLastRoadmapName>
            </StyledLastRoadmap>
            <StyledContinueButton onClick={handleContinue}>계속하기</StyledContinueButton>
          </StyledFooter>
        </StyledInfoSection>
      </StyledContent>
    </StyledCard>
  );
}

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${tokens.colors.primary[300]};
    box-shadow: 0 2px 8px rgba(74, 129, 240, 0.1);
  }
`;

const StyledHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${tokens.colors.neutral[200]};
  border-radius: 8px;
  flex-shrink: 0;
`;

const StyledTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const StyledTitle = styled.h3`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[26]};
  color: ${tokens.colors.neutral[800]};
  margin: 0;
`;

const StyledDescription = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[22]};
  color: ${tokens.colors.neutral[500]};
  margin: 0;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const StyledProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const StyledProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledProgressLabel = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[12]};
  font-weight: ${tokens.typos.fontWeight.medium};
  line-height: ${tokens.typos.lineHeight[18]};
  color: ${tokens.colors.neutral[500]};
  letter-spacing: 0.01em;
`;

const StyledProgressPercent = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[12]};
  font-weight: ${tokens.typos.fontWeight.medium};
  line-height: ${tokens.typos.lineHeight[18]};
  color: ${tokens.colors.primary[500]};
  letter-spacing: 0.01em;
`;

const StyledProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${tokens.colors.neutral[200]};
  border-radius: 4px;
  overflow: hidden;
`;

const StyledProgressFill = styled.div<{ $progress: number }>`
  width: ${(props) => props.$progress}%;
  height: 100%;
  background-color: ${tokens.colors.primary[500]};
  transition: width 0.3s ease;
`;

const StyledInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const StyledInfo = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  flex-wrap: wrap;
  font-size: ${tokens.typos.fontSize[14]};
  line-height: ${tokens.typos.lineHeight[22]};
`;

const StyledInfoLabel = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-weight: ${tokens.typos.fontWeight.light};
  color: ${tokens.colors.neutral[500]};
`;

const StyledInfoValue = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-weight: ${tokens.typos.fontWeight.light};
  color: ${tokens.colors.neutral[800]};
`;

const StyledInfoSeparator = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-weight: ${tokens.typos.fontWeight.light};
  color: ${tokens.colors.neutral[500]};
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: ${tokens.typos.fontSize[14]};
`;

const StyledLastRoadmap = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const StyledLastRoadmapName = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[22]};
  color: ${tokens.colors.neutral[800]};
  max-width: 144px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledContinueButton = styled.button`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[20]};
  color: ${tokens.colors.primary[500]};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${tokens.colors.primary[600]};
    text-decoration: underline;
  }
`;
