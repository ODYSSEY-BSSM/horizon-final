'use client';

import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

interface EmptyStateProps {
  onCreateClick?: () => void;
  className?: string;
}

const EmptyState = ({ onCreateClick, className }: EmptyStateProps) => {
  return (
    <StyledContainer className={className}>
      <Text variant="H3" color={tokens.colors.neutral[700]}>
        아직 로드맵이 없습니다.
      </Text>
      {onCreateClick && (
        <StyledLink onClick={onCreateClick}>
          <Text variant="B1" color={tokens.colors.primary[500]}>
            새 로드맵 만들기
          </Text>
        </StyledLink>
      )}
    </StyledContainer>
  );
};

export default EmptyState;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.xxlarge} ${tokens.spacing.large};
  min-height: 230px;
`;

const StyledLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;
