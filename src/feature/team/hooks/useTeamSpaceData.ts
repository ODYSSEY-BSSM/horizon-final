import { useMemo } from 'react';
import { useTeams, useCreateTeam, useApplyToTeam } from './useTeamQueries';
import type { Team, TeamFolder } from '@/feature/team/types/team';

export const useTeamSpaceData = () => {
  // 실제 API로 팀 목록 조회
  const { data: teamsData, isLoading: isLoadingTeams } = useTeams();

  // 팀 생성 mutation
  const createTeamMutation = useCreateTeam();

  // 팀 참여 mutation
  const applyToTeamMutation = useApplyToTeam();

  // UI 타입으로 변환
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
    // NOTE: React 훅은 여기서 사용할 수 없습니다.
    // 각 페이지에서 useTeamFolders(teamName) 훅을 직접 사용해주세요.
    return [];
  };

  const getFolderRoadmaps = (folderId: string) => {
    // NOTE: React 훅은 여기서 사용할 수 없습니다.
    // 각 페이지에서 useTeamFolderContent(teamName, folderId) 훅을 직접 사용해주세요.
    return [];
  };

  const addFolder = (data: { teamId: string; name: string; description: string }) => {
    // NOTE: React 훅은 여기서 사용할 수 없습니다.
    // 각 페이지에서 useCreateTeamFolder(teamName) 훅을 직접 사용해주세요.
    console.warn('useCreateTeamFolder 훅을 직접 사용해주세요:', data);
  };

  const addTeam = (data: { name: string; description: string }): Team => {
    // 팀 생성 mutation 실행
    createTeamMutation.mutate(data);

    // mutation이 비동기이므로 임시 데이터 반환
    // 실제 데이터는 mutation onSuccess에서 처리됨
    return {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };
  };

  const joinTeam = (inviteCode: string): { success: boolean; team?: Team } => {
    // 팀 신청 mutation 실행
    applyToTeamMutation.mutate({ inviteCode });

    // mutation이 비동기이므로 임시 응답 반환
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
    folders: [] as TeamFolder[], // 각 페이지에서 useTeamFolders 훅 사용
    roadmaps: [], // 각 페이지에서 useTeamRoadmaps 훅 사용
    getTeamFolders,
    getFolderRoadmaps,
    addFolder,
    addTeam,
    joinTeam,
    isLoading: isLoadingTeams,
    // mutation states
    isCreatingTeam: createTeamMutation.isPending,
    isApplyingToTeam: applyToTeamMutation.isPending,
  };
};

