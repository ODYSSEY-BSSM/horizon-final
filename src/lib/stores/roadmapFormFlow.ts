import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { RoadmapFormData } from '@/lib/types/modal';

export type RoadmapFormStep = 'category' | 'folder' | 'team' | 'info' | 'style';

interface RoadmapFormFlowState {
  currentStep: RoadmapFormStep;
  formData: Partial<RoadmapFormData>;
  isModalOpen: boolean;
}

interface RoadmapFormFlowActions {
  goToStep: (step: RoadmapFormStep) => void;
  saveStepData: (data: Partial<RoadmapFormData>) => void;
  openModal: () => void;
  closeModal: () => void;
  reset: () => void;
}

type RoadmapFormFlowStore = RoadmapFormFlowState & RoadmapFormFlowActions;

const initialState: RoadmapFormFlowState = {
  currentStep: 'category',
  formData: {
    category: '',
    name: '',
    description: '',
    color: 'red',
    icon: 'language',
  },
  isModalOpen: false,
};

export const useRoadmapFormFlow =
  process.env.NODE_ENV !== 'production'
    ? create<RoadmapFormFlowStore>()(
        devtools(
          (set) => ({
            ...initialState,

            goToStep: (step) => set({ currentStep: step }, false, 'goToStep'),

            saveStepData: (data) =>
              set(
                (state) => ({
                  formData: { ...state.formData, ...data },
                }),
                false,
                'saveStepData',
              ),

            openModal: () => set({ isModalOpen: true }, false, 'openModal'),

            closeModal: () =>
              set(
                {
                  isModalOpen: false,
                  currentStep: 'category',
                  formData: initialState.formData,
                },
                false,
                'closeModal',
              ),

            reset: () => set(initialState, false, 'reset'),
          }),
          { name: 'roadmap-form-flow' },
        ),
      )
    : create<RoadmapFormFlowStore>()((set) => ({
        ...initialState,

        goToStep: (step) => set({ currentStep: step }),

        saveStepData: (data) =>
          set((state) => ({
            formData: { ...state.formData, ...data },
          })),

        openModal: () => set({ isModalOpen: true }),

        closeModal: () =>
          set({
            isModalOpen: false,
            currentStep: 'category',
            formData: initialState.formData,
          }),

        reset: () => set(initialState),
      }));
