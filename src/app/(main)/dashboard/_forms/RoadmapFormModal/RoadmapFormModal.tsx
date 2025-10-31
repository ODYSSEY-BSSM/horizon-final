'use client';

import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import type { RoadmapFormData } from '@/lib/types/modal';
import { tokens } from '@/shared/tokens';
import {
  FORM_STEPS,
  STEP_DESCRIPTIONS,
  STEP_TITLES,
  TOTAL_STEPS,
} from '../../_constants/RoadmapFormModal.constants';
import {
  StyledCloseButton,
  StyledDivider,
  StyledFormContent,
  StyledFormFooter,
  StyledFormHeader,
  StyledHeaderTop,
  StyledModalBackdrop,
  StyledModalContainer,
} from './RoadmapFormModal.styles';
import type { RoadmapFormModalProps } from './RoadmapFormModal.types';
import FolderStep from './steps/FolderStep';
import InfoStep from './steps/InfoStep';
import StyleStep from './steps/StyleStep';
import TeamStep from './steps/TeamStep';

const RoadmapFormModal: React.FC<RoadmapFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState<number>(FORM_STEPS.FOLDER);
  const [formData, setFormData] = useState<Partial<RoadmapFormData>>({
    name: '',
    description: '',
    color: 'red',
    icon: 'language',
  });

  const handleUpdate = (updates: Partial<RoadmapFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(FORM_STEPS.FOLDER);
    setFormData({
      name: '',
      description: '',
      color: 'red',
      icon: 'language',
    });
    onClose();
  };

  const isFormValid = (): boolean => {
    const { name, description } = formData;
    return !!(name && description && name.trim() && description.trim());
  };

  const handleComplete = () => {
    if (isFormValid()) {
      onSubmit(formData as RoadmapFormData);
      handleClose();
    }
  };

  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case FORM_STEPS.FOLDER:
        return !!(formData.folderId || formData.folderName);
      case FORM_STEPS.TEAM:
        return !!formData.teamId;
      case FORM_STEPS.INFO:
        return isFormValid();
      case FORM_STEPS.STYLE:
        return !!(formData.color && formData.icon);
      default:
        return false;
    }
  };

  const getModalHeight = () => {
    switch (currentStep) {
      case FORM_STEPS.INFO:
        return '520px';
      case FORM_STEPS.STYLE:
        return '534px';
      default:
        return '366px';
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      data: formData,
      onUpdate: handleUpdate,
      onNext: handleNext,
      onPrevious: handlePrevious,
      onClose: handleClose,
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === TOTAL_STEPS,
    };

    switch (currentStep) {
      case FORM_STEPS.FOLDER:
        return <FolderStep {...stepProps} />;
      case FORM_STEPS.TEAM:
        return <TeamStep {...stepProps} />;
      case FORM_STEPS.INFO:
        return <InfoStep {...stepProps} />;
      case FORM_STEPS.STYLE:
        return <StyleStep {...stepProps} />;
      default:
        return null;
    }
  };

  const title = STEP_TITLES[currentStep as keyof typeof STEP_TITLES];
  const description = STEP_DESCRIPTIONS[currentStep as keyof typeof STEP_DESCRIPTIONS];
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;

  if (!isOpen) {
    return null;
  }

  return (
    <StyledModalBackdrop
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <StyledModalContainer $height={getModalHeight()}>
        <StyledFormHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              {title}
            </Text>
            <StyledCloseButton onClick={handleClose} aria-label="닫기">
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
            {description}
          </Text>
          <StyledDivider />
        </StyledFormHeader>

        <StyledFormContent>{renderCurrentStep()}</StyledFormContent>

        <StyledFormFooter>
          {!isFirstStep && (
            <Button
              size="medium"
              variant="outlined"
              onClick={handlePrevious}
              aria-label="이전 단계"
            >
              이전
            </Button>
          )}
          {!isLastStep ? (
            <Button
              size="medium"
              variant="contained"
              onClick={handleNext}
              disabled={!canProceedToNext()}
              aria-label="다음 단계"
            >
              다음
            </Button>
          ) : (
            <Button
              size="medium"
              variant="contained"
              onClick={handleComplete}
              disabled={!canProceedToNext()}
              aria-label="로드맵 생성 완료"
            >
              완료
            </Button>
          )}
        </StyledFormFooter>
      </StyledModalContainer>
    </StyledModalBackdrop>
  );
};

export default RoadmapFormModal;
