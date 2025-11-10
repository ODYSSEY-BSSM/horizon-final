import { useMemo } from 'react';
import { useTeams, useCreateTeam, useApplyToTeam } from './useTeamQueries';
import type { Team, TeamFolder } from '@/feature/team/types/team';

export const useTeamSpaceData = () => {
  const { data: teamsData, isLoading: isLoadingTeams } = useTeams();

  const createTeamMutation = useCreateTeam();

  const applyToTeamMutation = useApplyToTeam();

  const teams: Team[] = useMemo(() => {
    if (!teamsData) return [];

    return teamsData.map((team) => ({
      id: team.uuid.toString(),
      name: team.name,
      description: team.description || '',
      memberCount: team.memberCount,
      createdAt: team.createdAt,
    }));
  }, [teamsData]);

  const getTeamFolders = (teamId: string | null, filterTab?: string): TeamFolder[] => {
    return [];
  };

  const getFolderRoadmaps = (folderId: string) => {
    return [];
  };

  const addFolder = (data: { teamId: string; name: string; description: string }) => {
    console.warn('useCreateTeamFolder 훅을 직접 사용해주세요:', data);
  };

  const addTeam = (data: { name: string; description: string }): Team => {
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
    applyToTeamMutation.mutate({ inviteCode });

    return {
      success: true,
      team: {
        id: Date.now().toString(),
        name: '참여 신청한 팀',
        description: '',
        memberCount: 2,
        createdAt: new Date().toISOString(),
      },
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

