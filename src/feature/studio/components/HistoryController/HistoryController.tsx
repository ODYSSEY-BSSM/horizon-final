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
    <Container>
      <UndoButton onClick={onUndo} disabled={!canUndo} aria-label="실행취소">
        <Icon className="material-symbols-rounded">arrow_back</Icon>
      </UndoButton>
      <Divider />
      <RedoButton onClick={onRedo} disabled={!canRedo} aria-label="재실행">
        <Icon className="material-symbols-rounded">arrow_forward</Icon>
      </RedoButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.md};
  overflow: hidden;
  background-color: ${tokens.colors.white};
`;

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: ${tokens.spacing.sm};
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

const UndoButton = styled(ButtonBase)`
  border-right: 1px solid ${tokens.colors.neutral[200]};
`;

const RedoButton = styled(ButtonBase)``;

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background-color: ${tokens.colors.neutral[200]};
`;

const Icon = styled.span<{ disabled?: boolean }>`
  font-size: 20px;
  color: ${(props) => (props.disabled ? tokens.colors.neutral[400] : tokens.colors.neutral[900])};
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
`;
