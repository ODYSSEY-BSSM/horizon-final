import { useState } from 'react';
import { tokens } from '@/shared/tokens';
import { COLOR_OPTIONS, ICON_OPTIONS } from '../_constants/RoadmapFormModal.constants';
import { useStyleStepForm } from './useRoadmapForm';

export const useStyleStep = () => {
  const {
    control,
    onComplete,
    onPrevious,
    formState: { isValid },
    watch,
  } = useStyleStepForm();

  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);

  const color = watch('color');
  const icon = watch('icon');

  const selectedColor = COLOR_OPTIONS.find((option) => option.value === color) || COLOR_OPTIONS[0];
  const selectedIcon = ICON_OPTIONS.find((option) => option.value === icon) || ICON_OPTIONS[0];

  const getGradient = (colorValue: string): string => {
    const gradientKey = colorValue as keyof typeof tokens.gradients.roadmap;
    return tokens.gradients.roadmap[gradientKey] || tokens.gradients.roadmap.red;
  };

  const handleColorDropdownToggle = () => {
    setColorDropdownOpen(!colorDropdownOpen);
    setIconDropdownOpen(false);
  };

  const handleIconDropdownToggle = () => {
    setIconDropdownOpen(!iconDropdownOpen);
    setColorDropdownOpen(false);
  };

  return {
    // Form state
    control,
    isValid,

    // Navigation
    onComplete,
    onPrevious,

    // Dropdown state
    colorDropdownOpen,
    iconDropdownOpen,
    setColorDropdownOpen,
    setIconDropdownOpen,

    // Data
    color,
    icon,
    selectedColor,
    selectedIcon,

    // Handlers
    getGradient,
    handleColorDropdownToggle,
    handleIconDropdownToggle,
  };
};
