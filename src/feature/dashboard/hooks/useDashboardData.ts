import { useRoadmaps } from '@/feature/roadmap/hooks/useRoadmapQueries';
import { useUserProfile } from '@/feature/auth/hooks/useSignIn';
import { useMemo } from 'react';
import type { RoadmapColor } from '@/shared/types/roadmap';

export const useDashboardData = () => {
  // 사용자 프로필 조회
  const { data: userProfile, isLoading: isLoadingUser, error: userError } = useUserProfile();

  // 개인 로드맵 조회
  const { data: roadmapsData, isLoading: isLoadingRoadmaps, error: roadmapsError } = useRoadmaps();

  // 사용자 데이터 가공
  const userData = useMemo(() => {
    if (!userProfile) return null;

    // 로드맵 통계 계산
    const myRoadmapsCount = roadmapsData?.length || 0;
    const myRoadmapsInProgress = roadmapsData?.filter(
      (roadmap) => roadmap.isFavorite // 진행 중 판단 기준은 프로젝트 요구사항에 맞게 수정 필요
    ).length || 0;

    return {
      name: userProfile.username,
      myRoadmapsCount,
      myRoadmapsInProgress,
      teamRoadmapsCount: userProfile.teams?.length || 0,
      teamRoadmapsInProgress: 0, // TODO: 팀 로드맵 진행 중 개수 계산
      connectedSchool: userProfile.school || '',
    };
  }, [userProfile, roadmapsData]);

  // 로드맵 데이터를 UI 타입으로 변환
  const roadmaps = useMemo(() => {
    if (!roadmapsData) return [];

    return roadmapsData.map((roadmap) => ({
      id: roadmap.uuid.toString(),
      title: roadmap.name,
      icon: roadmap.icon.toLowerCase(),
      color: roadmap.color.toLowerCase() as RoadmapColor,
      category: 'personal' as const,
      steps: 0, // TODO: API에서 단계 정보를 제공하면 업데이트 필요
      status: 'in-progress' as const,
      progress: 0,
    }));
  }, [roadmapsData]);

  return {
    userData,
    roadmapsData: roadmaps,
    isLoading: isLoadingUser || isLoadingRoadmaps,
    error: userError || roadmapsError,
  };
};
