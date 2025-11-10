'use client';

import styled from '@emotion/styled';
import { Button } from '@/shared/ui';
import { Text } from '@/shared/ui';
import { tokens } from '@/shared/tokens';

interface DisconnectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DisconnectConfirmModal = ({ isOpen, onClose, onConfirm }: DisconnectConfirmModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledContent>
          <StyledTextContent>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              연동을 해제하시겠습니까?
            </Text>
            <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
              연동을 해제해도 기존에 사용한 학교 노드와 내용은 유지됩니다.
            </Text>
          </StyledTextContent>
          <StyledActions>
            <Button variant="outlined" size="large" onClick={onClose}>
              취소
            </Button>
            <Button variant="contained" size="large" onClick={onConfirm}>
              해제하기
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledModal>
    </StyledOverlay>
  );
};

export default DisconnectConfirmModal;

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
  width: 400px;
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
  gap: ${tokens.spacing.medium};
  width: 100%;
`;
