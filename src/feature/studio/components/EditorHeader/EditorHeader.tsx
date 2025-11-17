'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export type EditorHeaderState = 'editing' | 'saved' | 'saving';

export interface EditorHeaderProps {
  state?: EditorHeaderState;
  roadmapTitle?: string;
  onTempSave?: () => void;
  onSave?: () => void;
}

const DividerIcon = () => (
  <svg
    width="2"
    height="24"
    viewBox="0 0 2 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="presentation"
    aria-hidden="true"
  >
    <path d="M1 0V24" stroke="#6B7684" strokeWidth="1.5" />
  </svg>
);

export const EditorHeader = ({
  state = 'editing',
  roadmapTitle = 'Roadmap1',
  onTempSave,
  onSave,
}: EditorHeaderProps) => {
  const isSaving = state === 'saving';
  const isSaved = state === 'saved';

  return (
    <Container>
      <LeftSection>
        <LogoIcon>
          <span className="material-symbols-rounded" style={{ fontSize: '40px' }}>
            developer_board
          </span>
        </LogoIcon>
        <TitleSection>
          <EditorTitle>Roadmap Editor</EditorTitle>
          <DividerIcon />
          <RoadmapTitle>{roadmapTitle}</RoadmapTitle>
          {isSaved && <SavedLabel>(저장됨)</SavedLabel>}
        </TitleSection>
      </LeftSection>

      <RightSection>
        <TempSaveButton onClick={onTempSave} disabled={isSaving}>
          <span className="material-symbols-rounded">{isSaving ? 'autorenew' : 'save'}</span>
          {isSaving ? '저장중' : '임시저장'}
        </TempSaveButton>
        <SaveButton onClick={onSave} disabled={isSaving}>
          <span className="material-symbols-rounded">save</span>
          저장하기
        </SaveButton>
      </RightSection>
    </Container>
  );
};

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 0 ${tokens.spacing.lg};
  background-color: ${tokens.colors.white};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.lg};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.primary};

  .material-symbols-rounded {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.lg};
`;

const EditorTitle = styled.h1`
  font-family: ${tokens.typography.fontFamily.suit};
  font-size: 20px;
  font-weight: ${tokens.typography.fontWeight.bold};
  line-height: 28px;
  letter-spacing: -0.2px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const RoadmapTitle = styled.h2`
  font-family: ${tokens.typography.fontFamily.suit};
  font-size: 20px;
  font-weight: ${tokens.typography.fontWeight.bold};
  line-height: 28px;
  letter-spacing: -0.2px;
  color: ${tokens.colors.neutral[500]};
  margin: 0;
`;

const SavedLabel = styled.span`
  font-family: ${tokens.typography.fontFamily.suit};
  font-size: 18px;
  font-weight: ${tokens.typography.fontWeight.semiBold};
  line-height: 26px;
  color: ${tokens.colors.neutral[500]};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

const TempSaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.xs};
  height: 40px;
  padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
  border: 1.5px solid ${tokens.colors.primary};
  border-radius: ${tokens.radius.md};
  background-color: ${tokens.colors.white};
  color: ${tokens.colors.primary};
  font-family: ${tokens.typography.fontFamily.suit};
  font-size: 14px;
  font-weight: ${tokens.typography.fontWeight.semiBold};
  line-height: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${tokens.colors.primary}10;
  }

  &:disabled {
    border-color: ${tokens.colors.neutral[300]};
    color: ${tokens.colors.neutral[300]};
    cursor: not-allowed;
  }

  .material-symbols-rounded {
    font-size: 20px;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.xs};
  height: 40px;
  padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
  padding-left: 12px;
  border: none;
  border-radius: ${tokens.radius.md};
  background-color: ${tokens.colors.primary};
  color: ${tokens.colors.white};
  font-family: ${tokens.typography.fontFamily.suit};
  font-size: 14px;
  font-weight: ${tokens.typography.fontWeight.semiBold};
  line-height: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${tokens.colors.primary}dd;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .material-symbols-rounded {
    font-size: 20px;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
`;
