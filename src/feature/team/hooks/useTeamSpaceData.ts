import { useMemo } from 'react';
import type { Team, TeamFolder } from '@/feature/team/types/team';
import { useApplyToTeam, useCreateTeam, useTeams } from './useTeamQueries';

export const useTeamSpaceData = () => {
  const { data: teamsData, isLoading: isLoadingTeams } = useTeams();

  const createTeamMutation = useCreateTeam();

  const applyToTeamMutation = useApplyToTeam();

  const teams: Team[] = useMemo(() => {
    if (!teamsData) {
      return [];
    }

    return teamsData.map((team) => ({
      id: team.uuid.toString(),
      name: team.name,
      description: team.description || '',
      memberCount: team.memberCount,
      createdAt: team.createdAt,
    }));
  }, [teamsData]);

  const getTeamFolders = (_teamId: string | null, _filterTab?: string): TeamFolder[] => {
    return [];
  };

  const getFolderRoadmaps = (_folderId: string) => {
    return [];
  };

  const addFolder = (_data: { teamId: string; name: string; description: string }) => {
    // TODO: 폴더 추가 기능 구현
  };

  const addTeam = (data: { name: string; description: string }): Team => {
    // TODO: 팀 추가 기능 구현
    createTeamMutation.mutate(data);

    return {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };
  };

  const joinTeam = (inviteCode: string): { success: boolean; team?: Team } => {
    // TODO: inviteCode에서 teamId 추출 또는 별도 API 호출 필요
    const teamId = 1; // 임시
    applyToTeamMutation.mutate({ teamId, data: { inviteCode } });

    // Do not return a fake team object to prevent redirecting to a 404 page.
    // The calling component should handle the success case by showing a message instead of redirecting.
    return {
      success: true,
      team: undefined,
    };
  };

  return {
    teams,
    folders: [] as TeamFolder[],
    roadmaps: [],
    getTeamFolders,
    getFolderRoadmaps,
    addFolder,
    addTeam,
    joinTeam,
    isLoading: isLoadingTeams,
    isCreatingTeam: createTeamMutation.isPending,
    isApplyingToTeam: applyToTeamMutation.isPending,
  };
};
