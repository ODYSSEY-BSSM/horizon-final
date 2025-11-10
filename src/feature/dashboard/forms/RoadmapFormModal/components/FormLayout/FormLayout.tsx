'use client';

import styled from '@emotion/styled';
import { type ReactNode, useEffect, useId } from 'react';
import { tokens } from '@/shared/tokens';
import { MODAL_SPACING, STEP_HEIGHTS } from '../../constants/spacing';
import { FormHeader } from '../FormHeader';

interface FormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  currentStep: keyof typeof STEP_HEIGHTS;
  onClose: () => void;
}

const FormLayout = ({ title, description, children, currentStep, onClose }: FormLayoutProps) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <StyledModalBackdrop
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <StyledModalContainer
        $height={STEP_HEIGHTS[currentStep]}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <FormHeader
          title={title}
          description={description}
          onClose={onClose}
          titleId={titleId}
          descriptionId={descriptionId}
        />

        <StyledFormContent>{children}</StyledFormContent>
      </StyledModalContainer>
    </StyledModalBackdrop>
  );
};

export default FormLayout;

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

const StyledModalContainer = styled.div<{ $height: string }>`
  background-color: ${tokens.colors.white};
  border: none;
  border-radius: ${tokens.radius.large};
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: ${MODAL_SPACING.modal.width};
  height: ${({ $height }) => $height};
  min-height: ${MODAL_SPACING.modal.minHeight};
  max-height: 90vh;
  overflow: visible;
  display: flex;
  flex-direction: column;
`;

const StyledFormContent = styled.div`
  flex: 1;
  overflow: visible;
`;
