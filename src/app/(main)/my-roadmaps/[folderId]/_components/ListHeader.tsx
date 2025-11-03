'use client';

import styled from '@emotion/styled';
import Button from '@/components/common/Button/Button';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import type { ViewMode } from '../_types';
import ViewToggle from './ViewToggle';

interface ListHeaderProps {
  title?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddClick?: () => void;
  className?: string;
}

const ListHeader = ({
  title = '로드맵 리스트',
  viewMode,
  onViewModeChange,
  onAddClick,
  className,
}: ListHeaderProps) => {
  return (
    <StyledContainer className={className}>
      <Text variant="H3" color={tokens.colors.neutral[900]}>
        {title}
      </Text>
      <StyledRightSection>
        <ViewToggle activeMode={viewMode} onModeChange={onViewModeChange} />
        {onAddClick && (
          <Button
            variant="contained"
            size="medium"
            onClick={onAddClick}
            iconName="add"
            iconPosition="left"
          >
            새 로드맵
          </Button>
        )}
      </StyledRightSection>
    </StyledContainer>
  );
};

export default ListHeader;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${tokens.spacing.large} ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
`;

const StyledRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.medium};
`;
