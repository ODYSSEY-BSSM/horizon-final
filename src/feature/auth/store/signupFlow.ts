import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SignUpData, SignUpStep } from '../types/signup';

interface SignupFlowState {
  currentStep: SignUpStep;
  completedData: Partial<SignUpData>;
}

interface SignupFlowActions {
  goToStep: (step: SignUpStep) => void;
  saveStepData: (data: Partial<SignUpData>) => void;
  reset: () => void;
}

type SignupFlowStore = SignupFlowState & SignupFlowActions;

const initialState: SignupFlowState = {
  currentStep: 'email',
  completedData: {},
};

export const useSignupFlow =
  process.env.NODE_ENV !== 'production'
    ? create<SignupFlowStore>()(
        devtools(
          (set) => ({
            ...initialState,

            goToStep: (step) => set({ currentStep: step }, false, 'goToStep'),

            saveStepData: (data) =>
              set(
                (state) => ({
                  completedData: { ...state.completedData, ...data },
                }),
                false,
                'saveStepData',
              ),

            reset: () => set(initialState, false, 'reset'),
          }),
          { name: 'signup-flow' },
        ),
      )
    : create<SignupFlowStore>()((set) => ({
        ...initialState,

        goToStep: (step) => set({ currentStep: step }),

        saveStepData: (data) =>
          set((state) => ({
            completedData: { ...state.completedData, ...data },
          })),

        reset: () => set(initialState),
      }));
