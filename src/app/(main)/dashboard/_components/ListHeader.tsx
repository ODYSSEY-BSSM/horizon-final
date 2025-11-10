'use client';

import styled from '@emotion/styled';
import { Button } from '@/shared/ui';
import { Icon } from '@/shared/ui';
import { Text } from '@/shared/ui';
import type { ViewType } from '@/lib/types/dashboard';
import { tokens } from '@/shared/tokens';

interface ListHeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAddRoadmap: () => void;
}

const ListHeader = ({ currentView, onViewChange, onAddRoadmap }: ListHeaderProps) => {
  return (
    <StyledHeaderContainer>
      <StyledHeaderTitle>로드맵 리스트</StyledHeaderTitle>
      <StyledHeaderActions>
        <StyledViewToggle>
          <StyledViewButton
            $active={currentView === 'list'}
            onClick={() => onViewChange('list')}
            aria-label="리스트 보기"
          >
            <Icon name="list" variant="MD" decorative />
            <Text as="span" variant="B2" color={tokens.colors.neutral[700]}>
              리스트
            </Text>
          </StyledViewButton>
          <StyledViewButton
            $active={currentView === 'thumbnail'}
            onClick={() => onViewChange('thumbnail')}
            aria-label="썸네일 보기"
          >
            <Icon name="calendar_view_month" variant="MD" decorative />
            <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
              썸네일
            </Text>
          </StyledViewButton>
        </StyledViewToggle>
        <Button
          size="medium"
          variant="contained"
          iconPosition="left"
          iconName="add"
          aria-label="새 로드맵"
          onClick={onAddRoadmap}
        >
          새 로드맵
        </Button>
      </StyledHeaderActions>
    </StyledHeaderContainer>
  );
};

export default ListHeader;

const StyledHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  padding: 0 ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
`;

const StyledHeaderTitle = styled.h2`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[20]};
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: ${tokens.typos.lineHeight[28]};
  letter-spacing: -0.2px;
  color: ${tokens.colors.neutral[800]};
  margin: 0;
  white-space: nowrap;
`;

const StyledHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
`;

const StyledViewToggle = styled.div`
  display: flex;
  align-items: center;
  padding: ${tokens.spacing.xxsmall};
  background-color: ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
`;

const StyledViewButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: ${tokens.spacing.xxsmall} ${tokens.spacing.small};
  background-color: ${({ $active }) => ($active ? tokens.colors.white : 'transparent')};
  border: none;
  border-radius: ${tokens.spacing.xxsmall};
  cursor: pointer;
  gap: ${tokens.spacing.xxsmall};
  transition: background-color 0.2s ease;
  color: ${({ $active }) => ($active ? tokens.colors.neutral[700] : tokens.colors.neutral[500])};

  &:hover {
    background-color: ${({ $active }) => ($active ? tokens.colors.white : tokens.colors.neutral[100])};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;
