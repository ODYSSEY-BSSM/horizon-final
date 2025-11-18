'use client';

import styled from '@emotion/styled';
import { Handle, Position } from 'reactflow';
import { getNodeColor } from '@/feature/roadmap/editor/constants/nodeColors';
import type { TitleNodeData } from '@/feature/roadmap/editor/types/node.types';
import { tokens } from '@/shared/tokens';

interface TitleNodeProps {
  data: TitleNodeData;
}

export const TitleNode = ({ data }: TitleNodeProps) => {
  const colorTheme = getNodeColor(data.color);

  return (
    <StyledContainer $backgroundColor={colorTheme.primary}>
      {/* 4방향 핸들 */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />

      {/* 타이틀 텍스트 */}
      <StyledTitle $color={colorTheme.primary}>{data.label}</StyledTitle>

      {/* 하단 중앙 핸들 포인트 */}
      <StyledHandlePoint />
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ $backgroundColor: string }>`
  position: relative;
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

const StyledHandlePoint = styled.div`
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${tokens.colors.neutral[600]};
  border: 2px solid ${tokens.colors.white};
`;
