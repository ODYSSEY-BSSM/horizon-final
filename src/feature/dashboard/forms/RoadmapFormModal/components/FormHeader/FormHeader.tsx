'use client';

import styled from '@emotion/styled';
import { Icon } from '@/shared/ui';
import { Text } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import { MODAL_SPACING } from '../../constants/spacing';

interface FormHeaderProps {
  title: string;
  description: string;
  onClose: () => void;
  titleId: string;
  descriptionId: string;
}

const FormHeader = ({ title, description, onClose, titleId, descriptionId }: FormHeaderProps) => {
  return (
    <StyledFormHeader>
      <StyledHeaderTop>
        <Text as="h2" variant="H2" color={tokens.colors.neutral[800]} id={titleId}>
          {title}
        </Text>
        <StyledCloseButton onClick={onClose} aria-label="닫기">
          <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
        </StyledCloseButton>
      </StyledHeaderTop>
      <Text as="p" variant="B1" color={tokens.colors.neutral[600]} id={descriptionId}>
        {description}
      </Text>
    </StyledFormHeader>
  );
};

export default FormHeader;

const StyledFormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${MODAL_SPACING.header.titleDescriptionGap};
  padding: ${MODAL_SPACING.modal.padding} ${MODAL_SPACING.modal.padding} ${MODAL_SPACING.header.dividerMargin};
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
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
