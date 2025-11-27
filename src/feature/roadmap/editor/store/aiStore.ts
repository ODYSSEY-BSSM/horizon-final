import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

/**
 * AI 로드맵 생성 단계
 */
export type AIGenerateStep = 'language' | 'description' | 'generating';

/**
 * AI 로드맵 생성 폼 데이터
 */
interface AIGenerateFormData {
  /** 포함할 언어/기술 */
  language: string;
  /** 로드맵 설명 */
  description: string;
}

/**
 * AI 스토어 상태
 */
interface AIStoreState {
  // ============================================================================
  // Generate Modal State
  // ============================================================================

  /** 생성 모달 열림 여부 */
  isGenerateModalOpen: boolean;
  /** 현재 생성 단계 */
  generateStep: AIGenerateStep;
  /** 생성 폼 데이터 */
  generateFormData: AIGenerateFormData;
  /** 생성 중 여부 */
  isGenerating: boolean;

  // ============================================================================
  // Modify Modal State
  // ============================================================================

  /** 수정 모달 열림 여부 */
  isModifyModalOpen: boolean;
  /** 수정 요청 설명 */
  modifyDescription: string;
  /** 수정 중 여부 */
  isModifying: boolean;

  // ============================================================================
  // Generate Modal Actions
  // ============================================================================

  /** 생성 모달 열기 */
  openGenerateModal: () => void;
  /** 생성 모달 닫기 (상태 초기화 포함) */
  closeGenerateModal: () => void;
  /** 생성 단계 설정 */
  setGenerateStep: (step: AIGenerateStep) => void;
  /** 생성 폼 데이터 업데이트 */
  updateGenerateFormData: (data: Partial<AIGenerateFormData>) => void;
  /** 생성 중 상태 설정 */
  setIsGenerating: (isGenerating: boolean) => void;
  /** 생성 폼 초기화 */
  resetGenerateForm: () => void;

  // ============================================================================
  // Modify Modal Actions
  // ============================================================================

  /** 수정 모달 열기 */
  openModifyModal: () => void;
  /** 수정 모달 닫기 (상태 초기화 포함) */
  closeModifyModal: () => void;
  /** 수정 요청 설명 설정 */
  setModifyDescription: (description: string) => void;
  /** 수정 중 상태 설정 */
  setIsModifying: (isModifying: boolean) => void;
  /** 수정 폼 초기화 */
  resetModifyForm: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialGenerateFormData: AIGenerateFormData = {
  language: '',
  description: '',
};

// ============================================================================
// Store Export
// ============================================================================

/**
 * AI 스토어
 * 개발 환경에서는 devtools 활성화
 */
export const useAIStore =
  process.env.NODE_ENV !== 'production'
    ? create<AIStoreState>()(
        devtools(
          (set) => ({
            // Initial state
            isGenerateModalOpen: false,
            generateStep: 'language',
            generateFormData: initialGenerateFormData,
            isGenerating: false,
            isModifyModalOpen: false,
            modifyDescription: '',
            isModifying: false,

            // Generate modal actions
            openGenerateModal: () =>
              set({
                isGenerateModalOpen: true,
                generateStep: 'language',
                generateFormData: initialGenerateFormData,
                isGenerating: false,
              }),

            closeGenerateModal: () =>
              set({
                isGenerateModalOpen: false,
                generateStep: 'language',
                generateFormData: initialGenerateFormData,
                isGenerating: false,
              }),

            setGenerateStep: (step) => set({ generateStep: step }),

            updateGenerateFormData: (data) =>
              set((state) => ({
                generateFormData: { ...state.generateFormData, ...data },
              })),

            setIsGenerating: (isGenerating) => set({ isGenerating }),

            resetGenerateForm: () =>
              set({
                generateStep: 'language',
                generateFormData: initialGenerateFormData,
                isGenerating: false,
              }),

            // Modify modal actions
            openModifyModal: () =>
              set({
                isModifyModalOpen: true,
                modifyDescription: '',
                isModifying: false,
              }),

            closeModifyModal: () =>
              set({
                isModifyModalOpen: false,
                modifyDescription: '',
                isModifying: false,
              }),

            setModifyDescription: (description) => set({ modifyDescription: description }),

            setIsModifying: (isModifying) => set({ isModifying }),

            resetModifyForm: () =>
              set({
                modifyDescription: '',
                isModifying: false,
              }),
          }),
          { name: 'ai-store' },
        ),
      )
    : create<AIStoreState>()((set) => ({
        // Initial state
        isGenerateModalOpen: false,
        generateStep: 'language',
        generateFormData: initialGenerateFormData,
        isGenerating: false,
        isModifyModalOpen: false,
        modifyDescription: '',
        isModifying: false,

        // Generate modal actions
        openGenerateModal: () =>
          set({
            isGenerateModalOpen: true,
            generateStep: 'language',
            generateFormData: initialGenerateFormData,
            isGenerating: false,
          }),

        closeGenerateModal: () =>
          set({
            isGenerateModalOpen: false,
            generateStep: 'language',
            generateFormData: initialGenerateFormData,
            isGenerating: false,
          }),

        setGenerateStep: (step) => set({ generateStep: step }),

        updateGenerateFormData: (data) =>
          set((state) => ({
            generateFormData: { ...state.generateFormData, ...data },
          })),

        setIsGenerating: (isGenerating) => set({ isGenerating }),

        resetGenerateForm: () =>
          set({
            generateStep: 'language',
            generateFormData: initialGenerateFormData,
            isGenerating: false,
          }),

        // Modify modal actions
        openModifyModal: () =>
          set({
            isModifyModalOpen: true,
            modifyDescription: '',
            isModifying: false,
          }),

        closeModifyModal: () =>
          set({
            isModifyModalOpen: false,
            modifyDescription: '',
            isModifying: false,
          }),

        setModifyDescription: (description) => set({ modifyDescription: description }),

        setIsModifying: (isModifying) => set({ isModifying }),

        resetModifyForm: () =>
          set({
            modifyDescription: '',
            isModifying: false,
          }),
      }));
