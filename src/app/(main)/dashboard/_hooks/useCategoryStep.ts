import { useCategoryStepForm } from './useRoadmapForm';

export const useCategoryStep = () => {
  const {
    watch,
    setValue,
    onNext,
    formState: { isValid },
  } = useCategoryStepForm();

  const category = watch('category');

  const handleCategorySelect = (selectedCategory: string) => {
    setValue('category', selectedCategory, { shouldValidate: true });
  };

  return {
    selectedCategory: category,
    handleCategorySelect,
    onNext,
    isValid,
  };
};
