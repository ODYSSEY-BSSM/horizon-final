'use client';

import styled from '@emotion/styled';
import { Handle, Position } from 'reactflow';
import { getNodeColor } from '@/feature/roadmap/editor/constants/nodeColors';
import type { StandardNodeData } from '@/feature/roadmap/editor/types/node.types';
import { tokens } from '@/shared/tokens';
import { Icon } from '@/shared/ui';

interface StandardNodeProps {
  data: StandardNodeData;
  selected?: boolean;
}

export const StandardNode = ({ data, selected }: StandardNodeProps) => {
  const colorTheme = getNodeColor(data.color);
  const isSchoolNode = data.isSchoolNode ?? false;

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

      {/* 상단: 아이콘 + 텍스트 */}
      <StyledHeader>
        {isSchoolNode && <Icon name="school" size={9} color={colorTheme.primary} filled />}
        <StyledTextContent>
          <StyledNodeTitle>{data.title}</StyledNodeTitle>
          <StyledDescription>{data.description}</StyledDescription>
        </StyledTextContent>
      </StyledHeader>

      {/* 하단: 진행률 바 */}
      <StyledProgressSection>
        <StyledProgressBarContainer $backgroundColor={colorTheme.progressBackground}>
          <StyledProgressBarFill
            $backgroundColor={colorTheme.progressBar}
            $progress={data.progress}
          />
        </StyledProgressBarContainer>
        <StyledProgressLabel>{data.progress}%</StyledProgressLabel>
      </StyledProgressSection>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ $borderColor: string }>`
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
  box-shadow: ${tokens.shadow[0]};
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  gap: 3px;
  align-items: flex-start;
`;

const StyledTextContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5px;
`;

const StyledNodeTitle = styled.h4`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 6.75px;
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: 9px;
  color: ${tokens.colors.black};
  margin: 0;
`;

const StyledDescription = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 5.25px;
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: 7.5px;
  color: ${tokens.colors.neutral[600]};
  margin: 0;
`;

const StyledProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5px;
`;

const StyledProgressBarContainer = styled.div<{ $backgroundColor: string }>`
  flex: 1;
  height: 3px;
  background-color: ${(props) => props.$backgroundColor};
  border-radius: 1.5px;
  overflow: hidden;
`;

const StyledProgressBarFill = styled.div<{ $backgroundColor: string; $progress: number }>`
  height: 100%;
  width: ${(props) => props.$progress}%;
  background-color: ${(props) => props.$backgroundColor};
  transition: width 0.3s ease;
`;

const StyledProgressLabel = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 4.5px;
  font-weight: ${tokens.typos.fontWeight.medium};
  color: ${tokens.colors.black};
  min-width: 13.5px;
  text-align: right;
`;
