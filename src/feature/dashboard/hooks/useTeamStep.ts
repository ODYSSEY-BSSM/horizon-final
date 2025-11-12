import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { teamApi } from '@/feature/team/api/teamApi';
import { useTeamStepForm } from './useRoadmapForm';

export const useTeamStep = () => {
  const {
    control,
    onNext,
    onPrevious,
    formState: { errors, isValid },
    watch,
  } = useTeamStepForm();

  // 내가 속한 팀 목록 조회
  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.getTeams,
    staleTime: 1000 * 60 * 5, // 5분
  });

  const [isOpen, setIsOpen] = useState(false);

  // API 데이터를 드롭다운 옵션 형식으로 변환
  const TEAM_OPTIONS =
    teams?.map((team) => ({
      id: String(team.uuid),
      label: team.name,
      value: String(team.uuid),
    })) || [];

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
    isLoading,
    TEAM_OPTIONS,

    // Handlers
    getDisplayText,
  };
};
