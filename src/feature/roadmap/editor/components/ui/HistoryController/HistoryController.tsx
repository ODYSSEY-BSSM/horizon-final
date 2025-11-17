'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export interface HistoryControllerProps {
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const HistoryController = ({
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: HistoryControllerProps) => {
  return (
    <StyledContainer>
      <StyledUndoButton onClick={onUndo} disabled={!canUndo} aria-label="실행취소">
        <StyledIcon className="material-symbols-rounded">arrow_back</StyledIcon>
      </StyledUndoButton>
      <StyledDivider />
      <StyledRedoButton onClick={onRedo} disabled={!canRedo} aria-label="재실행">
        <StyledIcon className="material-symbols-rounded">arrow_forward</StyledIcon>
      </StyledRedoButton>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  overflow: hidden;
  background-color: ${tokens.colors.white};
`;

const StyledButtonBase = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: ${tokens.spacing.small};
  background-color: ${tokens.colors.white};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const StyledUndoButton = styled(StyledButtonBase)`
  border-right: 1px solid ${tokens.colors.neutral[200]};
`;

const StyledRedoButton = styled(StyledButtonBase)``;

const StyledDivider = styled.div`
  width: 1px;
  height: 100%;
  background-color: ${tokens.colors.neutral[200]};
`;

const StyledIcon = styled.span<{ disabled?: boolean }>`
  font-size: 20px;
  color: ${(props) => (props.disabled ? tokens.colors.neutral[400] : tokens.colors.neutral[900])};
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
`;
