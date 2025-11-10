import type { RoadmapFormStep } from '@/feature/roadmap/stores/roadmapFormFlow';

export const MODAL_SPACING = {
  // 모달 기본 패딩
  modal: {
    padding: '40px',
    width: '560px',
    minHeight: '366px',
  },

  // 헤더 간격
  header: {
    titleDescriptionGap: '8px',
    dividerMargin: '20px',
  },

  // 푸터 간격
  footer: {
    buttonGap: '20px',
  },

  // 각 스텝별 컨테이너 간격
  steps: {
    category: {
      button: {
        width: '234px',
        height: '80px',
        gap: '12px',
      },
    },
    info: {
      fieldGap: '20px',
    },
    style: {
      thumbnail: {
        width: '480px',
        height: '148px',
      },
      containerGap: '20px',
    },
    dropdown: {
      height: '48px',
      maxHeight: '240px',
    },
  },
} as const;

// 스텝별 모달 높이 (spacing.md 기준으로 계산)
export const STEP_HEIGHTS: Record<RoadmapFormStep, string> = {
  category: '366px', // 기본 최소 높이
  folder: '366px', // 드롭다운 기본 높이
  team: '366px', // 드롭다운 기본 높이
  info: '520px', // 텍스트필드 2개 + 간격
  style: '534px', // 썸네일 + 드롭다운 2개
};
