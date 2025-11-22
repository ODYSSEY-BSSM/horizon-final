'use client';

import styled from '@emotion/styled';
import type { NodeProps } from 'reactflow';
import { NodeResizer } from 'reactflow';
import { getNodeColor } from '@/feature/roadmap/editor/constants/nodeColors';
import type { SectionNodeData } from '@/feature/roadmap/editor/types/section.types';
import { tokens } from '@/shared/tokens';

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
  const borderColor = colorTheme?.primary || tokens.colors.neutral[500];

  return (
    <>
      {/* 크기 조절 핸들 - 선택 시에만 표시 */}
      <NodeResizer
        isVisible={selected}
        minWidth={75}
        minHeight={37.5}
        color={tokens.colors.primary[500]}
        lineStyle={{ borderWidth: 0.75 }}
        handleStyle={{
          width: 4.5,
          height: 4.5,
          borderRadius: '50%',
          backgroundColor: tokens.colors.primary[500],
          border: `0.75px solid ${tokens.colors.white}`,
        }}
      />
      <StyledContainer $borderColor={borderColor} $selected={selected}>
        {data.label && <StyledLabel>{data.label}</StyledLabel>}
      </StyledContainer>
    </>
  );
};

const StyledContainer = styled.div<{ $borderColor: string; $selected?: boolean }>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: ${tokens.colors.white};
  border: ${(props) => (props.$selected ? '1.5px' : '0.75px')} solid
    ${(props) => (props.$selected ? tokens.colors.primary[500] : props.$borderColor)};
  border-radius: ${tokens.radius.small};
  padding: 9px;
  transition: border-width 0.2s ease, border-color 0.2s ease;

  /* 자식 노드를 위한 포지셔닝 컨텍스트 */
  position: relative;
  z-index: 0 !important; /* 선택되어도 항상 배경 레이어 유지 */
`;

const StyledLabel = styled.h3`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 6.75px;
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: 9px;
  color: ${tokens.colors.neutral[900]};
  margin: 0 0 6px 0;
  position: absolute;
  top: 6px;
  left: 6px;
`;
