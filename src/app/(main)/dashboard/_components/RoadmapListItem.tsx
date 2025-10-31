'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import type { RoadmapColor, RoadmapItem } from '@/lib/types/dashboard';
import { tokens } from '@/shared/tokens';
import { ROADMAP_COLORS } from '../_constants/RoadmapList.constants';

export interface RoadmapListItemProps {
  item: RoadmapItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// Styled Components
const ItemContainer = styled.div`
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

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.large};
  flex: 1;
  min-width: 0;
`;

const LeadingIcon = styled.div<{ $color: RoadmapColor }>`
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

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
  min-width: 0;
`;

const ItemTitle = styled.h3`
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

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[22]};
  color: ${tokens.colors.neutral[500]};
`;

const MetaText = styled.span`
  white-space: nowrap;
`;

const MetaSeparator = styled.span`
  margin: 0 ${tokens.spacing.xxsmall};
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${tokens.spacing.small};
  width: 80px;
`;

const ProgressText = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.neutral[800]};
  text-align: right;
`;

const ProgressBar = styled.div`
  width: 80px;
  height: 8px;
  background-color: ${tokens.colors.primary[100]};
  border-radius: 9999px;
  position: relative;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 8px;
  width: ${({ $progress }) => `${$progress}%`};
  background-color: ${tokens.colors.primary[500]};
  border-radius: 9999px;
`;

const OverflowButton = styled.button`
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

const RoadmapListItem = ({ item }: RoadmapListItemProps) => {
  return (
    <ItemContainer data-node-id="4502:1387">
      <ItemLeft>
        <LeadingIcon $color={item.color} data-node-id="4488:637">
          <Icon
            name={item.icon}
            variant="SM"
            color={ROADMAP_COLORS[item.color].icon}
            filled
            decorative
          />
        </LeadingIcon>
        <ItemInfo>
          <ItemTitle>{item.title}</ItemTitle>
          <ItemMeta>
            <MetaText>{item.category === 'personal' ? '개인' : '팀'}</MetaText>
            <MetaSeparator>•</MetaSeparator>
            <MetaText>{item.steps}단계</MetaText>
            <MetaSeparator>•</MetaSeparator>
            <MetaText>{item.status === 'in-progress' ? '진행중' : '완료'}</MetaText>
          </ItemMeta>
        </ItemInfo>
      </ItemLeft>
      <ItemRight>
        <ProgressContainer data-node-id="4461:545">
          <ProgressText>{item.progress}%</ProgressText>
          <ProgressBar>
            <ProgressFill $progress={item.progress} />
          </ProgressBar>
        </ProgressContainer>
        <OverflowButton aria-label="더보기" data-node-id="4461:600">
          <Icon name="more_horiz" variant="SM" color={tokens.colors.neutral[500]} decorative />
        </OverflowButton>
      </ItemRight>
    </ItemContainer>
  );
};

export default RoadmapListItem;
