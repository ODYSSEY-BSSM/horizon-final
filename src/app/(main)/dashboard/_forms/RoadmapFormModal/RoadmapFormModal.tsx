'use client';

import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { useRoadmapFormFlow } from '@/lib/stores/roadmapFormFlow';
import type { RoadmapFormData } from '@/lib/validations/roadmap';
import { tokens } from '@/shared/tokens';
import { STEP_DESCRIPTIONS, STEP_TITLES } from '../../_constants/RoadmapFormModal.constants';
import {
  StyledCloseButton,
  StyledDivider,
  StyledFormContent,
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

const RoadmapFormModal: React.FC<RoadmapFormModalProps> = ({ onSubmit }) => {
  const { currentStep, isModalOpen, closeModal } = useRoadmapFormFlow();

  const handleClose = () => {
    closeModal();
  };

  const handleFormSubmit = (data: RoadmapFormData) => {
    onSubmit(data);
    closeModal();
  };

  const getModalHeight = () => {
    switch (currentStep) {
      case 'info':
        return '520px';
      case 'style':
        return '534px';
      default:
        return '366px';
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      onClose: handleClose,
      onSubmit: handleFormSubmit,
    };

    switch (currentStep) {
      case 'folder':
        return <FolderStep {...stepProps} />;
      case 'team':
        return <TeamStep {...stepProps} />;
      case 'info':
        return <InfoStep {...stepProps} />;
      case 'style':
        return <StyleStep {...stepProps} />;
      default:
        return null;
    }
  };

  const stepNumber = {
    folder: 1,
    team: 2,
    info: 3,
    style: 4,
  }[currentStep];

  const title = STEP_TITLES[stepNumber as keyof typeof STEP_TITLES];
  const description = STEP_DESCRIPTIONS[stepNumber as keyof typeof STEP_DESCRIPTIONS];

  if (!isModalOpen) {
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

        {/* Form footer is now handled by individual step components */}
      </StyledModalContainer>
    </StyledModalBackdrop>
  );
};

export default RoadmapFormModal;
