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
    name: formData.name,
    description: formData.description,

    updateField,

    onNext: handleNext,
    onPrevious: handlePrevious,

    isValid,
  };
};
