import { useMemo } from 'react';
import { useUserProfile } from '@/feature/auth/hooks/useSignIn';
import { useAllTeamRoadmaps, useRoadmaps } from '@/feature/roadmap/hooks/useRoadmapQueries';
import type { RoadmapResponse, TeamRoadmapResponse } from '@/feature/roadmap/types';
import type { RoadmapColor } from '@/shared/types/roadmap';

export const useDashboardData = () => {
  const { data: userProfile, isLoading: isLoadingUser, error: userError } = useUserProfile();

  // teams는 이제 string[] (팀 이름 배열)이므로 teamIds를 빈 배열로 설정
  const teamIds = useMemo(() => [] as number[], []);

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

  const roadmapsData: RoadmapResponse[] = useMemo(() => {
    return personalRoadmaps || [];
  }, [personalRoadmaps]);

  const userData = useMemo(() => {
    if (!userProfile) {
      return null;
    }
    const myRoadmapsCount = roadmapsData?.length || 0;
    const myRoadmapsInProgress =
      roadmapsData?.filter((roadmap) => roadmap.roadmapInfo.isFavorite).length || 0;

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

  const roadmaps = useMemo(() => {
    const combinedRoadmaps: (RoadmapResponse | TeamRoadmapResponse)[] = [
      ...(personalRoadmaps || []),
      ...(teamRoadmaps || []),
    ];

    return combinedRoadmaps.map((roadmap) => {
      const isTeamRoadmap = 'teamId' in roadmap;

      const category = isTeamRoadmap ? ('team' as const) : ('personal' as const);
      const status = 'in-progress' as const;

      return {
        id: roadmap.roadmapInfo.id.toString(),
        title: roadmap.roadmapInfo.title,
        icon: roadmap.icon.toLowerCase(),
        color: roadmap.color.toLowerCase() as RoadmapColor,
        category,
        steps: 0,
        status,
        progress: roadmap.progress,
      };
    });
  }, [personalRoadmaps, teamRoadmaps]);

  return {
    userData,
    roadmapsData: roadmaps,
    isLoading: isLoadingUser || isLoadingPersonal || isLoadingTeamRoadmaps,
    error: userError || personalError || teamError,
  };
};
