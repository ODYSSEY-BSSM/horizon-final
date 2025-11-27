'use client';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import { tokens } from '@/shared/tokens';
import { Button, Icon, Text } from '@/shared/ui';
import { useModifyAINodes } from '../../../api/aiApi';
import { useAIStore } from '../../../store/aiStore';
import type { AINodeInput } from '../../../types/ai.types';
import type { HorizonNodeData } from '../../../types/node.types';
import { calculateAbsolutePosition, mapTypeToApi } from '../../../utils/nodeConverter';
import type { AINodeModifyModalProps } from './AINodeModifyModal.types';

export const AINodeModifyModal = ({
  roadmapId,
  selectedNodeId,
  nodes,
  onClose,
  onSuccess,
}: AINodeModifyModalProps) => {
  // Store state
  const { modifyDescription, isModifying, setModifyDescription, setIsModifying, resetModifyForm } =
    useAIStore();

  // Local state for validation
  const [descriptionError, setDescriptionError] = useState(false);

  // API mutation
  const modifyMutation = useModifyAINodes(roadmapId);

  // 선택된 노드 찾기
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  );

  // 선택된 노드가 없으면 null 반환
  if (!selectedNode || !selectedNodeId) {
    return null;
  }

  const nodeData = selectedNode.data as HorizonNodeData;
  const nodeTitle = nodeData.type === 'title' ? nodeData.label : nodeData.title;

  // Handlers
  const handleClose = () => {
    if (isModifying) {
      return; // 수정 중에는 닫기 불가
    }
    resetModifyForm();
    onClose();
  };

  const handleModify = async () => {
    if (!modifyDescription.trim()) {
      setDescriptionError(true);
      return;
    }
    setDescriptionError(false);
    setIsModifying(true);

    try {
      // 절대 좌표 계산
      const absolutePos = calculateAbsolutePosition(selectedNode, nodes);

      // API 요청 데이터 구성
      const nodeInput: AINodeInput = {
        id: Number.parseInt(selectedNodeId, 10),
        title: nodeTitle,
        description: nodeData.type === 'standard' ? nodeData.description || '' : '',
        type: mapTypeToApi(nodeData.type),
        x: Math.round(absolutePos.x),
        y: Math.round(absolutePos.y),
        parentNodeId: selectedNode.parentNode
          ? Number.parseInt(selectedNode.parentNode, 10)
          : undefined,
        isEducation: false, // 기본값
      };

      const response = await modifyMutation.mutateAsync({
        description: modifyDescription.trim(),
        nodes: [nodeInput],
      });

      onSuccess(response);
      resetModifyForm();
      onClose();
    } catch (_error) {
      // Error is handled by TanStack Query's mutation state
      setIsModifying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleModify();
    }
  };

  return (
    <StyledOverlay onClick={handleClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              AI 노드 수정
            </Text>
            <StyledCloseButton
              onClick={handleClose}
              type="button"
              aria-label="닫기"
              disabled={isModifying}
            >
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
            선택한 노드를 AI가 수정합니다.
          </Text>
        </StyledHeader>

        <StyledContent>
          {isModifying ? (
            <StyledLoadingSection>
              <StyledSpinner />
              <Text variant="H3" color={tokens.colors.neutral[700]}>
                AI가 노드를 수정하고 있습니다...
              </Text>
              <Text variant="B1" color={tokens.colors.neutral[500]}>
                잠시만 기다려주세요.
              </Text>
            </StyledLoadingSection>
          ) : (
            <>
              <StyledSelectedNode>
                <Text variant="B2" color={tokens.colors.neutral[500]}>
                  선택된 노드
                </Text>
                <StyledNodeBadge>
                  <StyledNodeDot $color={nodeData.color} />
                  <Text variant="B1" color={tokens.colors.neutral[800]}>
                    {nodeTitle}
                  </Text>
                </StyledNodeBadge>
              </StyledSelectedNode>

              <StyledInputSection>
                <StyledTextareaWrapper>
                  <Text as="label" variant="B1" color={tokens.colors.neutral[500]}>
                    수정 요청사항
                  </Text>
                  <StyledTextarea
                    placeholder="예: 이 노드에 더 상세한 학습 내용을 추가해주세요"
                    value={modifyDescription}
                    onChange={(e) => setModifyDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    $hasError={descriptionError}
                    autoFocus
                  />
                  {descriptionError && (
                    <Text variant="B2" color={tokens.colors.error[200]}>
                      수정 요청사항을 입력해주세요.
                    </Text>
                  )}
                </StyledTextareaWrapper>
              </StyledInputSection>

              <StyledActions>
                <Button variant="contained" size="medium" onClick={handleModify}>
                  수정하기
                </Button>
              </StyledActions>
            </>
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
  min-height: 380px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledHeader = styled.div`
  padding: 40px 40px 0 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const StyledContent = styled.div`
  padding: 24px 40px 40px 40px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledSelectedNode = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const StyledNodeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.small};
  width: fit-content;
`;

const colorMap: Record<string, string> = {
  red: tokens.colors.roadmap.red[200],
  orange: tokens.colors.roadmap.orange[200],
  yellow: tokens.colors.roadmap.yellow[200],
  green: tokens.colors.roadmap.green[200],
  blue: tokens.colors.roadmap.blue[200],
  purple: tokens.colors.roadmap.purple[200],
};

const StyledNodeDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $color }) => colorMap[$color] || tokens.colors.primary[500]};
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
  height: 100px;
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

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
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
