'use client';

import styled from '@emotion/styled';
import { Handle, Position } from 'reactflow';
import { tokens } from '@/shared/tokens';
import { getNodeColor } from '../../constants/nodeColors';
import type { StandardNodeData } from '../../types/node.types';

interface StandardNodeProps {
  data: StandardNodeData;
}

export const StandardNode = ({ data }: StandardNodeProps) => {
  const colorTheme = getNodeColor(data.color);

  return (
    <StyledContainer $borderColor={colorTheme.border}>
      {/* 4방향 핸들 */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />

      {/* 상단: 아이콘 + 텍스트 */}
      <StyledHeader>
        <StyledIcon $color={colorTheme.primary}>school</StyledIcon>
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
  align-items: flex-start;
`;

const StyledIcon = styled.span<{ $color: string }>`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 24px;
  color: ${(props) => props.$color};
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  flex-shrink: 0;
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
  color: #000000;
  margin: 0;
`;

const StyledDescription = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[20]};
  color: #666666;
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
  color: #000000;
  min-width: 36px;
  text-align: right;
`;
