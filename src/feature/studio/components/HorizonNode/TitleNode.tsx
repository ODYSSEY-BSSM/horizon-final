'use client';

import styled from '@emotion/styled';
import { Handle, Position } from 'reactflow';
import { tokens } from '@/shared/tokens';
import { getNodeColor } from '../../constants/nodeColors';
import type { TitleNodeData } from '../../types/node.types';

interface TitleNodeProps {
  data: TitleNodeData;
}

export const TitleNode = ({ data }: TitleNodeProps) => {
  const colorTheme = getNodeColor(data.color);

  return (
    <Container $backgroundColor={colorTheme.primary}>
      {/* 4방향 핸들 */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />

      {/* 타이틀 텍스트 */}
      <Title>{data.label}</Title>
    </Container>
  );
};

const Container = styled.div<{ $backgroundColor: string }>`
  width: 240px;
  min-height: 56px;
  padding: ${tokens.spacing.md};
  background-color: ${(props) => props.$backgroundColor};
  border-radius: ${tokens.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${tokens.shadow.sm};
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Title = styled.h3`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: ${tokens.typos.lineHeight[28]};
  color: #ffffff;
  text-align: center;
  margin: 0;
`;
