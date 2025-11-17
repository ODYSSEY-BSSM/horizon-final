/**
 * React Flow 섹션 타입 상수
 */
export const HORIZON_SECTION_TYPE = 'horizonSection' as const;

/**
 * 섹션 기본 크기
 */
export const SECTION_DIMENSIONS = {
  DEFAULT: {
    width: 600,
    height: 400,
  },
  MIN: {
    width: 320,
    height: 260,
  },
} as const;
