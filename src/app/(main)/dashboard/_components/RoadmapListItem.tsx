'use client';

import styled from '@emotion/styled';
import { Icon } from '@/shared/ui';
import type { RoadmapColor, RoadmapItem } from '@/lib/types/dashboard';
import { tokens } from '@/shared/tokens';
import { ROADMAP_COLORS } from '../_constants/RoadmapList.constants';

export interface RoadmapListItemProps {
  item: RoadmapItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const RoadmapListItem = ({ item }: RoadmapListItemProps) => {
  return (
    <StyledItemContainer>
      <StyledItemLeft>
        <StyledLeadingIcon $color={item.color}>
          <Icon
            name={item.icon}
            variant="SM"
            color={ROADMAP_COLORS[item.color].icon}
            filled
            decorative
          />
        </StyledLeadingIcon>
        <StyledItemInfo>
          <StyledItemTitle>{item.title}</StyledItemTitle>
          <StyledItemMeta>
            <StyledMetaText>{item.category === 'personal' ? '개인' : '팀'}</StyledMetaText>
            <StyledMetaSeparator>•</StyledMetaSeparator>
            <StyledMetaText>{item.steps}단계</StyledMetaText>
            <StyledMetaSeparator>•</StyledMetaSeparator>
            <StyledMetaText>{item.status === 'in-progress' ? '진행중' : '완료'}</StyledMetaText>
          </StyledItemMeta>
        </StyledItemInfo>
      </StyledItemLeft>
      <StyledItemRight>
        <StyledProgressContainer>
          <StyledProgressText>{item.progress}%</StyledProgressText>
          <StyledProgressBar>
            <StyledProgressFill $progress={item.progress} />
          </StyledProgressBar>
        </StyledProgressContainer>
        <StyledOverflowButton aria-label="더보기">
          <Icon name="more_horiz" variant="SM" color={tokens.colors.neutral[500]} decorative />
        </StyledOverflowButton>
      </StyledItemRight>
    </StyledItemContainer>
  );
};

export default RoadmapListItem;

const StyledItemContainer = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  position: relative;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;

const StyledItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.large};
  flex: 1;
  min-width: 0;
`;

const StyledLeadingIcon = styled.div<{ $color: RoadmapColor }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ $color }) => ROADMAP_COLORS[$color].background};
  border-radius: ${tokens.radius.medium};
  flex-shrink: 0;
  position: relative;
`;

const StyledItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
  min-width: 0;
`;

const StyledItemTitle = styled.h3`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[26]};
  color: ${tokens.colors.neutral[800]};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[22]};
  color: ${tokens.colors.neutral[500]};
`;

const StyledMetaText = styled.span`
  white-space: nowrap;
`;

const StyledMetaSeparator = styled.span`
  margin: 0 ${tokens.spacing.xxsmall};
`;

const StyledItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
`;

const StyledProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${tokens.spacing.small};
  width: 80px;
`;

const StyledProgressText = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.neutral[800]};
  text-align: right;
`;

const StyledProgressBar = styled.div`
  width: 80px;
  height: 8px;
  background-color: ${tokens.colors.primary[100]};
  border-radius: 9999px;
  position: relative;
`;

const StyledProgressFill = styled.div<{ $progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 8px;
  width: ${({ $progress }) => `${$progress}%`};
  background-color: ${tokens.colors.primary[500]};
  border-radius: 9999px;
`;

const StyledOverflowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: ${tokens.spacing.xsmall};
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: ${tokens.radius.small};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;
