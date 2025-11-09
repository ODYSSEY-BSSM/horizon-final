'use client';

import styled from '@emotion/styled';
import Button from '@/components/common/Button/Button';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

interface ConnectFailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectFailModal = ({ isOpen, onClose }: ConnectFailModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledContent>
          <StyledTextContent>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              연결에 실패했습니다.
            </Text>
            <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
              본인의 학교가 지원되는지 확인한 후, 학교에서 지급한 구글 계정으로 회원가입해주세요.
            </Text>
          </StyledTextContent>
          <StyledActions>
            <Button variant="contained" size="large" onClick={onClose}>
              확인
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledModal>
    </StyledOverlay>
  );
};

export default ConnectFailModal;

const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledModal = styled.div`
  background-color: ${tokens.colors.white};
  border-radius: ${tokens.radius.large};
  width: 440px;
  max-width: 90vw;
  overflow: hidden;
`;

const StyledContent = styled.div`
  padding: ${tokens.spacing.xlarge} ${tokens.spacing.xxlarge};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xlarge};
`;

const StyledTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
  text-align: left;
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
