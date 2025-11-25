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
  const isSchoolNode = data.isSchoolNode ?? false;

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
    <StyledContainer $borderColor={colorTheme.border} $isSelected={selected}>
      {/* 4방향 핸들 */}
      <Handle type="target" position={Position.Top} id="top" style={topHandleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={rightHandleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={bottomHandleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={leftHandleStyle} />

      {/* 상단: 아이콘 + 타이틀 */}
      <StyledHeader>
        {isSchoolNode && <Icon name="school" size={9} color={colorTheme.primary} filled />}
        <StyledNodeTitle>{data.title}</StyledNodeTitle>
      </StyledHeader>

      {/* 하단: 퀴즈 개수 */}
      <StyledQuizCount $hasIcon={isSchoolNode}>
        문제 {data.quizCurrent}/{data.quizTotal}
      </StyledQuizCount>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ $borderColor: string; $isSelected?: boolean }>`
  position: relative;
  z-index: 1;
  width: 93px;
  background-color: ${tokens.colors.white};
  border: 1.5px solid ${(props) => props.$borderColor};
  border-radius: ${tokens.radius.small};
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  box-shadow: ${(props) => (props.$isSelected ? tokens.shadow[2] : tokens.shadow[0])};
  cursor: grab;
  outline: ${(props) => (props.$isSelected ? `2px solid ${tokens.colors.primary}` : 'none')};
  outline-offset: 2px;
  transition: box-shadow 0.2s ease, outline 0.2s ease;

  &:active {
    cursor: grabbing;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
`;

const StyledNodeTitle = styled.h4`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 6.75px;
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: 9px;
  color: ${tokens.colors.black};
  margin: 0;
  flex: 1;
`;

const StyledQuizCount = styled.p<{ $hasIcon?: boolean }>`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 6px;
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: 8.25px;
  color: ${tokens.colors.neutral[600]};
  margin: 0;
  padding-left: ${(props) => (props.$hasIcon ? '12px' : '0')}; /* icon width + gap */
`;
