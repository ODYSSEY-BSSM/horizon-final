import { useMemo } from 'react';
import { useUserProfile } from '@/feature/auth/hooks/useSignIn';
import { useRoadmaps } from '@/feature/roadmap/hooks/useRoadmapQueries';
import type { RoadmapColor } from '@/shared/types/roadmap';

export const useDashboardData = () => {
  const { data: userProfile, isLoading: isLoadingUser, error: userError } = useUserProfile();

  const { data: roadmapsData, isLoading: isLoadingRoadmaps, error: roadmapsError } = useRoadmaps();

  const userData = useMemo(() => {
    if (!userProfile) {
      return null;
    }

    const myRoadmapsCount = roadmapsData?.length || 0;
    const myRoadmapsInProgress = roadmapsData?.filter((roadmap) => roadmap.isFavorite).length || 0;

    return {
      name: userProfile.username,
      myRoadmapsCount,
      myRoadmapsInProgress,
      teamRoadmapsCount: userProfile.teams?.length || 0,
      teamRoadmapsInProgress: 0, // TODO: 팀 로드맵 진행 중 개수 계산
      connectedSchool: userProfile.school || '',
    };
  }, [userProfile, roadmapsData]);

  const roadmaps = useMemo(() => {
    if (!roadmapsData) {
      return [];
    }

    return roadmapsData.map((roadmap) => {
      // teamId가 있으면 팀 로드맵, 없으면 개인 로드맵
      const isTeamRoadmap = 'teamId' in roadmap && roadmap.teamId !== undefined;

      const category = isTeamRoadmap ? ('team' as const) : ('personal' as const);
      const status = 'in-progress' as const;

      return {
        id: roadmap.id.toString(),
        title: roadmap.title,
        icon: roadmap.icon.toLowerCase(),
        color: roadmap.color.toLowerCase() as RoadmapColor,
        category,
        steps: 0, // TODO: API에서 단계 정보를 제공하면 업데이트 필요
        status,
        progress: roadmap.progress || 0,
      };
    });
  }, [roadmapsData]);

  return {
    userData,
    roadmapsData: roadmaps,
    isLoading: isLoadingUser || isLoadingRoadmaps,
    error: userError || roadmapsError,
  };
};
