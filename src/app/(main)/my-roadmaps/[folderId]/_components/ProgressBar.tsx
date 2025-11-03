'use client';

import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar = ({ progress, className }: ProgressBarProps) => {
  return (
    <StyledContainer className={className}>
      <StyledProgressText variant="B2" color={tokens.colors.neutral[900]}>
        {progress}%
      </StyledProgressText>
      <StyledTrack>
        <StyledFill style={{ width: `${progress}%` }} />
      </StyledTrack>
    </StyledContainer>
  );
};

export default ProgressBar;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 80px;
`;

const StyledProgressText = styled(Text)`
  text-align: right;
`;

const StyledTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${tokens.colors.primary[100]};
  border: 1px solid ${tokens.colors.primary[100]};
  border-radius: 9999px;
  overflow: hidden;
`;

const StyledFill = styled.div`
  height: 100%;
  background-color: ${tokens.colors.primary[500]};
  border-radius: 9999px;
  transition: width 0.3s ease;
`;
