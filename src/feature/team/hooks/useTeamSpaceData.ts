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

  const joinTeam = (
    inviteCode: string,
    callbacks?: { onSuccess?: () => void; onError?: (error: string) => void },
  ): { success: boolean; teamId?: number } => {
    // 초대 코드에서 팀 ID 추출
    const teamIdStr = decodeInviteCode(inviteCode);

    if (!teamIdStr) {
      return {
        success: false,
      };
    }

    const teamId = parseInt(teamIdStr, 10);
    if (Number.isNaN(teamId)) {
      return {
        success: false,
      };
    }

    // 팀 가입 신청
    applyToTeamMutation.mutate(teamId, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: () => {
        callbacks?.onError?.('팀 가입 신청에 실패했습니다.');
      },
    });

    return {
      success: true,
      teamId,
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
