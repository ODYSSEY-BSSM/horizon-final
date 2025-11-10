import { useMemo } from 'react';
import { MOCK_ROADMAPS } from '../data/mockData';

export const useDashboardData = () => {
  // TODO: API 연동 시 실제 데이터 fetching 로직으로 교체
  // const { data: userData } = useQuery({ queryKey: ['user'], queryFn: fetchUser });
  // const { data: roadmapsData } = useQuery({ queryKey: ['roadmaps'], queryFn: fetchRoadmaps });

  const userData = useMemo(
    () => ({
      name: '홍길동',
      myRoadmapsCount: 10,
      myRoadmapsInProgress: 8,
      teamRoadmapsCount: 5,
      teamRoadmapsInProgress: 3,
      connectedSchool: '부산소프트웨어마이스터고등학교',
    }),
    [],
  );

  const roadmapsData = useMemo(() => MOCK_ROADMAPS, []);

  return {
    userData,
    roadmapsData,
    isLoading: false,
    error: null,
  };
};
