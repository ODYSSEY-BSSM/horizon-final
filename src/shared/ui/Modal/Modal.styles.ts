import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

/**
 * Common Modal styled components
 * These are shared across all modal implementations to ensure consistency
 */

export const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const StyledModalContainer = styled.div<{ $width?: string }>`
  background-color: ${tokens.colors.white};
  border-radius: ${tokens.radius.large};
  width: ${({ $width }) => $width || '560px'};
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const StyledCloseButton = styled.button`
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

export const StyledDivider = styled.div`
  height: 1px;
  background-color: ${tokens.colors.neutral[100]};
`;
