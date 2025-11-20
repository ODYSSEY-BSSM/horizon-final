'use client';

import styled from '@emotion/styled';
import { Handle, Position } from 'reactflow';
import { getNodeColor } from '@/feature/roadmap/editor/constants/nodeColors';
import type { TitleNodeData } from '@/feature/roadmap/editor/types/node.types';
import { tokens } from '@/shared/tokens';

interface TitleNodeProps {
  data: TitleNodeData;
  selected?: boolean;
}

export const TitleNode = ({ data, selected }: TitleNodeProps) => {
  const colorTheme = getNodeColor(data.color);

  const handleStyle = {
    opacity: selected ? 1 : 0,
  };

  return (
    <StyledContainer $backgroundColor={colorTheme.primary}>
      {/* 4방향 핸들 */}
      <Handle type="target" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={handleStyle} />

      {/* 타이틀 텍스트 */}
      <StyledTitle $color={colorTheme.primary}>{data.label}</StyledTitle>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ $backgroundColor: string }>`
  position: relative;
  z-index: 1;
  width: 248px;
  min-height: 62px;
  padding: 12px 40px;
  background-color: ${tokens.colors.white};
  border: 4px solid ${(props) => props.$backgroundColor};
  border-radius: ${tokens.radius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const StyledTitle = styled.h3<{ $color: string }>`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 24px;
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: 34px;
  letter-spacing: -0.36px;
  color: ${(props) => props.$color};
  text-align: center;
  margin: 0;
  word-wrap: break-word;
  word-break: keep-all;
  overflow-wrap: break-word;
`;
