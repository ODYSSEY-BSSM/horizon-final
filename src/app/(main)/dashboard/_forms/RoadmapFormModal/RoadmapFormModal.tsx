'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { useRoadmapFormFlow } from '@/lib/stores/roadmapFormFlow';
import { tokens } from '@/shared/tokens';
import { STEP_DESCRIPTIONS, STEP_TITLES } from '../../_constants/RoadmapFormModal.constants';
import FolderStep from './steps/FolderStep';
import InfoStep from './steps/InfoStep';
import StyleStep from './steps/StyleStep';
import TeamStep from './steps/TeamStep';

// Styled components
const StyledModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledModalContainer = styled.div<{ $height?: string }>`
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.large};
  position: relative;
  box-shadow: ${tokens.shadow[0]};
  width: 560px;
  height: ${({ $height }) => $height || 'auto'};
  min-height: 366px;
  max-height: 90vh;
  overflow: visible;
`;

const StyledFormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  padding: ${tokens.spacing.xxlarge};
  padding-bottom: ${tokens.spacing.large};
`;

const StyledHeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const StyledCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.radius.small};
  }
`;

const StyledDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${tokens.colors.neutral[200]};
`;

const StyledFormContent = styled.div`
  padding: 0 ${tokens.spacing.xxlarge};
  padding-bottom: ${tokens.spacing.large};
  flex: 1;
  overflow: visible;
`;

const RoadmapFormModal = () => {
  const { currentStep, isModalOpen, closeModal } = useRoadmapFormFlow();

  const handleClose = () => {
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
    switch (currentStep) {
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
