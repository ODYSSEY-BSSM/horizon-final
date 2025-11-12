import { useState } from 'react';
import {
  COLOR_OPTIONS,
  ICON_OPTIONS,
} from '@/feature/dashboard/constants/RoadmapFormModal.constants';
import { useRoadmapSubmit, useTeamRoadmapSubmit } from '@/feature/roadmap/hooks/useRoadmapSubmit';
import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';
import { tokens } from '@/shared/tokens';
import type { RoadmapColor } from '@/shared/types/roadmap';

export const useStyleStep = () => {
  const { formData, updateField, previousStep, isStepValid } = useRoadmapFormStore();

  // Get submission hooks
  const { submitRoadmap, isLoading: isPersonalLoading } = useRoadmapSubmit();
  const teamId = formData.teamId ? Number(formData.teamId) : 0;
  const { submitTeamRoadmap, isLoading: isTeamLoading } = useTeamRoadmapSubmit(teamId);

  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);

  const color = formData.color;
  const icon = formData.icon;

  const selectedColor = COLOR_OPTIONS.find((option) => option.value === color) || COLOR_OPTIONS[0];
  const selectedIcon = ICON_OPTIONS.find((option) => option.value === icon) || ICON_OPTIONS[0];

  const isValidRoadmapColor = (value: string): value is RoadmapColor => {
    return ['red', 'orange', 'yellow', 'green', 'blue', 'purple'].includes(value);
  };

  const getGradient = (colorValue: string): string => {
    if (isValidRoadmapColor(colorValue)) {
      return tokens.gradients.roadmap[colorValue];
    }
    return tokens.gradients.roadmap.red;
  };

  const handleColorDropdownToggle = () => {
    setColorDropdownOpen(!colorDropdownOpen);
    setIconDropdownOpen(false);
  };

  const handleIconDropdownToggle = () => {
    setIconDropdownOpen(!iconDropdownOpen);
    setColorDropdownOpen(false);
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleComplete = async () => {
    if (!isStepValid()) {
      return;
    }

    try {
      if (formData.category === 'team' && formData.teamId) {
        await submitTeamRoadmap();
      } else {
        await submitRoadmap();
      }
    } catch (_error) {}
  };

  const isValid = isStepValid();

  return {
    // Form state
    isValid,

    // Navigation
    onComplete: handleComplete,
    onPrevious: handlePrevious,

    // Loading state
    isLoading: isPersonalLoading || isTeamLoading,

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

    // Field update
    updateField,

    // Handlers
    getGradient,
    handleColorDropdownToggle,
    handleIconDropdownToggle,
  };
};
