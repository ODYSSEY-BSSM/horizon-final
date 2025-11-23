import { useState } from 'react';
import {
  COLOR_OPTIONS,
  ICON_OPTIONS,
} from '@/feature/dashboard/constants/RoadmapFormModal.constants';
import { useUpdateRoadmap } from '@/feature/roadmap/hooks/useRoadmapQueries';
import { useRoadmapSubmit, useTeamRoadmapSubmit } from '@/feature/roadmap/hooks/useRoadmapSubmit';
import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';
import type { Color, Icon } from '@/shared/api/types';
import { tokens } from '@/shared/tokens';
import type { RoadmapColor } from '@/shared/types/roadmap';

export const useStyleStep = () => {
  const { formData, updateField, previousStep, isStepValid, mode, roadmapId, closeModal } =
    useRoadmapFormStore();

  const { submitRoadmap, isLoading: isPersonalLoading } = useRoadmapSubmit();
  const teamId = formData.teamId ? Number(formData.teamId) : 0;
  const { submitTeamRoadmap, isLoading: isTeamLoading } = useTeamRoadmapSubmit(teamId);
  const updateMutation = useUpdateRoadmap();

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
      if (mode === 'edit' && roadmapId) {
        // Edit 모드: PUT 요청
        const directoryId = formData.folderId ? Number.parseInt(formData.folderId, 10) : 0;
        const putData = {
          title: formData.name,
          description: formData.description,
          directoryId,
          color: formData.color.toUpperCase() as Color,
          icon: formData.icon.toUpperCase() as Icon,
        };
        await updateMutation.mutateAsync({
          roadmapUuid: roadmapId,
          data: putData,
        });
        closeModal();
      } else {
        // Create 모드: POST 요청
        if (formData.category === 'team' && formData.teamId) {
          await submitTeamRoadmap();
        } else {
          await submitRoadmap();
        }
      }
    } catch (_error) {
      // 에러를 의도적으로 무시합니다.
    }
  };

  const isValid = isStepValid();

  return {
    isValid,

    onComplete: handleComplete,
    onPrevious: handlePrevious,

    isLoading: isPersonalLoading || isTeamLoading || updateMutation.isPending,

    colorDropdownOpen,
    iconDropdownOpen,
    setColorDropdownOpen,
    setIconDropdownOpen,

    color,
    icon,
    selectedColor,
    selectedIcon,

    updateField,

    getGradient,
    handleColorDropdownToggle,
    handleIconDropdownToggle,
  };
};
