'use client';

import styled from '@emotion/styled';
import type { NodeProps } from 'reactflow';
import { tokens } from '@/shared/tokens';
import type { TextNodeData } from '../../types/text.types';

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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: ${(props) => (props.$selected ? '2px solid #4a81f0' : '2px solid transparent')};
  box-sizing: border-box;
  transition: border-color 0.2s ease;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const StyledTitleText = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[20]};
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: ${tokens.typos.lineHeight[28]};
  color: #111827;
  letter-spacing: -0.2px;
  white-space: pre;
  margin: 0;
`;

const StyledParagraphContainer = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: ${(props) => (props.$selected ? '2px solid #4a81f0' : '2px solid transparent')};
  box-sizing: border-box;
  transition: border-color 0.2s ease;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const StyledParagraphText = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: #4b5563;
  white-space: pre;
  margin: 0;
`;
