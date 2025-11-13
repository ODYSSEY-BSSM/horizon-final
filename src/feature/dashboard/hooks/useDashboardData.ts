import { useMemo } from 'react';
import { useUserProfile } from '@/feature/auth/hooks/useSignIn';
import { useAllTeamRoadmaps, useRoadmaps } from '@/feature/roadmap/hooks/useRoadmapQueries';
import type { RoadmapResponse, TeamRoadmapResponse } from '@/feature/roadmap/types';
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
    const myRoadmapsInProgress = roadmapsData?.filter((roadmap) => roadmap.isFavorite).length || 0;

    const teamRoadmapsCount = teamRoadmaps?.length || 0;
    const teamRoadmapsInProgress =
      teamRoadmaps?.filter((roadmap) => roadmap.progress < 100).length || 0;

    return {
      name: userProfile.username,
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
        schoolName: userProfile.school || '',
        hasItem: !!userProfile.school,
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
        id: roadmap.id.toString(),
        title: roadmap.title,
        icon: roadmap.icon.toLowerCase(),
        color: roadmap.color.toLowerCase() as RoadmapColor,
        category,
        steps: 0,
        status,
        progress: roadmap.progress || 0,
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
