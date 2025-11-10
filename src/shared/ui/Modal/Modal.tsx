'use client';

import styled from '@emotion/styled';
import { Icon } from '@/shared/ui';
import { Text } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import type { ModalProps, ModalWidth } from './Modal.types';

const MODAL_WIDTHS: Record<ModalWidth, string> = {
  small: '400px',
  medium: '560px',
  large: '720px',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'medium',
  showCloseButton = true,
}: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()} $width={width}>
        <StyledHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              {title}
            </Text>
            {showCloseButton && (
              <StyledCloseButton onClick={onClose} type="button" aria-label="닫기">
                <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
              </StyledCloseButton>
            )}
          </StyledHeaderTop>
          {description && (
            <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
              {description}
            </Text>
          )}
        </StyledHeader>

        <StyledDivider />

        <StyledContent>{children}</StyledContent>
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

const StyledModal = styled.div<{ $width: ModalWidth }>`
  background-color: ${tokens.colors.white};
  border-radius: ${tokens.radius.large};
  width: ${({ $width }) => MODAL_WIDTHS[$width]};
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.div`
  padding: ${tokens.spacing.xlarge};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const StyledDivider = styled.div`
  height: 1px;
  background-color: ${tokens.colors.neutral[100]};
`;

const StyledContent = styled.div`
  padding: ${tokens.spacing.xlarge};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xlarge};
`;
