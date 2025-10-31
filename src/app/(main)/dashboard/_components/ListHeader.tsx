'use client';

import styled from '@emotion/styled';
import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import type { ViewType } from '@/lib/types/dashboard';
import { tokens } from '@/shared/tokens';

export interface ListHeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAddRoadmap: () => void;
}

// Styled Components
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  padding: 0 ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
`;

const HeaderTitle = styled.h2`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[20]};
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: ${tokens.typos.lineHeight[28]};
  letter-spacing: -0.2px;
  color: ${tokens.colors.neutral[800]};
  margin: 0;
  white-space: nowrap;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  padding: ${tokens.spacing.xxsmall};
  background-color: ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
`;

const ViewButton = styled.button<{ $active: boolean }>`
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

const ListHeader = ({ currentView, onViewChange, onAddRoadmap }: ListHeaderProps) => {
  return (
    <HeaderContainer data-node-id="4502:1437">
      <HeaderTitle>로드맵 리스트</HeaderTitle>
      <HeaderActions>
        <ViewToggle data-node-id="4452:628">
          <ViewButton
            $active={currentView === 'list'}
            onClick={() => onViewChange('list')}
            aria-label="리스트 보기"
          >
            <Icon name="list" variant="MD" decorative />
            <Text as="span" variant="B2" color={tokens.colors.neutral[700]}>
              리스트
            </Text>
          </ViewButton>
          <ViewButton
            $active={currentView === 'thumbnail'}
            onClick={() => onViewChange('thumbnail')}
            aria-label="썸네일 보기"
          >
            <Icon name="calendar_view_month" variant="MD" decorative />
            <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
              썸네일
            </Text>
          </ViewButton>
        </ViewToggle>
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
      </HeaderActions>
    </HeaderContainer>
  );
};

export default ListHeader;
