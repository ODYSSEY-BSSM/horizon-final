'use client';

import styled from '@emotion/styled';
import { useId } from 'react';
import { tokens } from '@/shared/tokens';
import { Button, Text } from '@/shared/ui';
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
  const titleId = useId();
  const descriptionId = useId();

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const isAlertMode = variant === 'alert' || !onConfirm;

  return (
    <StyledOverlay role="presentation" onClick={onClose}>
      <StyledModal
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(e) => e.stopPropagation()}
        $isAlertMode={isAlertMode}
      >
        <StyledContent>
          <StyledTextContent>
            <Text
              id={titleId}
              as="h2"
              variant="H2"
              color={tokens.colors.neutral[800]}
              textAlign="center"
            >
              {title}
            </Text>
            <Text
              id={descriptionId}
              as="p"
              variant="B1"
              color={tokens.colors.neutral[600]}
              textAlign="center"
              whiteSpace="pre-line"
            >
              {description}
            </Text>
          </StyledTextContent>
          <StyledActions $isAlertMode={isAlertMode}>
            {!isAlertMode && (
              <StyledCancelButton size="large" onClick={onClose}>
                {cancelText}
              </StyledCancelButton>
            )}
            <StyledConfirmButton size="large" onClick={handleConfirm}>
              {confirmText}
            </StyledConfirmButton>
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
  padding: ${tokens.spacing.large};
`;

const StyledModal = styled.div<{ $isAlertMode: boolean }>`
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.large};
  width: 400px;
  max-width: 100%;
  box-shadow: ${tokens.shadow[0]};
  overflow: hidden;
`;

const StyledContent = styled.div`
  padding: ${tokens.spacing.xxlarge};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
  align-items: center;
  width: 100%;
  max-width: 312px;
  margin-bottom: 50px;
`;

const StyledActions = styled.div<{ $isAlertMode: boolean }>`
  display: flex;
  gap: ${tokens.spacing.medium};
  width: 100%;
  justify-content: center;
  flex-wrap: ${({ $isAlertMode }) => ($isAlertMode ? 'nowrap' : 'wrap')};
`;

const StyledActionButton = styled(Button)`
  && {
    min-width: 132px;
    height: 48px;
    padding: 0 ${tokens.spacing.large};
    border-radius: ${tokens.radius.medium};
    font-weight: ${tokens.typos.fontWeight.semibold};
  }
`;

const StyledCancelButton = styled(StyledActionButton)`
  && {
    background-color: ${tokens.colors.neutral[600]};
    color: ${tokens.colors.white};
    border: none;

    &:hover {
      background-color: ${tokens.colors.neutral[700]};
    }

    &:active {
      background-color: ${tokens.colors.neutral[800]};
    }
  }
`;

const StyledConfirmButton = styled(StyledActionButton)`
  && {
    background-color: ${tokens.colors.primary[500]};
    color: ${tokens.colors.white};
    border: none;

    &:hover {
      background-color: ${tokens.colors.primary[600]};
    }

    &:active {
      background-color: ${tokens.colors.primary[700]};
    }
  }
`;
