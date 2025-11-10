'use client';

import {
  FORM_STEPS,
  STEP_DESCRIPTIONS,
  STEP_TITLES,
} from '@/feature/dashboard/constants/RoadmapFormModal.constants';
import { useRoadmapFormFlow } from '@/feature/roadmap/stores/roadmapFormFlow';
import { FormLayout } from './components/FormLayout';
import { CategoryStep } from './steps/CategoryStep';
import { FolderStep } from './steps/FolderStep';
import { InfoStep } from './steps/InfoStep';
import { StyleStep } from './steps/StyleStep';
import { TeamStep } from './steps/TeamStep';

const RoadmapFormModal = () => {
  const { currentStep, isModalOpen, closeModal } = useRoadmapFormFlow();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'category':
        return <CategoryStep />;
      case 'folder':
        return <FolderStep />;
      case 'team':
        return <TeamStep />;
      case 'info':
        return <InfoStep />;
      case 'style':
        return <StyleStep />;
      default:
        return null;
    }
  };

  const stepNumber =
    Object.values(FORM_STEPS).find(
      (stepNum) => Object.keys(FORM_STEPS)[stepNum - 1].toLowerCase() === currentStep,
    ) || FORM_STEPS.CATEGORY;

  type StepNumber = (typeof FORM_STEPS)[keyof typeof FORM_STEPS];
  const validStepNumber = stepNumber as StepNumber;

  const title = STEP_TITLES[validStepNumber];
  const description = STEP_DESCRIPTIONS[validStepNumber];

  if (!isModalOpen) {
    return null;
  }

  return (
    <FormLayout
      title={title}
      description={description}
      currentStep={currentStep}
      onClose={closeModal}
    >
      {renderCurrentStep()}
    </FormLayout>
  );
};

export default RoadmapFormModal;
