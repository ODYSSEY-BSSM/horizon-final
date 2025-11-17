'use client';

import styled from '@emotion/styled';
import type { NodeProps } from 'reactflow';
import { tokens } from '@/shared/tokens';
import { getNodeColor } from '../../constants/nodeColors';
import type { SectionNodeData } from '../../types/section.types';

/**
 * HorizonSection - 노드 그룹핑 컴포넌트
 * React Flow의 Parent Node로 사용되며, 여러 HorizonNode를 시각적으로 묶는 영역
 *
 * 사용 예시:
 * ```tsx
 * const nodes = [
 *   {
 *     id: 'section-1',
 *     type: 'horizonSection',
 *     data: { label: 'Introduction', color: 'blue' },
 *     position: { x: 0, y: 0 },
 *     style: { width: 600, height: 400 },
 *   },
 *   {
 *     id: 'node-1',
 *     type: 'horizonStandard',
 *     parentNode: 'section-1',
 *     position: { x: 50, y: 50 },
 *     data: { ... },
 *   },
 * ];
 * ```
 */
export const HorizonSection = ({ data, selected }: NodeProps<SectionNodeData>) => {
  const colorTheme = data.color ? getNodeColor(data.color) : null;
  const borderColor = colorTheme?.primary || '#6b7684';

  return (
    <StyledContainer $borderColor={borderColor} $selected={selected}>
      {data.label && <StyledLabel>{data.label}</StyledLabel>}
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ $borderColor: string; $selected?: boolean }>`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border: ${(props) => (props.$selected ? '4px' : '2px')} solid
    ${(props) => (props.$selected ? '#4a81f0' : props.$borderColor)};
  border-radius: ${tokens.radius.medium};
  padding: ${tokens.spacing.large};
  transition: border-width 0.2s ease, border-color 0.2s ease;

  /* 자식 노드를 위한 포지셔닝 컨텍스트 */
  position: relative;
`;

const StyledLabel = styled.h3`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[24]};
  color: #111827;
  margin: 0 0 ${tokens.spacing.medium} 0;
  position: absolute;
  top: ${tokens.spacing.medium};
  left: ${tokens.spacing.medium};
`;
