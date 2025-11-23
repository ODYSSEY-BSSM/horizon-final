import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Text } from '@/shared/ui';

interface TextDividerProps {
  text?: string;
}

export const TextDivider = ({ text = '또는' }: TextDividerProps) => {
  return (
    <StyledDividerWrapper>
      <StyledDividerLine />
      <StyledDividerText>
        <Text variant="O" color={tokens.colors.neutral[400]}>
          {text}
        </Text>
      </StyledDividerText>
    </StyledDividerWrapper>
  );
};

const StyledDividerWrapper = styled.div`
  position: relative;
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDividerLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: ${tokens.colors.neutral[400]};
`;

const StyledDividerText = styled.div`
  background-color: ${tokens.colors.white};
  padding: 0 16px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;
