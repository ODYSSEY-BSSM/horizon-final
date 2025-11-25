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
    width: '2.5px',
    height: '2.5px',
    minWidth: '2.5px',
    minHeight: '2.5px',
    border: `0.3px solid ${tokens.colors.white}`,
    background: tokens.colors.black,
    opacity: 1,
  };

  const topHandleStyle = { ...handleStyle, top: '-1.25px' };
  const bottomHandleStyle = { ...handleStyle, bottom: '-1.25px' };
  const leftHandleStyle = { ...handleStyle, left: '-1.25px' };
  const rightHandleStyle = { ...handleStyle, right: '-1.25px' };

  return (
    <StyledContainer $backgroundColor={colorTheme.primary} $isSelected={selected}>
      {/* 4방향 핸들 */}
      <Handle type="target" position={Position.Top} id="top" style={topHandleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={rightHandleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={bottomHandleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={leftHandleStyle} />

      {/* 타이틀 텍스트 */}
      <StyledTitle $color={colorTheme.primary}>{data.label}</StyledTitle>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ $backgroundColor: string; $isSelected?: boolean }>`
  position: relative;
  z-index: 1;
  width: 93px;
  min-height: 24px;
  padding: 4.5px 15px;
  background-color: ${tokens.colors.white};
  border: 1.5px solid ${(props) => props.$backgroundColor};
  border-radius: ${tokens.radius.small};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(props) => (props.$isSelected ? tokens.shadow[2] : 'none')};
  cursor: grab;
  outline: ${(props) => (props.$isSelected ? `2px solid ${tokens.colors.primary}` : 'none')};
  outline-offset: 2px;
  transition: box-shadow 0.2s ease, outline 0.2s ease;

  &:active {
    cursor: grabbing;
  }
`;

const StyledTitle = styled.h3<{ $color: string }>`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 9px;
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: 12px;
  letter-spacing: -0.135px;
  color: ${(props) => props.$color};
  text-align: center;
  margin: 0;
  word-wrap: break-word;
  word-break: keep-all;
  overflow-wrap: break-word;
`;
