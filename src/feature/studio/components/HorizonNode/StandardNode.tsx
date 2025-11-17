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
    <Container $borderColor={colorTheme.border}>
      {/* 4방향 핸들 */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />

      {/* 상단: 아이콘 + 텍스트 */}
      <Header>
        <Icon $color={colorTheme.primary}>school</Icon>
        <TextContent>
          <NodeTitle>{data.title}</NodeTitle>
          <Description>{data.description}</Description>
        </TextContent>
      </Header>

      {/* 하단: 진행률 바 */}
      <ProgressSection>
        <ProgressBarContainer $backgroundColor={colorTheme.progressBackground}>
          <ProgressBarFill $backgroundColor={colorTheme.progressBar} $progress={data.progress} />
        </ProgressBarContainer>
        <ProgressLabel>{data.progress}%</ProgressLabel>
      </ProgressSection>
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
  align-items: flex-start;
`;

const Icon = styled.span<{ $color: string }>`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 24px;
  color: ${(props) => props.$color};
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NodeTitle = styled.h4`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[24]};
  color: #000000;
  margin: 0;
`;

const Description = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[20]};
  color: #666666;
  margin: 0;
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
`;

const ProgressBarContainer = styled.div<{ $backgroundColor: string }>`
  flex: 1;
  height: 8px;
  background-color: ${(props) => props.$backgroundColor};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $backgroundColor: string; $progress: number }>`
  height: 100%;
  width: ${(props) => props.$progress}%;
  background-color: ${(props) => props.$backgroundColor};
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[12]};
  font-weight: ${tokens.typos.fontWeight.medium};
  color: #000000;
  min-width: 36px;
  text-align: right;
`;
