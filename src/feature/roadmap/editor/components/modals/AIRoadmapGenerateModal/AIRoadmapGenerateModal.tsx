'use client';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useState } from 'react';
import { tokens } from '@/shared/tokens';
import { Button, Icon, Text, TextField } from '@/shared/ui';
import { useGenerateAIRoadmap } from '../../../api/aiApi';
import { useAIStore } from '../../../store/aiStore';
import { apiNodesToReactFlow } from '../../../utils/nodeConverter';
import type { AIRoadmapGenerateModalProps } from './AIRoadmapGenerateModal.types';

export const AIRoadmapGenerateModal = ({
  directoryId,
  teamId,
  onClose,
  onSuccess,
}: AIRoadmapGenerateModalProps) => {
  // Store state
  const {
    generateStep,
    generateFormData,
    isGenerating,
    setGenerateStep,
    updateGenerateFormData,
    setIsGenerating,
    resetGenerateForm,
  } = useAIStore();

  // Local state for validation
  const [languageError, setLanguageError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  // API mutation
  const generateMutation = useGenerateAIRoadmap(directoryId, teamId);

  // Handlers
  const handleClose = () => {
    if (isGenerating) {
      return; // 생성 중에는 닫기 불가
    }
    resetGenerateForm();
    onClose();
  };

  const handleLanguageNext = () => {
    if (!generateFormData.language.trim()) {
      setLanguageError(true);
      return;
    }
    setLanguageError(false);
    setGenerateStep('description');
  };

  const handleDescriptionBack = () => {
    setDescriptionError(false);
    setGenerateStep('language');
  };

  const handleGenerate = async () => {
    if (!generateFormData.description.trim()) {
      setDescriptionError(true);
      return;
    }
    setDescriptionError(false);
    setGenerateStep('generating');
    setIsGenerating(true);

    try {
      const response = await generateMutation.mutateAsync({
        language: generateFormData.language.trim(),
        description: generateFormData.description.trim(),
        courses: [], // 빈 배열 (API 명세에 따름)
      });

      // API 응답을 React Flow 노드로 변환
      const reactFlowNodes = apiNodesToReactFlow(response.nodes);
      onSuccess(reactFlowNodes, response.roadmap.id);
      resetGenerateForm();
      onClose();
    } catch (_error) {
      // Error is handled by TanStack Query's mutation state
      setIsGenerating(false);
      setGenerateStep('description');
    }
  };

  const handleLanguageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLanguageNext();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <StyledOverlay onClick={handleClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              AI 로드맵 생성
            </Text>
            <StyledCloseButton
              onClick={handleClose}
              type="button"
              aria-label="닫기"
              disabled={isGenerating}
            >
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          {generateStep !== 'generating' && (
            <StyledStepIndicator>
              <StyledStep $active={generateStep === 'language'}>
                <Text
                  variant="B2"
                  color={
                    generateStep === 'language'
                      ? tokens.colors.primary[500]
                      : tokens.colors.neutral[400]
                  }
                >
                  1. 기술 스택
                </Text>
              </StyledStep>
              <StyledStepDivider />
              <StyledStep $active={generateStep === 'description'}>
                <Text
                  variant="B2"
                  color={
                    generateStep === 'description'
                      ? tokens.colors.primary[500]
                      : tokens.colors.neutral[400]
                  }
                >
                  2. 설명
                </Text>
              </StyledStep>
            </StyledStepIndicator>
          )}
        </StyledHeader>

        <StyledContent>
          {generateStep === 'language' && (
            <>
              <StyledInputSection>
                <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
                  로드맵에 포함할 언어 또는 기술 스택을 입력해주세요.
                </Text>
                <TextField
                  label="기술 스택"
                  placeholder="예: React, TypeScript, Node.js"
                  value={generateFormData.language}
                  onChange={(e) => updateGenerateFormData({ language: e.target.value })}
                  onKeyDown={handleLanguageKeyDown}
                  error={languageError}
                  helperText={languageError ? '기술 스택을 입력해주세요.' : undefined}
                  width="100%"
                />
              </StyledInputSection>
              <StyledActions>
                <Button variant="contained" size="medium" onClick={handleLanguageNext}>
                  다음
                </Button>
              </StyledActions>
            </>
          )}

          {generateStep === 'description' && (
            <>
              <StyledInputSection>
                <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
                  원하시는 로드맵에 대해 설명해주세요.
                </Text>
                <StyledTextareaWrapper>
                  <Text as="label" variant="B1" color={tokens.colors.neutral[500]}>
                    로드맵 설명
                  </Text>
                  <StyledTextarea
                    placeholder="예: 프론트엔드 개발자가 되기 위한 6개월 학습 로드맵"
                    value={generateFormData.description}
                    onChange={(e) => updateGenerateFormData({ description: e.target.value })}
                    onKeyDown={handleDescriptionKeyDown}
                    $hasError={descriptionError}
                  />
                  {descriptionError && (
                    <Text variant="B2" color={tokens.colors.error[200]}>
                      로드맵 설명을 입력해주세요.
                    </Text>
                  )}
                </StyledTextareaWrapper>
              </StyledInputSection>
              <StyledActions $hasMultiple>
                <Button variant="text" size="medium" onClick={handleDescriptionBack}>
                  이전
                </Button>
                <Button variant="contained" size="medium" onClick={handleGenerate}>
                  생성하기
                </Button>
              </StyledActions>
            </>
          )}

          {generateStep === 'generating' && (
            <StyledLoadingSection>
              <StyledSpinner />
              <Text variant="H3" color={tokens.colors.neutral[700]}>
                AI가 로드맵을 생성하고 있습니다...
              </Text>
              <Text variant="B1" color={tokens.colors.neutral[500]}>
                잠시만 기다려주세요. 이 작업은 최대 1분 정도 소요될 수 있습니다.
              </Text>
            </StyledLoadingSection>
          )}
        </StyledContent>
      </StyledModal>
    </StyledOverlay>
  );
};

// ============================================================================
// Styled Components
// ============================================================================

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
  width: 560px;
  max-width: 90vw;
  min-height: 400px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledHeader = styled.div`
  padding: 40px 40px 0 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

  &:hover:not(:disabled) {
    opacity: 0.7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const StyledStepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StyledStep = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${tokens.radius.small};
  background-color: ${({ $active }) => ($active ? tokens.colors.primary[100] : 'transparent')};
  transition: background-color 0.2s ease;
`;

const StyledStepDivider = styled.div`
  width: 24px;
  height: 1px;
  background-color: ${tokens.colors.neutral[300]};
`;

const StyledContent = styled.div`
  padding: 24px 40px 40px 40px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledInputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

const StyledTextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
  width: 100%;
  height: 120px;
  padding: ${tokens.spacing.medium};
  border: 1px solid ${({ $hasError }) =>
    $hasError ? tokens.colors.error[200] : tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.medium};
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) =>
      $hasError ? tokens.colors.error[200] : tokens.colors.primary[500]};
  }

  &::placeholder {
    color: ${tokens.colors.neutral[400]};
  }
`;

const StyledActions = styled.div<{ $hasMultiple?: boolean }>`
  display: flex;
  justify-content: ${({ $hasMultiple }) => ($hasMultiple ? 'space-between' : 'flex-end')};
  margin-top: auto;
  padding-top: 24px;
`;

const StyledLoadingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 1;
  min-height: 200px;
  text-align: center;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${tokens.colors.neutral[200]};
  border-top-color: ${tokens.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
