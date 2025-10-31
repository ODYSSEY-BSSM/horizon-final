'use client';

import { useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import type { FormStepProps } from '@/lib/types/modal';
import { tokens } from '@/shared/tokens';
import { ROADMAP_GRADIENTS } from '../../../_components/RoadmapCard.constants';
import { COLOR_OPTIONS, ICON_OPTIONS } from '../RoadmapFormModal.constants';
import {
  ColorGrid,
  ColorOption,
  ColorSwatch,
  DropdownContainer,
  DropdownHeader,
  DropdownList,
  IconContainer,
  IconGrid,
  IconOption,
  StyleContainer,
  StyleSelectors,
  ThumbnailIcon,
  ThumbnailPreview,
} from '../RoadmapFormModal.styles';

const StyleStep: React.FC<FormStepProps> = ({ data, onUpdate }) => {
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);

  const selectedColor =
    COLOR_OPTIONS.find((option) => option.value === data.color) || COLOR_OPTIONS[0];
  const selectedIcon = ICON_OPTIONS.find((option) => option.value === data.icon) || ICON_OPTIONS[0];

  const handleColorSelect = (color: string) => {
    onUpdate({ color });
    setColorDropdownOpen(false);
  };

  const handleIconSelect = (icon: string) => {
    onUpdate({ icon });
    setIconDropdownOpen(false);
  };

  const getGradient = (colorValue: string): string => {
    const gradientKey = colorValue as keyof typeof ROADMAP_GRADIENTS;
    const config = ROADMAP_GRADIENTS[gradientKey] || ROADMAP_GRADIENTS.red;
    return `linear-gradient(135deg, ${config.start} 0%, ${config.end} 100%)`;
  };

  return (
    <StyleContainer>
      <ThumbnailPreview $color={getGradient(data.color || 'red')}>
        <ThumbnailIcon>
          <Icon
            name={data.icon || 'language'}
            variant="LG"
            color={tokens.colors.white}
            filled
            decorative
          />
        </ThumbnailIcon>
      </ThumbnailPreview>

      <StyleSelectors>
        {/* Color Selector */}
        <DropdownContainer>
          <Text as="label" variant="B1" color={tokens.colors.neutral[500]}>
            컬러
          </Text>
          <div style={{ position: 'relative' }}>
            <DropdownHeader
              $isOpen={colorDropdownOpen}
              onClick={() => {
                setColorDropdownOpen(!colorDropdownOpen);
                setIconDropdownOpen(false);
              }}
              aria-label="색상 선택"
              aria-expanded={colorDropdownOpen}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.small }}>
                <ColorSwatch $color={selectedColor.color} />
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
            </DropdownHeader>

            <DropdownList $isOpen={colorDropdownOpen}>
              <ColorGrid>
                {COLOR_OPTIONS.map((option) => (
                  <ColorOption
                    key={option.id}
                    $color={option.color}
                    $selected={data.color === option.value}
                    onClick={() => handleColorSelect(option.value)}
                  >
                    <ColorSwatch $color={option.color} />
                    <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                      {option.label}
                    </Text>
                  </ColorOption>
                ))}
              </ColorGrid>
            </DropdownList>
          </div>
        </DropdownContainer>

        {/* Icon Selector */}
        <DropdownContainer>
          <Text as="label" variant="B1" color={tokens.colors.neutral[500]}>
            아이콘
          </Text>
          <div style={{ position: 'relative' }}>
            <DropdownHeader
              $isOpen={iconDropdownOpen}
              onClick={() => {
                setIconDropdownOpen(!iconDropdownOpen);
                setColorDropdownOpen(false);
              }}
              aria-label="아이콘 선택"
              aria-expanded={iconDropdownOpen}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.medium }}>
                <IconContainer>
                  <Icon
                    name={selectedIcon.icon}
                    variant="SM"
                    color={tokens.colors.black}
                    filled
                    decorative
                  />
                </IconContainer>
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
            </DropdownHeader>

            <DropdownList $isOpen={iconDropdownOpen}>
              <IconGrid>
                {ICON_OPTIONS.map((option) => (
                  <IconOption
                    key={option.id}
                    $selected={data.icon === option.value}
                    onClick={() => handleIconSelect(option.value)}
                  >
                    <IconContainer>
                      <Icon
                        name={option.icon}
                        variant="SM"
                        color={tokens.colors.black}
                        filled
                        decorative
                      />
                    </IconContainer>
                    <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                      {option.label}
                    </Text>
                  </IconOption>
                ))}
              </IconGrid>
            </DropdownList>
          </div>
        </DropdownContainer>
      </StyleSelectors>
    </StyleContainer>
  );
};

export default StyleStep;
