'use client';

import styled from '@emotion/styled';
import { useId } from 'react';
import { Controller } from 'react-hook-form';
import { useStyleStep } from '@/app/(main)/dashboard/_hooks/useStyleStep';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { COLOR_OPTIONS, ICON_OPTIONS } from '../../../_constants/RoadmapFormModal.constants';
import { useDropdown } from '../../../_hooks/useDropdown';
import FormFooter from '../_components/FormFooter';
import { MODAL_SPACING } from '../_constants/spacing';

const StyleStep = () => {
  const colorLabelId = useId();
  const colorButtonId = `${colorLabelId}-button`;
  const iconLabelId = useId();
  const iconButtonId = `${iconLabelId}-button`;
  const {
    control,
    isValid,
    onComplete,
    onPrevious,
    color,
    icon,
    selectedColor,
    selectedIcon,
    getGradient,
  } = useStyleStep();
  const {
    isOpen: colorDropdownOpen,
    setIsOpen: setColorDropdownOpen,
    dropdownRef: colorDropdownRef,
    highlightedIndex: highlightedColorIndex,
    handleKeyDown: handleColorKeyDown,
  } = useDropdown({
    itemCount: COLOR_OPTIONS.length,
  });
  const {
    isOpen: iconDropdownOpen,
    setIsOpen: setIconDropdownOpen,
    dropdownRef: iconDropdownRef,
    highlightedIndex: highlightedIconIndex,
    handleKeyDown: handleIconKeyDown,
  } = useDropdown({
    itemCount: ICON_OPTIONS.length,
  });

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
                  <Text
                    as="label"
                    id={colorLabelId}
                    htmlFor={colorButtonId}
                    variant="B1"
                    color={tokens.colors.neutral[500]}
                  >
                    컬러
                  </Text>
                  <div
                    style={{ position: 'relative' }}
                    ref={colorDropdownRef}
                    onKeyDown={(e) => {
                      handleColorKeyDown(e);
                      if (e.key === 'Enter' && highlightedColorIndex !== -1) {
                        field.onChange(COLOR_OPTIONS[highlightedColorIndex].value);
                        setColorDropdownOpen(false);
                      }
                    }}
                    role="group"
                  >
                    <StyledDropdownHeader
                      type="button"
                      id={colorButtonId}
                      aria-labelledby={colorLabelId}
                      aria-haspopup="listbox"
                      $isOpen={colorDropdownOpen}
                      onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                      aria-label="색상 선택"
                      aria-expanded={colorDropdownOpen}
                      aria-activedescendant={
                        colorDropdownOpen && highlightedColorIndex !== -1
                          ? `color-option-${COLOR_OPTIONS[highlightedColorIndex].id}`
                          : undefined
                      }
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

                    <StyledDropdownList $isOpen={colorDropdownOpen} role="listbox">
                      <StyledColorGrid>
                        {COLOR_OPTIONS.map((option, index) => (
                          <StyledColorOption
                            type="button"
                            key={option.id}
                            id={`color-option-${option.id}`}
                            $color={option.color}
                            $selected={color === option.value}
                            onClick={() => {
                              field.onChange(option.value);
                              setColorDropdownOpen(false);
                            }}
                            $highlighted={highlightedColorIndex === index}
                            role="option"
                            aria-selected={color === option.value}
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
                  <Text
                    as="label"
                    id={iconLabelId}
                    htmlFor={iconButtonId}
                    variant="B1"
                    color={tokens.colors.neutral[500]}
                  >
                    아이콘
                  </Text>
                  <div
                    style={{ position: 'relative' }}
                    ref={iconDropdownRef}
                    onKeyDown={(e) => {
                      handleIconKeyDown(e);
                      if (e.key === 'Enter' && highlightedIconIndex !== -1) {
                        field.onChange(ICON_OPTIONS[highlightedIconIndex].value);
                        setIconDropdownOpen(false);
                      }
                    }}
                    role="group"
                  >
                    <StyledDropdownHeader
                      type="button"
                      id={iconButtonId}
                      aria-labelledby={iconLabelId}
                      aria-haspopup="listbox"
                      $isOpen={iconDropdownOpen}
                      onClick={() => setIconDropdownOpen(!iconDropdownOpen)}
                      aria-label="아이콘 선택"
                      aria-expanded={iconDropdownOpen}
                      aria-activedescendant={
                        iconDropdownOpen && highlightedIconIndex !== -1
                          ? `icon-option-${ICON_OPTIONS[highlightedIconIndex].id}`
                          : undefined
                      }
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

                    <StyledDropdownList $isOpen={iconDropdownOpen} role="listbox">
                      <StyledIconGrid>
                        {ICON_OPTIONS.map((option, index) => (
                          <StyledIconOption
                            type="button"
                            key={option.id}
                            id={`icon-option-${option.id}`}
                            $selected={icon === option.value}
                            onClick={() => {
                              field.onChange(option.value);
                              setIconDropdownOpen(false);
                            }}
                            $highlighted={highlightedIconIndex === index}
                            role="option"
                            aria-selected={icon === option.value}
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

      <FormFooter
        onPrevious={onPrevious}
        onComplete={onComplete}
        isValid={isValid}
        showPrevious={true}
        isLastStep={true}
      />
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
  padding: ${MODAL_SPACING.modal.padding};
  flex: 1;
`;

const StyledStyleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${MODAL_SPACING.steps.style.containerGap};
`;

const StyledThumbnailPreview = styled.div<{ $color: string }>`
  width: 100%;
  height: ${MODAL_SPACING.steps.style.thumbnail.height};
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
  gap: ${MODAL_SPACING.steps.style.containerGap};
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
  height: ${MODAL_SPACING.steps.dropdown.height};
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
  z-index: 10000;
  max-height: ${MODAL_SPACING.steps.dropdown.maxHeight};
  overflow-y: auto;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const StyledColorGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const StyledColorOption = styled.button<{
  $color: string;
  $selected: boolean;
  $highlighted: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  height: ${MODAL_SPACING.steps.dropdown.height};
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

  ${({ $highlighted }) =>
    $highlighted &&
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
  max-height: ${MODAL_SPACING.steps.dropdown.maxHeight};
  overflow-y: auto;
`;

const StyledIconOption = styled.button<{
  $selected: boolean;
  $highlighted: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  height: ${MODAL_SPACING.steps.dropdown.height};
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

  ${({ $highlighted }) =>
    $highlighted &&
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
