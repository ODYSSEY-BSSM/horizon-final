import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';
import { teamApi } from '@/feature/team/api/teamApi';

export const useTeamStep = () => {
  const { formData, updateField, nextStep, previousStep, isStepValid } = useRoadmapFormStore();

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.getTeams,
    staleTime: 1000 * 60 * 5,
  });

  const [isOpen, setIsOpen] = useState(false);

  const TEAM_OPTIONS =
    teams?.map((team) => ({
      id: String(team.id),
      label: team.name,
      value: String(team.id),
    })) || [];

  const teamId = formData.teamId;
  const selectedTeam = teamId ? TEAM_OPTIONS.find((option) => option.id === teamId) : null;

  const getDisplayText = () => {
    if (selectedTeam) {
      return selectedTeam.label;
    }
    return '팀을 선택해주세요';
  };

  const hasSelection = !!teamId;

  const handleNext = () => {
    nextStep();
  };

  const handlePrevious = () => {
    previousStep();
  };

  const isValid = isStepValid();

  return {
    isValid,

    onNext: handleNext,
    onPrevious: handlePrevious,

    isOpen,
    setIsOpen,

    teamId,
    selectedTeam,
    hasSelection,
    isLoading,
    TEAM_OPTIONS,

    updateField,

    getDisplayText,
  };
};
