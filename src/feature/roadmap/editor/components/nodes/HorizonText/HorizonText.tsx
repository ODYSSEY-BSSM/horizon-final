'use client';

import styled from '@emotion/styled';
import type { NodeProps } from 'reactflow';
import type { TextNodeData } from '@/feature/roadmap/editor/types/text.types';
import { tokens } from '@/shared/tokens';

/**
 * HorizonText - 드래그 가능한 텍스트 노드 컴포넌트
 * React Flow의 커스텀 노드로 사용되며, title/paragraph 두 가지 타입 지원
 *
 * 사용 예시:
 * ```tsx
 * const nodes = [
 *   {
 *     id: 'text-1',
 *     type: 'horizonText',
 *     data: { text: 'Smooth Criminal', type: 'title' },
 *     position: { x: 100, y: 100 },
 *   },
 * ];
 * ```
 */
export const HorizonText = ({ data, selected }: NodeProps<TextNodeData>) => {
  if (data.type === 'title') {
    return (
      <StyledTitleContainer $selected={selected}>
        <StyledTitleText>{data.text}</StyledTitleText>
      </StyledTitleContainer>
    );
  }

  return (
    <StyledParagraphContainer $selected={selected}>
      <StyledParagraphText>{data.text}</StyledParagraphText>
    </StyledParagraphContainer>
  );
};

const StyledTitleContainer = styled.div<{ $selected?: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5px;
  border: ${(props) => (props.$selected ? `0.75px solid ${tokens.colors.primary[500]}` : '0.75px solid transparent')};
  box-sizing: border-box;
  transition: border-color 0.2s ease;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const StyledTitleText = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 7.5px;
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: 10.5px;
  color: ${tokens.colors.neutral[900]};
  letter-spacing: -0.075px;
  white-space: pre;
  margin: 0;
`;

const StyledParagraphContainer = styled.div<{ $selected?: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5px;
  border: ${(props) => (props.$selected ? `0.75px solid ${tokens.colors.primary[500]}` : '0.75px solid transparent')};
  box-sizing: border-box;
  transition: border-color 0.2s ease;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const StyledParagraphText = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 6px;
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: 9px;
  color: ${tokens.colors.neutral[600]};
  white-space: pre;
  margin: 0;
`;
