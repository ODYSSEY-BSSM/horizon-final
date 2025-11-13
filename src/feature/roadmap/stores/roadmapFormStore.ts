import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ===================================
// Types
// ===================================

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
  // Modal state
  isModalOpen: boolean;

  // Navigation state
  currentStep: RoadmapFormStep;

  // Form data
  formData: RoadmapFormData;

  // Validation state
  errors: Partial<Record<RoadmapFormStep, string>>;
}

interface RoadmapFormActions {
  // Modal actions
  openModal: () => void;
  closeModal: () => void;

  // Navigation actions
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: RoadmapFormStep) => void;

  // Data actions
  updateField: <K extends keyof RoadmapFormData>(field: K, value: RoadmapFormData[K]) => void;
  updateFormData: (data: Partial<RoadmapFormData>) => void;

  // Validation actions
  isStepValid: () => boolean; // Pure function - no side effects
  validateCurrentStep: () => boolean; // Sets errors - use only on submit
  clearErrors: () => void;

  // Submission actions (will be called with mutations from component)
  getSubmitData: () => Promise<RoadmapSubmitData>;

  // Reset
  reset: () => void;
}

type RoadmapFormStore = RoadmapFormState & RoadmapFormActions;

// ===================================
// Constants
// ===================================

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
};

// ===================================
// Helper Functions
// ===================================

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

// ===================================
// Validation Functions
// ===================================

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

// ===================================
// Store Implementation
// ===================================

const createStore: StateCreator<RoadmapFormStore> = (set, get) => ({
  ...initialState,

  // Modal actions
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

  // Navigation actions
  nextStep: () => {
    const state = get() as RoadmapFormStore;

    // Validate current step
    if (!state.validateCurrentStep()) {
      return;
    }

    // Get next step based on category
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

  // Data actions
  updateField: <K extends keyof RoadmapFormData>(field: K, value: RoadmapFormData[K]) =>
    set(
      (state: RoadmapFormStore) => ({
        formData: { ...state.formData, [field]: value },
        errors: {}, // Clear errors on field update
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

  // Validation actions
  // Pure function - safe to call during render
  isStepValid: () => {
    const state = get() as RoadmapFormStore;
    const error = validateStep(state.currentStep, state.formData);
    return !error;
  },

  // Sets errors - only use on form submit
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

  clearErrors: () => set({ errors: {} }, false, 'clearErrors'),

  // Submission data preparation
  getSubmitData: async () => {
    const state = get() as RoadmapFormStore;
    const { formData } = state;

    return {
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
  },

  // Reset
  reset: () => set(initialState, false, 'reset'),
});

// ===================================
// Store Export
// ===================================

export const useRoadmapFormStore =
  process.env.NODE_ENV !== 'production'
    ? create<RoadmapFormStore>()(devtools(createStore(), { name: 'roadmap-form' }))
    : create<RoadmapFormStore>()(createStore());
