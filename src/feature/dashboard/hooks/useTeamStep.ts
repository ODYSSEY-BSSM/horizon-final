import { useState } from 'react';
import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';

export const useTeamStep = () => {
  const { formData, updateField, nextStep, previousStep, isStepValid } = useRoadmapFormStore();

  // ❌ GET /teams API는 Swagger 명세에서 팀 이름만 반환 ({ teams: string[] })
  // ID 없이는 라우팅 불가능하므로 팀 선택 기능 비활성화
  // TODO: 백엔드 API 수정 또는 팀 선택 UI 제거 필요
  const isLoading = false;

  const [isOpen, setIsOpen] = useState(false);

  const TEAM_OPTIONS: Array<{ id: string; label: string; value: string }> = [];

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
