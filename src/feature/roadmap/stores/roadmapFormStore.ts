import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type RoadmapFormStep = 'category' | 'folder' | 'team' | 'info' | 'style';

export interface RoadmapFormData {
  category: 'personal' | 'team' | '';
  folderId?: string;
  folderName?: string;
  teamId?: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface RoadmapSubmitData {
  title: string;
  description: string;
  categories: string[];
  color: string;
  icon: string;
  category: 'personal' | 'team' | '';
  folderId?: string;
  folderName?: string;
  teamId?: string;
}

interface RoadmapFormState {
  isModalOpen: boolean;

  currentStep: RoadmapFormStep;

  formData: RoadmapFormData;

  errors: Partial<Record<RoadmapFormStep, string>>;

  isLoading: boolean;
  globalError: string | null;
}

interface RoadmapFormActions {
  openModal: () => void;
  closeModal: () => void;

  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: RoadmapFormStep) => void;

  updateField: <K extends keyof RoadmapFormData>(field: K, value: RoadmapFormData[K]) => void;
  updateFormData: (data: Partial<RoadmapFormData>) => void;

  isStepValid: () => boolean;
  validateCurrentStep: () => boolean;
  clearErrors: () => void;

  setIsLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;

  getSubmitData: () => Promise<RoadmapSubmitData>;

  reset: () => void;
}

type RoadmapFormStore = RoadmapFormState & RoadmapFormActions;

const STEP_FLOWS = {
  personal: ['category', 'folder', 'info', 'style'] as const,
  team: ['category', 'team', 'folder', 'info', 'style'] as const,
};

const initialFormData: RoadmapFormData = {
  category: '',
  folderId: undefined,
  folderName: undefined,
  teamId: undefined,
  name: '',
  description: '',
  color: 'red',
  icon: 'language',
};

const initialState: RoadmapFormState = {
  isModalOpen: false,
  currentStep: 'category',
  formData: initialFormData,
  errors: {},
  isLoading: false,
  globalError: null,
};

function getStepFlow(category: string): readonly RoadmapFormStep[] {
  return category === 'team' ? STEP_FLOWS.team : STEP_FLOWS.personal;
}

function getNextStep(currentStep: RoadmapFormStep, category: string): RoadmapFormStep | null {
  const flow = getStepFlow(category);
  const currentIndex = flow.indexOf(currentStep);
  return flow[currentIndex + 1] || null;
}

function getPreviousStep(currentStep: RoadmapFormStep, category: string): RoadmapFormStep | null {
  const flow = getStepFlow(category);
  const currentIndex = flow.indexOf(currentStep);
  return flow[currentIndex - 1] || null;
}

function validateStep(step: RoadmapFormStep, formData: RoadmapFormData): string | null {
  switch (step) {
    case 'category':
      if (!formData.category) {
        return '카테고리를 선택해주세요';
      }
      break;

    case 'folder':
      if (!formData.folderId && !formData.folderName) {
        return '폴더를 선택하거나 새 폴더 이름을 입력해주세요';
      }
      break;

    case 'team':
      if (!formData.teamId) {
        return '팀을 선택해주세요';
      }
      break;

    case 'info':
      if (!formData.name.trim()) {
        return '이름을 입력해주세요';
      }
      if (formData.name.length > 50) {
        return '이름은 50자 이내로 입력해주세요';
      }
      if (!formData.description.trim()) {
        return '설명을 입력해주세요';
      }
      if (formData.description.length > 200) {
        return '설명은 200자 이내로 입력해주세요';
      }
      break;

    case 'style':
      if (!formData.color) {
        return '색상을 선택해주세요';
      }
      if (!formData.icon) {
        return '아이콘을 선택해주세요';
      }
      break;
  }

  return null;
}

export const useRoadmapFormStore = create<RoadmapFormStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      openModal: () => set({ isModalOpen: true }, false, 'openModal'),

      closeModal: () =>
        set(
          {
            isModalOpen: false,
            currentStep: 'category',
            formData: initialFormData,
            errors: {},
          },
          false,
          'closeModal',
        ),

      nextStep: () => {
        const state = get() as RoadmapFormStore;

        if (!state.validateCurrentStep()) {
          return;
        }

        const next = getNextStep(state.currentStep, state.formData.category);
        if (next) {
          set({ currentStep: next, errors: {} }, false, 'nextStep');
        }
      },

      previousStep: () => {
        const state = get() as RoadmapFormStore;
        const prev = getPreviousStep(state.currentStep, state.formData.category);

        if (prev) {
          set({ currentStep: prev, errors: {} }, false, 'previousStep');
        }
      },

      goToStep: (step: RoadmapFormStep) => set({ currentStep: step }, false, 'goToStep'),

      updateField: <K extends keyof RoadmapFormData>(field: K, value: RoadmapFormData[K]) =>
        set(
          (state: RoadmapFormStore) => ({
            formData: { ...state.formData, [field]: value },
            errors: {},
          }),
          false,
          'updateField',
        ),

      updateFormData: (data: Partial<RoadmapFormData>) =>
        set(
          (state: RoadmapFormStore) => ({
            formData: { ...state.formData, ...data },
          }),
          false,
          'updateFormData',
        ),

      isStepValid: () => {
        const state = get() as RoadmapFormStore;
        const error = validateStep(state.currentStep, state.formData);
        return !error;
      },

      validateCurrentStep: () => {
        const state = get() as RoadmapFormStore;
        const error = validateStep(state.currentStep, state.formData);

        if (error) {
          set({ errors: { [state.currentStep]: error } }, false, 'validateCurrentStep');
          return false;
        }

        set({ errors: {} }, false, 'validateCurrentStep');
        return true;
      },

      clearErrors: () => set({ errors: {}, globalError: null }, false, 'clearErrors'),

      setIsLoading: (loading: boolean) => set({ isLoading: loading }, false, 'setIsLoading'),

      setGlobalError: (error: string | null) =>
        set({ globalError: error }, false, 'setGlobalError'),

      getSubmitData: async () => {
        const state = get() as RoadmapFormStore;
        const { formData } = state;

        try {
          set({ isLoading: true, globalError: null }, false, 'getSubmitData:start');

          // 폼 데이터 검증
          if (!formData.name.trim()) {
            throw new Error('이름을 입력해주세요');
          }
          if (!formData.color) {
            throw new Error('색상을 선택해주세요');
          }
          if (!formData.icon) {
            throw new Error('아이콘을 선택해주세요');
          }

          const submitData = {
            title: formData.name,
            description: formData.description || '',
            categories: [],
            color: formData.color.toUpperCase(),
            icon: formData.icon.toUpperCase(),
            category: formData.category,
            folderId: formData.folderId,
            folderName: formData.folderName,
            teamId: formData.teamId,
          };

          set({ isLoading: false }, false, 'getSubmitData:success');
          return submitData;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : '제출 데이터 생성에 실패했습니다';
          set({ globalError: errorMessage, isLoading: false }, false, 'getSubmitData:error');
          throw error;
        }
      },

      reset: () => set(initialState, false, 'reset'),
    }),
    {
      name: 'roadmap-form',
      enabled: process.env.NODE_ENV !== 'production',
    },
  ),
);
