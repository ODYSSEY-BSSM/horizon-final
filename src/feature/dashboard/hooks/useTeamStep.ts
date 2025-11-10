import { useState } from 'react';
import { TEAM_OPTIONS } from '@/feature/dashboard/constants/RoadmapFormModal.constants';
import { useTeamStepForm } from './useRoadmapForm';

export const useTeamStep = () => {
  const {
    control,
    onNext,
    onPrevious,
    formState: { errors, isValid },
    watch,
  } = useTeamStepForm();

  const [isOpen, setIsOpen] = useState(false);

  const teamId = watch('teamId');
  const selectedTeam = teamId ? TEAM_OPTIONS.find((option) => option.id === teamId) : null;

  const getDisplayText = () => {
    if (selectedTeam) {
      return selectedTeam.label;
    }
    return '팀을 선택해주세요';
  };

  const hasSelection = !!teamId;

  return {
    // Form state
    control,
    errors,
    isValid,

    // Navigation
    onNext,
    onPrevious,

    // Dropdown state
    isOpen,
    setIsOpen,

    // Data
    teamId,
    selectedTeam,
    hasSelection,

    // Handlers
    getDisplayText,
  };
};
