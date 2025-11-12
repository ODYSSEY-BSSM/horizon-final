'use client';

import styled from '@emotion/styled';
import type { RoadmapItem } from '@/feature/dashboard/types/dashboard';
import { tokens } from '@/shared/tokens';
import { gradients } from '@/shared/tokens/gradient/gradient';
import type { RoadmapColor } from '@/shared/types/roadmap';
import { Icon, Text } from '@/shared/ui';

export interface RoadmapCardProps {
  item: RoadmapItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  className?: string;
}

const RoadmapCard = ({ item, onClick, className }: RoadmapCardProps) => {
  const handleOverflowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Show overflow menu
  };

  const handleCardClick = () => {
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <StyledCardContainer
      className={className}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} 로드맵 상세보기`}
    >
      <StyledThumbnail $color={item.color}>
        <StyledThumbnailIcon>
          <Icon name={item.icon} variant="LG" color={tokens.colors.white} filled decorative />
        </StyledThumbnailIcon>
        <StyledProgressBadge status={item.status}>
          <StyledBadgeText as="span" variant="C" color={tokens.colors.white}>
            {item.status === 'in-progress' ? '진행중' : '완료'}
          </StyledBadgeText>
        </StyledProgressBadge>
      </StyledThumbnail>

      <StyledContent>
        <StyledContentHeader>
          <StyledTitleSection>
            <Text as="h3" variant="ST" color={tokens.colors.neutral[800]} ellipsis>
              {item.title}
            </Text>
          </StyledTitleSection>

          <StyledOverflowButton onClick={handleOverflowClick} aria-label="더보기">
            <Icon name="more_horiz" variant="SM" color={tokens.colors.neutral[500]} decorative />
          </StyledOverflowButton>
        </StyledContentHeader>

        <StyledCategoryInfo>
          <StyledCategoryIcon
            name="map"
            variant="XS"
            color={tokens.colors.neutral[500]}
            decorative
          />
          <StyledCategoryText as="span" variant="C" color={tokens.colors.neutral[500]}>
            {item.category === 'personal' ? '개인 로드맵' : '팀 로드맵'}
          </StyledCategoryText>
        </StyledCategoryInfo>
      </StyledContent>
    </StyledCardContainer>
  );
};

export default RoadmapCard;

export const StyledCardContainer = styled.div`
  width: 246px;
  height: 246px;
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${tokens.shadow[0]};

  &:hover {
    border-color: ${tokens.colors.primary[500]};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const StyledThumbnail = styled.div<{ $color: RoadmapColor }>`
  width: 100%;
  height: 148px;
  background: ${({ $color }) => gradients.roadmap[$color]};
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: ${tokens.spacing.medium};
  box-sizing: border-box;
`;

export const StyledThumbnailIcon = styled.div`
  width: 32px;
  height: 32px;
  color: ${tokens.colors.white};
`;

const StyledBadgeText = styled(Text)`
  font-size: 11px;
  line-height: 18px;
  letter-spacing: 0.55px;
  font-weight: 500;
`;

export const StyledProgressBadge = styled.div<{ status: RoadmapItem['status'] }>`
  position: absolute;
  top: ${tokens.spacing.small};
  right: ${tokens.spacing.small};
  padding: ${tokens.spacing.xxsmall} ${tokens.spacing.xsmall};
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${tokens.radius.small};
  display: inline-flex;
  padding: 2px 8px;
`;

export const StyledContent = styled.div`
  width: 100%;
  height: 98px;
  background-color: ${tokens.colors.white};
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

export const StyledContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const StyledTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
  flex: 1;
  min-width: 0;
`;

export const StyledOverflowButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: -${tokens.spacing.xsmall} -${tokens.spacing.xsmall} 0 0;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
    border-radius: ${tokens.radius.small};
  }
`;

const StyledCategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
`;

const StyledCategoryIcon = styled(Icon)`
  font-size: 16px;
`;

const StyledCategoryText = styled(Text)`
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.12px;
  font-weight: 200;
`;
