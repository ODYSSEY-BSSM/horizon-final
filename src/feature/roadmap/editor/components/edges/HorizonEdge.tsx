'use client';

import { type EdgeProps, getBezierPath } from 'reactflow';
import { tokens } from '@/shared/tokens';

/**
 * HorizonEdge - 커스텀 연결선 컴포넌트
 * Bezier curve를 사용한 부드러운 연결선
 */
export const HorizonEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* 메인 경로 */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        stroke={tokens.colors.neutral[900]}
        strokeWidth={2}
        fill="none"
        style={style}
        markerEnd={markerEnd}
      />
      {/* 호버 영역 (클릭 가능한 영역 확대) */}
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        className="react-flow__edge-interaction"
      />
    </>
  );
};
