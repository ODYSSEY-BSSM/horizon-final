'use client';

import styled from '@emotion/styled';
import { Controller } from 'react-hook-form';
import { useStyleStep } from '@/app/(main)/dashboard/_hooks/useStyleStep';
import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { COLOR_OPTIONS, ICON_OPTIONS } from '../../../_constants/RoadmapFormModal.constants';

const StyleStep = () => {
  const {
    control,
    isValid,
    onComplete,
    onPrevious,
    colorDropdownOpen,
    iconDropdownOpen,
    setColorDropdownOpen,
    setIconDropdownOpen,
    color,
    icon,
    selectedColor,
    selectedIcon,
    getGradient,
    handleColorDropdownToggle,
    handleIconDropdownToggle,
  } = useStyleStep();

  return (
    <StyledFormContainer>
      <StyledContent>
        <StyledStyleContainer>
          <StyledThumbnailPreview $color={getGradient(color || 'red')}>
            <StyledThumbnailIcon>
              <Icon
                name={icon || 'language'}
                variant="LG"
                color={tokens.colors.white}
                filled
                decorative
              />
            </StyledThumbnailIcon>
          </StyledThumbnailPreview>

          <StyledStyleSelectors>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <StyledDropdownContainer>
                  <Text as="label" variant="B1" color={tokens.colors.neutral[500]}>
                    컬러
                  </Text>
                  <div style={{ position: 'relative' }}>
                    <StyledDropdownHeader
                      $isOpen={colorDropdownOpen}
                      onClick={handleColorDropdownToggle}
                      aria-label="색상 선택"
                      aria-expanded={colorDropdownOpen}
                    >
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.small }}
                      >
                        <StyledColorSwatch $color={selectedColor.color} />
                        <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                          {selectedColor.label}
                        </Text>
                      </div>
                      <Icon
                        name={colorDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                        variant="SM"
                        color={tokens.colors.neutral[600]}
                        decorative
                      />
                    </StyledDropdownHeader>

                    <StyledDropdownList $isOpen={colorDropdownOpen}>
                      <StyledColorGrid>
                        {COLOR_OPTIONS.map((option) => (
                          <StyledColorOption
                            key={option.id}
                            $color={option.color}
                            $selected={color === option.value}
                            onClick={() => {
                              field.onChange(option.value);
                              setColorDropdownOpen(false);
                            }}
                          >
                            <StyledColorSwatch $color={option.color} />
                            <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                              {option.label}
                            </Text>
                          </StyledColorOption>
                        ))}
                      </StyledColorGrid>
                    </StyledDropdownList>
                  </div>
                </StyledDropdownContainer>
              )}
            />

            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <StyledDropdownContainer>
                  <Text as="label" variant="B1" color={tokens.colors.neutral[500]}>
                    아이콘
                  </Text>
                  <div style={{ position: 'relative' }}>
                    <StyledDropdownHeader
                      $isOpen={iconDropdownOpen}
                      onClick={handleIconDropdownToggle}
                      aria-label="아이콘 선택"
                      aria-expanded={iconDropdownOpen}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: tokens.spacing.medium,
                        }}
                      >
                        <StyledIconContainer>
                          <Icon
                            name={selectedIcon.icon}
                            variant="SM"
                            color={tokens.colors.black}
                            filled
                            decorative
                          />
                        </StyledIconContainer>
                        <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                          {selectedIcon.label}
                        </Text>
                      </div>
                      <Icon
                        name={iconDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                        variant="SM"
                        color={tokens.colors.neutral[600]}
                        decorative
                      />
                    </StyledDropdownHeader>

                    <StyledDropdownList $isOpen={iconDropdownOpen}>
                      <StyledIconGrid>
                        {ICON_OPTIONS.map((option) => (
                          <StyledIconOption
                            key={option.id}
                            $selected={icon === option.value}
                            onClick={() => {
                              field.onChange(option.value);
                              setIconDropdownOpen(false);
                            }}
                          >
                            <StyledIconContainer>
                              <Icon
                                name={option.icon}
                                variant="SM"
                                color={tokens.colors.black}
                                filled
                                decorative
                              />
                            </StyledIconContainer>
                            <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                              {option.label}
                            </Text>
                          </StyledIconOption>
                        ))}
                      </StyledIconGrid>
                    </StyledDropdownList>
                  </div>
                </StyledDropdownContainer>
              )}
            />
          </StyledStyleSelectors>
        </StyledStyleContainer>
      </StyledContent>

      <StyledFormFooter>
        <Button size="medium" variant="outlined" onClick={onPrevious} aria-label="이전 단계">
          이전
        </Button>
        <Button
          size="medium"
          variant="contained"
          onClick={onComplete}
          disabled={!isValid}
          aria-label="로드맵 생성 완료"
        >
          완료
        </Button>
      </StyledFormFooter>
    </StyledFormContainer>
  );
};

export default StyleStep;

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledContent = styled.div`
  padding: ${tokens.spacing.large};
  flex: 1;
`;

const StyledFormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${tokens.spacing.large};
  border-top: 1px solid ${tokens.colors.neutral[200]};
  margin-top: auto;
`;

const StyledStyleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

const StyledThumbnailPreview = styled.div<{ $color: string }>`
  width: 100%;
  height: 148px;
  border-radius: ${tokens.radius.medium};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const StyledThumbnailIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${tokens.radius.medium};
`;

const StyledStyleSelectors = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
  width: 100%;
`;

const StyledDropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  width: 100%;
  position: relative;
  z-index: 1;
  flex: 1;
`;

const StyledDropdownHeader = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  background-color: ${tokens.colors.white};
  border: ${({ $isOpen }) =>
    $isOpen
      ? `2px solid ${tokens.colors.primary[500]}`
      : `1px solid ${tokens.colors.neutral[300]}`};
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${tokens.colors.primary[500]};
  }

  &:focus-visible {
    outline: none;
    border-color: ${tokens.colors.primary[500]};
  }
`;

const StyledDropdownList = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  box-shadow: ${tokens.shadow[0]};
  z-index: 1001;
  max-height: 240px;
  overflow-y: auto;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const StyledColorGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const StyledColorOption = styled.button<{ $color: string; $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  height: 48px;
  padding: ${tokens.spacing.small} ${tokens.spacing.small};
  background-color: ${tokens.colors.white};
  border: none;
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  ${({ $selected }) =>
    $selected &&
    `
    background-color: ${tokens.colors.primary[100]};
    color: ${tokens.colors.primary[500]};
  `}
`;

const StyledColorSwatch = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const StyledIconGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  max-height: 264px;
  overflow-y: auto;
`;

const StyledIconOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  height: 48px;
  padding: ${tokens.spacing.small};
  background-color: ${tokens.colors.white};
  border: none;
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  ${({ $selected }) =>
    $selected &&
    `
    background-color: ${tokens.colors.primary[100]};
    color: ${tokens.colors.primary[500]};
  `}
`;

const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
`;
