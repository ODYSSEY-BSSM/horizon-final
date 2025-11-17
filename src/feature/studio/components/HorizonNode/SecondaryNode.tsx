'use client';

import styled from '@emotion/styled';
import { Handle, Position } from 'reactflow';
import { tokens } from '@/shared/tokens';
import { getNodeColor } from '../../constants/nodeColors';
import type { SecondaryNodeData } from '../../types/node.types';

interface SecondaryNodeProps {
  data: SecondaryNodeData;
}

export const SecondaryNode = ({ data }: SecondaryNodeProps) => {
  const colorTheme = getNodeColor(data.color);

  return (
    <StyledContainer $borderColor={colorTheme.border}>
      {/* 4방향 핸들 */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />

      {/* 상단: 아이콘 + 타이틀 */}
      <StyledHeader>
        <StyledIcon $color={colorTheme.primary}>school</StyledIcon>
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
  width: 248px;
  background-color: #ffffff;
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

const StyledIcon = styled.span<{ $color: string }>`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 24px;
  color: ${(props) => props.$color};
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  flex-shrink: 0;
`;

const StyledNodeTitle = styled.h4`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[24]};
  color: #000000;
  margin: 0;
  flex: 1;
`;

const StyledQuizCount = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[22]};
  color: #666666;
  margin: 0;
  padding-left: 32px; /* icon width + gap */
`;
