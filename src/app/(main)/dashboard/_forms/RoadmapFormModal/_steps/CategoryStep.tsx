'use client';

import styled from '@emotion/styled';
import { useCategoryStep } from '@/app/(main)/dashboard/_hooks/useCategoryStep';
import { Text } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import { CATEGORY_OPTIONS } from '../../../_constants/RoadmapFormModal.constants';
import FormFooter from '../_components/FormFooter';
import { MODAL_SPACING } from '../_constants/spacing';

const CategoryStep = () => {
  const { selectedCategory, handleCategorySelect, onNext, isValid } = useCategoryStep();

  return (
    <StyledFormContainer>
      <StyledContent>
        <StyledCategoryContainer>
          <StyledCategoryOptions>
            {CATEGORY_OPTIONS.map((category) => (
              <StyledCategoryOption
                type="button"
                key={category.id}
                $isSelected={selectedCategory === category.id}
                onClick={() => handleCategorySelect(category.id)}
                aria-pressed={selectedCategory === category.id}
              >
                <Text
                  as="span"
                  variant="ST"
                  color={
                    selectedCategory === category.id
                      ? tokens.colors.primary[500]
                      : tokens.colors.neutral[500]
                  }
                >
                  {category.label}
                </Text>
              </StyledCategoryOption>
            ))}
          </StyledCategoryOptions>
        </StyledCategoryContainer>
      </StyledContent>

      <FormFooter onNext={onNext} isValid={isValid} showPrevious={false} isLastStep={false} />
    </StyledFormContainer>
  );
};

export default CategoryStep;

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledContent = styled.div`
  padding: ${MODAL_SPACING.modal.padding};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
  width: 100%;
`;

const StyledCategoryOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${MODAL_SPACING.steps.category.button.gap};
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${tokens.spacing.medium};
  }
`;

const StyledCategoryOption = styled.button<{ $isSelected: boolean }>`
  height: ${MODAL_SPACING.steps.category.button.height};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing.large};
  background-color: ${({ $isSelected }) =>
    $isSelected ? tokens.colors.primary[100] : tokens.colors.white};
  border: ${({ $isSelected }) =>
    $isSelected
      ? `1px solid ${tokens.colors.primary[500]}`
      : `1px solid ${tokens.colors.neutral[300]}`};
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${tokens.colors.primary[500]};
    background-color: ${tokens.colors.primary[100]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;
