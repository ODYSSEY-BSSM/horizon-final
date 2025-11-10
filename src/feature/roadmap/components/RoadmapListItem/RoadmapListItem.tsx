'use client';

import styled from '@emotion/styled';
import { ROADMAP_COLORS } from '@/feature/roadmap/constants';
import { tokens } from '@/shared/tokens';
import { Icon, Text } from '@/shared/ui';
import type { RoadmapListItemProps } from './RoadmapListItem.types';

const RoadmapListItem = ({
  roadmap,
  onClick,
  onEdit,
  onDelete,
  showActions = true,
}: RoadmapListItemProps) => {
  const colors = ROADMAP_COLORS[roadmap.color] ?? ROADMAP_COLORS.blue;

  return (
    <StyledContainer onClick={onClick}>
      <StyledLeftSection>
        <StyledIconBox $bgColor={colors.bg}>
          <Icon name={roadmap.icon} variant="SM" filled color={colors.icon} decorative />
        </StyledIconBox>
        <StyledInfoSection>
          <Text variant="ST" color={tokens.colors.neutral[800]}>
            {roadmap.name}
          </Text>
          <StyledMetaData>
            <Text variant="B2" color={tokens.colors.neutral[500]}>
              {roadmap.type === 'personal' ? '개인' : '팀'}
            </Text>
            <StyledBullet>•</StyledBullet>
            <Text variant="B2" color={tokens.colors.neutral[500]}>
              {roadmap.totalSteps}단계
            </Text>
            <StyledBullet>•</StyledBullet>
            <Text variant="B2" color={tokens.colors.neutral[500]}>
              {roadmap.status === 'in-progress'
                ? '진행중'
                : roadmap.status === 'completed'
                  ? '완료'
                  : '시작 전'}
            </Text>
          </StyledMetaData>
        </StyledInfoSection>
      </StyledLeftSection>
      <StyledRightSection>
        <StyledProgressContainer>
          <Text variant="B2" color={tokens.colors.neutral[600]}>
            {roadmap.progress}%
          </Text>
          <StyledProgressBar>
            <StyledProgressFill $progress={roadmap.progress} $color={colors.icon} />
          </StyledProgressBar>
        </StyledProgressContainer>
        {showActions && (
          <StyledActionsContainer>
            {onEdit && (
              <StyledActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                aria-label="편집"
              >
                <Icon name="edit" variant="SM" color={tokens.colors.neutral[500]} decorative />
              </StyledActionButton>
            )}
            {onDelete && (
              <StyledActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                aria-label="삭제"
              >
                <Icon name="delete" variant="SM" color={tokens.colors.neutral[500]} decorative />
              </StyledActionButton>
            )}
            {/* TODO: 더보기 메뉴 기능 구현 */}
            <StyledActionButton aria-label="더보기">
              <Icon name="more_horiz" variant="SM" color={tokens.colors.neutral[500]} decorative />
            </StyledActionButton>
          </StyledActionsContainer>
        )}
      </StyledRightSection>
    </StyledContainer>
  );
};

export default RoadmapListItem;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${tokens.spacing.medium} ${tokens.spacing.large};
  background: ${tokens.colors.white};
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${tokens.colors.neutral[100]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const StyledLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.medium};
  flex: 1;
  min-width: 0;
`;

const StyledIconBox = styled.div<{ $bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: ${tokens.radius.medium};
  flex-shrink: 0;
`;

const StyledInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
  min-width: 0;
  flex: 1;
`;

const StyledMetaData = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xsmall};
`;

const StyledBullet = styled.span`
  color: ${tokens.colors.neutral[300]};
  font-size: ${tokens.typos.fontSize[12]};
`;

const StyledRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.medium};
`;

const StyledProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${tokens.spacing.xsmall};
  min-width: 80px;
`;

const StyledProgressBar = styled.div`
  width: 80px;
  height: 8px;
  background-color: ${tokens.colors.neutral[100]};
  border-radius: 9999px;
  overflow: hidden;
`;

const StyledProgressFill = styled.div<{ $progress: number; $color: string }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background-color: ${({ $color }) => $color};
  border-radius: 9999px;
  transition: width 0.3s ease;
`;

const StyledActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xsmall};
`;

const StyledActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: ${tokens.radius.small};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;
