'use client';

import styled from '@emotion/styled';
import { Handle, Position } from 'reactflow';
import { getNodeColor } from '@/feature/roadmap/editor/constants/nodeColors';
import type { SecondaryNodeData } from '@/feature/roadmap/editor/types/node.types';
import { tokens } from '@/shared/tokens';
import { Icon } from '@/shared/ui';

interface SecondaryNodeProps {
  data: SecondaryNodeData;
  selected?: boolean;
}

export const SecondaryNode = ({ data, selected }: SecondaryNodeProps) => {
  const colorTheme = getNodeColor(data.color);

  const handleStyle = {
    opacity: selected ? 1 : 0,
  };

  return (
    <StyledContainer $borderColor={colorTheme.border}>
      {/* 4방향 핸들 */}
      <Handle type="target" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={handleStyle} />

      {/* 상단: 아이콘 + 타이틀 */}
      <StyledHeader>
        <Icon name="school" size={24} color={colorTheme.primary} filled />
        <StyledNodeTitle>{data.title}</StyledNodeTitle>
      </StyledHeader>

      {/* 하단: 퀴즈 개수 */}
      <StyledQuizCount>
        문제 {data.quizCurrent}/{data.quizTotal}
      </StyledQuizCount>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ $borderColor: string }>`
  position: relative;
  z-index: 1;
  width: 248px;
  background-color: ${tokens.colors.white};
  border: 2px solid ${(props) => props.$borderColor};
  border-radius: ${tokens.radius.medium};
  padding: ${tokens.spacing.medium};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  box-shadow: ${tokens.shadow[0]};
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  gap: ${tokens.spacing.small};
  align-items: center;
`;

const StyledNodeTitle = styled.h4`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.black};
  margin: 0;
  flex: 1;
`;

const StyledQuizCount = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[22]};
  color: ${tokens.colors.neutral[600]};
  margin: 0;
  padding-left: 32px; /* icon width + gap */
`;
