'use client';

import styled from '@emotion/styled';
import Image from 'next/image';
import { tokens } from '@/shared/tokens';
import { Icon } from '@/shared/ui';

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
    <path d="M1 0V24" stroke={tokens.colors.neutral[500]} strokeWidth="1.5" />
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
    <StyledContainer>
      <StyledLeftSection>
        <StyledLogoIcon>
          <Image src="/logo.svg" alt="Horizon Logo" width={40} height={40} priority />
        </StyledLogoIcon>
        <StyledTitleSection>
          <StyledEditorTitle>Roadmap Editor</StyledEditorTitle>
          <DividerIcon />
          <StyledRoadmapTitle>{roadmapTitle}</StyledRoadmapTitle>
          {isSaved && <StyledSavedLabel>(저장됨)</StyledSavedLabel>}
        </StyledTitleSection>
      </StyledLeftSection>

      <StyledRightSection>
        <StyledTempSaveButton onClick={onTempSave} disabled={isSaving}>
          <Icon name={isSaving ? 'autorenew' : 'save'} variant="SM" />
          {isSaving ? '저장중' : '임시저장'}
        </StyledTempSaveButton>
        <StyledSaveButton onClick={onSave} disabled={isSaving}>
          <Icon name="save" variant="SM" />
          저장하기
        </StyledSaveButton>
      </StyledRightSection>
    </StyledContainer>
  );
};

const StyledContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 12px 20px;
  background-color: ${tokens.colors.white};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
  box-sizing: border-box;
`;

const StyledLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.large};
  flex: 1;
  min-width: 0;
`;

const StyledLogoIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.primary};
`;

const StyledTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.large};
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const StyledEditorTitle = styled.h1`
  font-family: ${tokens.typos.fontFamily.suit};
  font-size: 20px;
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: 28px;
  letter-spacing: -0.2px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;
`;

const StyledRoadmapTitle = styled.h2`
  font-family: ${tokens.typos.fontFamily.suit};
  font-size: 20px;
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: 28px;
  letter-spacing: -0.2px;
  color: ${tokens.colors.neutral[500]};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`;

const StyledSavedLabel = styled.span`
  font-family: ${tokens.typos.fontFamily.suit};
  font-size: 18px;
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: 26px;
  color: ${tokens.colors.neutral[500]};
`;

const StyledRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.gap.large};
  flex-shrink: 0;
`;

const StyledTempSaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.gap.medium};
  height: 40px;
  padding: 10px 20px;
  box-sizing: border-box;
  border: 1.5px solid ${tokens.colors.primary[500]};
  border-radius: ${tokens.radius.medium};
  background-color: ${tokens.colors.white};
  color: ${tokens.colors.primary[500]};
  font-family: ${tokens.typos.fontFamily.suit};
  font-size: 14px;
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background-color: ${tokens.colors.primary[100]};
  }

  &:disabled {
    border-color: ${tokens.colors.neutral[300]};
    color: ${tokens.colors.neutral[300]};
    cursor: not-allowed;
  }
`;

const StyledSaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.gap.medium};
  height: 40px;
  padding: 10px 20px 10px 12px;
  box-sizing: border-box;
  border: none;
  border-radius: ${tokens.radius.medium};
  background-color: ${tokens.colors.primary[500]};
  color: ${tokens.colors.white};
  font-family: ${tokens.typos.fontFamily.suit};
  font-size: 14px;
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background-color: ${tokens.colors.primary[600]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
