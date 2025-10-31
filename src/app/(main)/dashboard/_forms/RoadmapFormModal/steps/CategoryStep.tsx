'use client';

import styled from '@emotion/styled';
import { useCategoryStep } from '@/app/(main)/dashboard/_hooks/useCategoryStep';
import Button from '@/components/common/Button/Button';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

const CategoryStep = () => {
  const { selectedCategory, handleCategorySelect, onNext, isValid } = useCategoryStep();

  const categories = [
    {
      id: 'personal',
      label: '개인 로드맵',
    },
    {
      id: 'team',
      label: '팀 로드맵',
    },
  ];

  return (
    <StyledFormContainer>
      <StyledContent>
        <StyledCategoryContainer>
          <StyledCategoryOptions>
            {categories.map((category) => (
              <StyledCategoryOption
                key={category.id}
                $isSelected={selectedCategory === category.id}
                onClick={() => handleCategorySelect(category.id)}
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

      <StyledFormFooter>
        <Button
          size="medium"
          variant="contained"
          onClick={onNext}
          disabled={!isValid}
          aria-label="다음 단계"
        >
          다음
        </Button>
      </StyledFormFooter>
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
  padding: ${tokens.spacing.large};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
  width: 100%;
  max-width: 400px;
`;

const StyledCategoryOptions = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const StyledCategoryOption = styled.button<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  padding: ${tokens.spacing.small};
  flex: 1;
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

const StyledFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${tokens.spacing.large};
`;
