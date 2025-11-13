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

    onNext: handleNext,
    onPrevious: handlePrevious,

    isValid,
  };
};
