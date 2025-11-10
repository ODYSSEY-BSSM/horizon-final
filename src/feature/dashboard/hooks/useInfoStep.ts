import { useInfoStepForm } from './useRoadmapForm';

export const useInfoStep = () => {
  const {
    control,
    onNext,
    onPrevious,
    formState: { isValid },
  } = useInfoStepForm();

  return {
    control,
    onNext,
    onPrevious,
    isValid,
  };
};
