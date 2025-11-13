import { useMemo } from 'react';
import type { Team, TeamFolder } from '@/feature/team/types/team';
import { decodeInviteCode } from '../utils/inviteCode';
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
      id: team.id.toString(),
      name: team.name,
      description: '',
      memberCount: team.members?.length || 0,
      createdAt: new Date().toISOString(),
      inviteCode: team.inviteCode,
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

  const addTeam = (data: { name: string; description: string }): Promise<Team> => {
    return createTeamMutation.mutateAsync(data).then((teamResponse) => ({
      id: teamResponse.id.toString(),
      name: teamResponse.name,
      description: '',
      memberCount: teamResponse.members?.length || 1,
      createdAt: new Date().toISOString(),
      inviteCode: teamResponse.inviteCode,
    }));
  };

  const joinTeam = async (
    inviteCode: string,
    callbacks?: { onSuccess?: () => void; onError?: (error: string) => void },
  ): Promise<{ success: boolean; teamId?: number }> => {
    try {
      await applyToTeamMutation.mutateAsync({ inviteCode });
      callbacks?.onSuccess?.();

      const teamIdStr = decodeInviteCode(inviteCode);
      const teamId = teamIdStr ? parseInt(teamIdStr, 10) : undefined;

      return {
        success: true,
        teamId: teamId && !Number.isNaN(teamId) ? teamId : undefined,
      };
    } catch (error) {
      callbacks?.onError?.('팀 가입에 실패했습니다.');
      return {
        success: false,
      };
    }
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
