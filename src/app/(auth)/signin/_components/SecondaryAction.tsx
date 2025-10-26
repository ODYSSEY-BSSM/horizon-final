import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';

interface SecondaryActionProps {
  onSignUpClick?: () => void;
}

const SecondaryAction = ({ onSignUpClick }: SecondaryActionProps) => {
  return (
    <StyledWrapper>
      <StyledTextGroup>
        <Text variant="B2" color={tokens.colors.neutral[600]}>
          아직 계정이 없으신가요?
        </Text>
        <Text
          as="button"
          type="button"
          variant="B2"
          color={tokens.colors.primary[500]}
          onClick={onSignUpClick}
          style={{ cursor: 'pointer' }}
        >
          회원가입하기
        </Text>
      </StyledTextGroup>
    </StyledWrapper>
  );
};

export default SecondaryAction;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const StyledTextGroup = styled.div`
  display: flex;
  gap: 4px;
`;
