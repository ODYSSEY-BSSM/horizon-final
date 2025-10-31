'use client';

import { useRoadmapFormFlow } from '@/lib/stores/roadmapFormFlow';
import {
  FORM_STEPS,
  STEP_DESCRIPTIONS,
  STEP_TITLES,
} from '../../_constants/RoadmapFormModal.constants';
import FormLayout from './_components/FormLayout';
import { STEP_HEIGHTS } from './_constants/spacing';
import CategoryStep from './steps/CategoryStep';
import FolderStep from './steps/FolderStep';
import InfoStep from './steps/InfoStep';
import StyleStep from './steps/StyleStep';
import TeamStep from './steps/TeamStep';

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

  const title = STEP_TITLES[stepNumber as keyof typeof STEP_TITLES];
  const description = STEP_DESCRIPTIONS[stepNumber as keyof typeof STEP_DESCRIPTIONS];

  const currentStepKey = currentStep as keyof typeof STEP_HEIGHTS;

  if (!isModalOpen) {
    return null;
  }

  return (
    <FormLayout
      title={title}
      description={description}
      currentStep={currentStepKey}
      onClose={closeModal}
    >
      {renderCurrentStep()}
    </FormLayout>
  );
};

export default RoadmapFormModal;
