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
    <Container $borderColor={colorTheme.border}>
      {/* 4방향 핸들 */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />

      {/* 상단: 아이콘 + 타이틀 */}
      <Header>
        <Icon $color={colorTheme.primary}>school</Icon>
        <NodeTitle>{data.title}</NodeTitle>
      </Header>

      {/* 하단: 퀴즈 개수 */}
      <QuizCount>
        문제 {data.quizCurrent}/{data.quizTotal}
      </QuizCount>
    </Container>
  );
};

const Container = styled.div<{ $borderColor: string }>`
  width: 248px;
  background-color: #ffffff;
  border: 2px solid ${(props) => props.$borderColor};
  border-radius: ${tokens.radius.md};
  padding: ${tokens.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
  box-shadow: ${tokens.shadow.sm};
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Header = styled.div`
  display: flex;
  gap: ${tokens.spacing.sm};
  align-items: center;
`;

const Icon = styled.span<{ $color: string }>`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 24px;
  color: ${(props) => props.$color};
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  flex-shrink: 0;
`;

const NodeTitle = styled.h4`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[24]};
  color: #000000;
  margin: 0;
  flex: 1;
`;

const QuizCount = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[22]};
  color: #666666;
  margin: 0;
  padding-left: 32px; /* icon width + gap */
`;
