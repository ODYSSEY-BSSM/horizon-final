import { useMemo } from 'react';
import { useTeams } from './useTeamQueries';
import { useTeamFolders } from '@/feature/folder/hooks/useFolderQueries';
import type { Team, TeamFolder } from '@/feature/team/types/team';

export const useTeamSpaceData = () => {
  // 실제 API로 팀 목록 조회
  const { data: teamsData, isLoading: isLoadingTeams } = useTeams();

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
    // TODO: 팀별 폴더 조회 API 연동 필요
    // const { data: foldersData } = useTeamFolders(teamId);
    // 현재는 빈 배열 반환
    return [];
  };

  const getFolderRoadmaps = (folderId: string) => {
    // TODO: 폴더별 로드맵 조회 API 연동 필요
    return [];
  };

  const addFolder = (data: { teamId: string; name: string; description: string }) => {
    // TODO: 폴더 생성 API 연동 필요
    console.warn('폴더 생성 API가 아직 구현되지 않았습니다:', data);
  };

  const addTeam = (data: { name: string; description: string }): Team => {
    // TODO: 팀 생성 API 연동 필요
    console.warn('팀 생성 API가 아직 구현되지 않았습니다:', data);
    // 임시로 더미 팀 반환
    return {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };
  };

  const joinTeam = (inviteCode: string): { success: boolean; team?: Team } => {
    // TODO: 팀 참여 API 연동 필요
    console.warn('팀 참여 API가 아직 구현되지 않았습니다:', inviteCode);
    // 임시로 성공 응답 반환
    return {
      success: true,
      team: {
        id: Date.now().toString(),
        name: '참여한 팀',
        description: '',
        memberCount: 2,
        createdAt: new Date().toISOString(),
      },
    };
  };

  return {
    teams,
    folders: [] as TeamFolder[], // TODO: 팀 폴더 API 연동 필요
    roadmaps: [], // TODO: 팀 로드맵 API 연동 필요
    getTeamFolders,
    getFolderRoadmaps,
    addFolder,
    addTeam,
    joinTeam,
    isLoading: isLoadingTeams,
  };
};
