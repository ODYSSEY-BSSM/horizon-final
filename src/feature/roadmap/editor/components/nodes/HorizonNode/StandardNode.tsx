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
        <Icon name="school" size={24} color={colorTheme.primary} filled />
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
  align-items: flex-start;
`;

const StyledTextContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledNodeTitle = styled.h4`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.black};
  margin: 0;
`;

const StyledDescription = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[20]};
  color: ${tokens.colors.neutral[600]};
  margin: 0;
`;

const StyledProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
`;

const StyledProgressBarContainer = styled.div<{ $backgroundColor: string }>`
  flex: 1;
  height: 8px;
  background-color: ${(props) => props.$backgroundColor};
  border-radius: 4px;
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
  font-size: ${tokens.typos.fontSize[12]};
  font-weight: ${tokens.typos.fontWeight.medium};
  color: ${tokens.colors.black};
  min-width: 36px;
  text-align: right;
`;
