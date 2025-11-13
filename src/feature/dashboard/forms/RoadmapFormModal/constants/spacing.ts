import type { RoadmapFormStep } from '@/feature/roadmap/stores/roadmapFormStore';

export const MODAL_SPACING = {
  modal: {
    padding: '40px',
    width: '560px',
    minHeight: '366px',
  },

  header: {
    titleDescriptionGap: '8px',
    dividerMargin: '20px',
  },

  footer: {
    buttonGap: '20px',
  },

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

export const STEP_HEIGHTS: Record<RoadmapFormStep, string> = {
  category: '366px',
  folder: '366px',
  team: '366px',
  info: '520px',
  style: '534px',
};
