import { useMemo } from 'react';
import { useUserProfile } from '@/feature/auth/hooks/useSignIn';
import { useAllTeamRoadmaps, useRoadmaps } from '@/feature/roadmap/hooks/useRoadmapQueries';
import type { AnyRoadmapResponse } from '@/feature/roadmap/types';
import type { RoadmapColor } from '@/shared/types/roadmap';

export const useDashboardData = () => {
  const { data: userProfile, isLoading: isLoadingUser, error: userError } = useUserProfile();

  const teamIds = useMemo(() => userProfile?.teams?.map((team) => team.id) || [], [userProfile]);

  const {
    data: personalRoadmaps,
    isLoading: isLoadingPersonal,
    error: personalError,
  } = useRoadmaps();
  const {
    data: teamRoadmaps,
    isLoading: isLoadingTeam,
    error: teamError,
  } = useAllTeamRoadmaps(teamIds);

  const roadmapsData = useMemo(() => {
    const allRoadmaps: AnyRoadmapResponse[] = [
      ...(personalRoadmaps || []),
      ...(teamRoadmaps || []),
    ];
    return allRoadmaps.sort((a, b) => {
      const dateA = new Date(a.lastAccessedAt ?? 0).getTime();
      const dateB = new Date(b.lastAccessedAt ?? 0).getTime();
      return dateB - dateA;
    });
  }, [personalRoadmaps, teamRoadmaps]);

  const userData = useMemo(() => {
    if (!userProfile) {
      return null;
    }

    const myRoadmapsCount = personalRoadmaps?.length || 0;
    // 진행 중 = progress가 0보다 크고 100 미만인 로드맵
    const myRoadmapsInProgress =
      personalRoadmaps?.filter((roadmap) => roadmap.progress > 0 && roadmap.progress < 100)
        .length || 0;
    const myFavoriteInProgress =
      personalRoadmaps?.filter(
        (roadmap) => roadmap.isFavorite && roadmap.progress > 0 && roadmap.progress < 100,
      ).length || 0;

    const teamRoadmapsInProgress =
      teamRoadmaps?.filter((roadmap) => roadmap.progress > 0 && roadmap.progress < 100).length || 0;

    // 팀 로드맵은 isFavorite가 없으므로 teamFavoriteInProgress는 항상 0
    const teamFavoriteInProgress = 0;

    return {
      name: userProfile.username,
      'my-roadmap-count': { count: myRoadmapsCount },
      'my-roadmap-in-progress': {
        count: myRoadmapsInProgress,
        subCount: myFavoriteInProgress,
      },
      'team-roadmap-count': { count: teamRoadmaps?.length || 0 },
      'team-roadmap-in-progress': {
        count: teamRoadmapsInProgress,
        subCount: teamFavoriteInProgress,
      },
      'connected-school': {
        schoolName: userProfile.school || '',
        hasItem: !!userProfile.school,
      },
    };
  }, [userProfile, personalRoadmaps, teamRoadmaps]);

  const roadmaps = useMemo(() => {
    return roadmapsData.map((roadmap) => {
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
    isLoading: isLoadingUser || isLoadingPersonal || isLoadingTeam,
    error: userError || personalError || teamError,
  };
};
