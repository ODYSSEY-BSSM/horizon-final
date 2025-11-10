'use client';

import styled from '@emotion/styled';
import { Button } from '@/shared/ui';
import { Text } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import type { ConfirmModalProps } from './ConfirmModal.types';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'confirm',
}: ConfirmModalProps) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const isAlertMode = variant === 'alert' || !onConfirm;

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()} $isAlertMode={isAlertMode}>
        <StyledContent>
          <StyledTextContent>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              {title}
            </Text>
            <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
              {description}
            </Text>
          </StyledTextContent>
          <StyledActions $isAlertMode={isAlertMode}>
            {!isAlertMode && (
              <Button variant="outlined" size="large" onClick={onClose}>
                {cancelText}
              </Button>
            )}
            <Button variant="contained" size="large" onClick={handleConfirm}>
              {confirmText}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledModal>
    </StyledOverlay>
  );
};

const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledModal = styled.div<{ $isAlertMode: boolean }>`
  background-color: ${tokens.colors.white};
  border-radius: ${tokens.radius.large};
  width: ${({ $isAlertMode }) => ($isAlertMode ? '440px' : '400px')};
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

const StyledActions = styled.div<{ $isAlertMode: boolean }>`
  display: flex;
  gap: ${tokens.spacing.medium};
  width: 100%;
  justify-content: ${({ $isAlertMode }) => ($isAlertMode ? 'center' : 'flex-start')};
`;
