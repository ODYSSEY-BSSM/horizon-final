import { useMemo } from 'react';
import { useUserProfile } from '@/feature/auth/hooks/useSignIn';
import { useRootFolder } from '@/feature/folder/hooks/useFolderQueries';
import { useAllTeamRoadmaps, useRoadmaps } from '@/feature/roadmap/hooks/useRoadmapQueries';
import type { RoadmapResponse, TeamRoadmapResponse } from '@/feature/roadmap/types';
import { useTeams } from '@/feature/team/hooks/useTeamQueries';
import type { RoadmapColor } from '@/shared/types/roadmap';

// 디렉토리 순회를 위한 로컬 타입 (API 응답 구조)
interface DirectoryWithRoadmaps {
  id?: number;
  name?: string;
  roadmaps?: Array<{ id?: number }>;
  directories?: DirectoryWithRoadmaps[];
}

export const useDashboardData = () => {
  const { data: userProfile, isLoading: isLoadingUser, error: userError } = useUserProfile();

  // 전체 팀 목록 가져오기
  const { data: teams, isLoading: isLoadingTeams } = useTeams();

  // 유저가 속한 팀의 ID만 추출
  const teamIds = useMemo(() => {
    if (!teams || !userProfile?.teams) {
      return [];
    }
    // userProfile.teams는 팀 이름 배열, teams는 TeamInfo[] (id, name)
    // 유저가 속한 팀의 이름과 매칭되는 팀 ID만 추출
    return teams.filter((team) => userProfile.teams.includes(team.name)).map((team) => team.id);
  }, [teams, userProfile?.teams]);

  const {
    data: personalRoadmaps,
    isLoading: isLoadingPersonal,
    error: personalError,
  } = useRoadmaps();
  const {
    data: teamRoadmaps,
    isLoading: isLoadingTeamRoadmaps,
    error: teamError,
  } = useAllTeamRoadmaps(teamIds);
  const { data: rootFolder, isLoading: isLoadingFolder } = useRootFolder();

  const roadmapsData: RoadmapResponse[] = useMemo(() => {
    return personalRoadmaps || [];
  }, [personalRoadmaps]);

  const userData = useMemo(() => {
    if (!userProfile) {
      return null;
    }
    const myRoadmapsCount = roadmapsData?.length || 0;
    const myRoadmapsInProgress =
      roadmapsData?.filter((roadmap) => roadmap.progress > 0 && roadmap.progress < 100).length || 0;

    const teamRoadmapsCount = teamRoadmaps?.length || 0;
    const teamRoadmapsInProgress =
      teamRoadmaps?.filter((roadmap) => roadmap.progress < 100).length || 0;

    return {
      name: userProfile.userInfo.username,
      'my-roadmap-count': { count: myRoadmapsCount },
      'my-roadmap-in-progress': {
        count: myRoadmapsInProgress,
        subCount: myRoadmapsInProgress,
      },
      'team-roadmap-count': { count: teamRoadmapsCount },
      'team-roadmap-in-progress': {
        count: teamRoadmapsInProgress,
        subCount: teamRoadmapsInProgress,
      },
      'connected-school': {
        schoolName: userProfile.school,
        hasItem: userProfile.isConnectedSchool,
      },
    };
  }, [userProfile, roadmapsData, teamRoadmaps]);

  // 로드맵 ID와 디렉토리 정보를 매핑하는 맵 생성
  const roadmapToDirectoryMap = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>();
    if (!rootFolder?.directories) {
      return map;
    }

    const traverse = (directories: DirectoryWithRoadmaps[]): void => {
      for (const dir of directories) {
        if (dir.roadmaps && dir.id != null && dir.name != null) {
          for (const roadmap of dir.roadmaps) {
            if (roadmap.id != null) {
              map.set(roadmap.id, { id: dir.id, name: dir.name });
            }
          }
        }
        if (dir.directories?.length) {
          traverse(dir.directories);
        }
      }
    };

    traverse(rootFolder.directories);
    return map;
  }, [rootFolder]);

  const roadmaps = useMemo(() => {
    const combinedRoadmaps: (RoadmapResponse | TeamRoadmapResponse)[] = [
      ...(personalRoadmaps || []),
      ...(teamRoadmaps || []),
    ];

    return combinedRoadmaps.map((roadmap) => {
      const isTeamRoadmap = 'teamId' in roadmap;

      const category = isTeamRoadmap ? ('team' as const) : ('personal' as const);
      const status = 'in-progress' as const;
      const folderInfo = roadmapToDirectoryMap.get(roadmap.roadmapInfo.id);

      return {
        id: roadmap.roadmapInfo.id.toString(),
        title: roadmap.roadmapInfo.title,
        description: roadmap.roadmapInfo.description,
        icon: roadmap.icon.toLowerCase(),
        color: roadmap.color.toLowerCase() as RoadmapColor,
        category,
        steps: 0,
        status,
        progress: roadmap.progress,
        folderId: folderInfo?.id.toString(),
        folderName: folderInfo?.name,
      };
    });
  }, [personalRoadmaps, teamRoadmaps, roadmapToDirectoryMap]);

  return {
    userData,
    roadmapsData: roadmaps,
    isLoading:
      isLoadingUser ||
      isLoadingPersonal ||
      isLoadingTeams ||
      isLoadingTeamRoadmaps ||
      isLoadingFolder,
    error: userError || personalError || teamError,
  };
};
