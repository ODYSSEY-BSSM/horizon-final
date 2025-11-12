'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Icon, Text } from '@/shared/ui';
import {
  StyledCloseButton,
  StyledDivider,
  StyledModalContainer,
  StyledOverlay,
} from './Modal.styles';
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
      <StyledModalContainer onClick={(e) => e.stopPropagation()} $width={MODAL_WIDTHS[width]}>
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
      </StyledModalContainer>
    </StyledOverlay>
  );
};

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

const StyledContent = styled.div`
  padding: ${tokens.spacing.xlarge};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xlarge};
`;
