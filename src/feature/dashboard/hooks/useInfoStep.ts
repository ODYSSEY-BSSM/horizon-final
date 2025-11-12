import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';

export const useInfoStep = () => {
  const { formData, updateField, nextStep, previousStep, isStepValid } = useRoadmapFormStore();

  const handleNext = () => {
    nextStep();
  };

  const handlePrevious = () => {
    previousStep();
  };

  const isValid = isStepValid();

  return {
    // Form data
    name: formData.name,
    description: formData.description,

    // Field update
    updateField,

    // Navigation
    onNext: handleNext,
    onPrevious: handlePrevious,

    // Validation
    isValid,
  };
};
