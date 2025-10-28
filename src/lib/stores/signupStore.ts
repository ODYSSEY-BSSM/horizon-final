import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SignUpData, SignUpStep } from '@/lib/types';

interface SignUpState {
  // Step management
  currentStep: SignUpStep;

  // Form data
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  username: string;

  // UI state
  isLoading: boolean;
  errors: Record<string, string>;

  // Consolidated signup data
  signUpData: Partial<SignUpData>;
}

interface SignUpActions {
  // Step navigation
  setCurrentStep: (step: SignUpStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Field updates with automatic error clearing
  setEmail: (email: string) => void;
  setVerificationCode: (code: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setUsername: (username: string) => void;

  // Error management
  setErrors: (errors: Record<string, string>) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;

  // Loading state
  setIsLoading: (loading: boolean) => void;

  // Data management
  updateSignUpData: (data: Partial<SignUpData>) => void;
  resetForm: () => void;
}

type SignUpStore = SignUpState & SignUpActions;

const initialState: SignUpState = {
  currentStep: 'email',
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
  username: '',
  isLoading: false,
  errors: {},
  signUpData: {},
};

const stepOrder: SignUpStep[] = ['email', 'verification', 'password', 'username'];

export const useSignUpStore = create<SignUpStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Step navigation
      setCurrentStep: (step) => set({ currentStep: step }, false, 'setCurrentStep'),

      goToNextStep: () => {
        const { currentStep } = get();
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
          set({ currentStep: stepOrder[currentIndex + 1] }, false, 'goToNextStep');
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get();
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
          set({ currentStep: stepOrder[currentIndex - 1] }, false, 'goToPreviousStep');
        }
      },

      // Field updates with automatic error clearing
      setEmail: (email) =>
        set(
          (state) => ({
            email,
            errors: { ...state.errors, email: '' },
          }),
          false,
          'setEmail',
        ),

      setVerificationCode: (verificationCode) =>
        set(
          (state) => ({
            verificationCode,
            errors: { ...state.errors, code: '' },
          }),
          false,
          'setVerificationCode',
        ),

      setPassword: (password) =>
        set(
          (state) => ({
            password,
            errors: { ...state.errors, password: '' },
          }),
          false,
          'setPassword',
        ),

      setConfirmPassword: (confirmPassword) =>
        set(
          (state) => ({
            confirmPassword,
            errors: { ...state.errors, confirmPassword: '' },
          }),
          false,
          'setConfirmPassword',
        ),

      setUsername: (username) =>
        set(
          (state) => ({
            username,
            errors: { ...state.errors, username: '' },
          }),
          false,
          'setUsername',
        ),

      // Error management
      setErrors: (errors) => set({ errors }, false, 'setErrors'),

      clearError: (field) =>
        set(
          (state) => ({
            errors: { ...state.errors, [field]: '' },
          }),
          false,
          'clearError',
        ),

      clearAllErrors: () => set({ errors: {} }, false, 'clearAllErrors'),

      // Loading state
      setIsLoading: (isLoading) => set({ isLoading }, false, 'setIsLoading'),

      // Data management
      updateSignUpData: (data) =>
        set(
          (state) => ({
            signUpData: { ...state.signUpData, ...data },
          }),
          false,
          'updateSignUpData',
        ),

      resetForm: () => set(initialState, false, 'resetForm'),
    }),
    {
      name: 'signup-store',
    },
  ),
);

// Selectors for better performance
export const useSignUpCurrentStep = () => useSignUpStore((state) => state.currentStep);
export const useSignUpFormData = () =>
  useSignUpStore((state) => ({
    email: state.email,
    verificationCode: state.verificationCode,
    password: state.password,
    confirmPassword: state.confirmPassword,
    username: state.username,
  }));
export const useSignUpUIState = () =>
  useSignUpStore((state) => ({
    isLoading: state.isLoading,
    errors: state.errors,
  }));
export const useSignUpActions = () =>
  useSignUpStore((state) => ({
    setCurrentStep: state.setCurrentStep,
    goToNextStep: state.goToNextStep,
    goToPreviousStep: state.goToPreviousStep,
    setEmail: state.setEmail,
    setVerificationCode: state.setVerificationCode,
    setPassword: state.setPassword,
    setConfirmPassword: state.setConfirmPassword,
    setUsername: state.setUsername,
    setErrors: state.setErrors,
    clearError: state.clearError,
    clearAllErrors: state.clearAllErrors,
    setIsLoading: state.setIsLoading,
    updateSignUpData: state.updateSignUpData,
    resetForm: state.resetForm,
  }));
