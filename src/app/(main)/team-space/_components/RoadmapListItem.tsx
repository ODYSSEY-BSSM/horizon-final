'use client';

import styled from '@emotion/styled';
import { Icon } from '@/shared/ui';
import type { Roadmap } from '@/lib/types/team';
import { tokens } from '@/shared/tokens';

interface RoadmapListItemProps {
  roadmap: Roadmap;
  onClick: (roadmap: Roadmap) => void;
}

const RoadmapListItem = ({ roadmap, onClick }: RoadmapListItemProps) => {
  const progress =
    roadmap.progress ??
    (roadmap.totalSteps && roadmap.totalSteps > 0
      ? Math.round(((roadmap.completedSteps ?? 0) / roadmap.totalSteps) * 100)
      : 0);

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: 오버플로우 메뉴 구현
    alert('더보기 메뉴는 준비 중입니다.');
  };

  return (
    <StyledContainer onClick={() => onClick(roadmap)}>
      <StyledLeftSection>
        <StyledIconWrapper>
          <Icon name="deployed_code" variant="SM" filled decorative />
        </StyledIconWrapper>
        <StyledInfo>
          <StyledTitle>{roadmap.name}</StyledTitle>
          <StyledMetadata>
            <span>{roadmap.type === 'personal' ? '개인' : '팀'}</span>
            <span>•</span>
            <span>{roadmap.totalSteps ?? 0}단계</span>
            <span>•</span>
            <span>{roadmap.status === 'completed' ? '완료' : '진행중'}</span>
          </StyledMetadata>
        </StyledInfo>
      </StyledLeftSection>

      <StyledRightSection>
        <StyledProgressSection>
          <StyledProgressText>{progress}%</StyledProgressText>
          <StyledProgressBar>
            <StyledProgressFill $progress={progress} />
          </StyledProgressBar>
        </StyledProgressSection>
        <StyledMoreButton onClick={handleMoreClick} aria-label="더보기">
          <Icon name="more_horiz" variant="SM" color={tokens.colors.neutral[500]} decorative />
        </StyledMoreButton>
      </StyledRightSection>
    </StyledContainer>
  );
};

export default RoadmapListItem;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 16px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;

const StyledLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${tokens.colors.error[100]};
  border-radius: ${tokens.radius.medium};
  color: ${tokens.colors.error[200]};
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 151px;
`;

const StyledTitle = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[26]};
  color: ${tokens.colors.neutral[800]};
  margin: 0;
  height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[22]};
  color: ${tokens.colors.neutral[500]};
`;

const StyledRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  width: 80px;
`;

const StyledProgressText = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.neutral[800]};
  width: 100%;
  text-align: right;
`;

const StyledProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${tokens.colors.primary[100]};
  border-radius: 9999px;
  overflow: hidden;
`;

const StyledProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background-color: ${tokens.colors.primary[500]};
  border-radius: 9999px;
  transition: width 0.3s ease;
`;

const StyledMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;
