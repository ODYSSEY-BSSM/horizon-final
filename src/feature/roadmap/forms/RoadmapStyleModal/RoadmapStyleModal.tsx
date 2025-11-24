'use client';

import styled from '@emotion/styled';
import { useEffect, useId, useState } from 'react';
import {
  COLOR_OPTIONS,
  ICON_OPTIONS,
} from '@/feature/dashboard/constants/RoadmapFormModal.constants';
import type { ColorOption, IconOption } from '@/feature/roadmap';
import { RoadmapThumbnail } from '@/feature/roadmap';
import { useDropdown } from '@/shared/hooks/useDropdown';
import { tokens } from '@/shared/tokens';
import { Button, Icon, Text } from '@/shared/ui';

export interface RoadmapStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { color: ColorOption; icon: IconOption }) => void;
  onBack: () => void;
}

const RoadmapStyleModal = ({ isOpen, onClose, onSubmit, onBack }: RoadmapStyleModalProps) => {
  const colorLabelId = useId();
  const colorButtonId = `${colorLabelId}-button`;
  const iconLabelId = useId();
  const iconButtonId = `${iconLabelId}-button`;

  const [formData, setFormData] = useState<{ color: ColorOption; icon: IconOption }>({
    color: 'red',
    icon: 'language',
  });

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

  useEffect(() => {
    if (!isOpen) {
      setFormData({ color: 'red', icon: 'language' });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedColor =
    COLOR_OPTIONS.find((opt) => opt.value === formData.color) || COLOR_OPTIONS[0];
  const selectedIcon = ICON_OPTIONS.find((opt) => opt.value === formData.icon) || ICON_OPTIONS[0];

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              로드맵 스타일
            </Text>
            <StyledCloseButton onClick={onClose} type="button">
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
            로드맵 스타일을 지정해주세요.
          </Text>
        </StyledHeader>

        <StyledDivider />

        <StyledForm onSubmit={handleSubmit}>
          <StyledPreviewSection>
            <RoadmapThumbnail color={formData.color} icon={formData.icon} />
          </StyledPreviewSection>

          <StyledDropdownRow>
            <StyledDropdownContainer>
              <Text
                as="label"
                id={colorLabelId}
                htmlFor={colorButtonId}
                variant="B1"
                color={tokens.colors.neutral[500]}
              >
                색상
              </Text>
              <div
                style={{ position: 'relative' }}
                ref={colorDropdownRef}
                onKeyDown={(e) => {
                  handleColorKeyDown(e);
                  if (e.key === 'Enter' && highlightedColorIndex !== -1) {
                    setFormData((prev) => ({
                      ...prev,
                      color: COLOR_OPTIONS[highlightedColorIndex].value as ColorOption,
                    }));
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.small }}>
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
                        $selected={formData.color === option.value}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, color: option.value as ColorOption }));
                          setColorDropdownOpen(false);
                        }}
                        $highlighted={highlightedColorIndex === index}
                        role="option"
                        aria-selected={formData.color === option.value}
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
                    setFormData((prev) => ({
                      ...prev,
                      icon: ICON_OPTIONS[highlightedIconIndex].value as IconOption,
                    }));
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
                        $selected={formData.icon === option.value}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, icon: option.value as IconOption }));
                          setIconDropdownOpen(false);
                        }}
                        $highlighted={highlightedIconIndex === index}
                        role="option"
                        aria-selected={formData.icon === option.value}
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
          </StyledDropdownRow>

          <StyledActions>
            <Button type="button" variant="outlined" size="medium" onClick={onBack}>
              이전
            </Button>
            <Button type="submit" variant="contained" size="medium">
              완료
            </Button>
          </StyledActions>
        </StyledForm>
      </StyledModal>
    </StyledOverlay>
  );
};

export default RoadmapStyleModal;

const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledModal = styled.div`
  background-color: ${tokens.colors.white};
  border-radius: ${tokens.radius.large};
  width: 560px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: visible;
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.div`
  padding: ${tokens.spacing.xlarge};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const StyledDivider = styled.div`
  height: 1px;
  background-color: ${tokens.colors.neutral[100]};
`;

const StyledForm = styled.form`
  padding: ${tokens.spacing.xlarge};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
  overflow: visible;
`;

const StyledPreviewSection = styled.div`
  width: 100%;
`;

const StyledDropdownRow = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
  width: 100%;
  overflow: visible;
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
  z-index: 10000;
  max-height: 300px;
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
  max-height: 300px;
  overflow-y: auto;
`;

const StyledIconOption = styled.button<{
  $selected: boolean;
  $highlighted: boolean;
}>`
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

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${tokens.spacing.medium};
`;
