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
      description: '', // Swagger에 description 필드 없음
      memberCount: team.members?.length || 0,
      createdAt: new Date().toISOString(), // Swagger에 createdAt 필드 없음
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
    // 팀 가입 (초대 코드 사용)
    applyToTeamMutation.mutate({ inviteCode }, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: () => {
        callbacks?.onError?.('팀 가입에 실패했습니다.');
      },
    });

    // 초대 코드에서 팀 ID 추출 (선택사항)
    const teamIdStr = decodeInviteCode(inviteCode);
    const teamId = teamIdStr ? parseInt(teamIdStr, 10) : undefined;

    return {
      success: true,
      teamId: teamId && !Number.isNaN(teamId) ? teamId : undefined,
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
