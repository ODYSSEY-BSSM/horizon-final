'use client';

import styled from '@emotion/styled';
import {
  GreetingMessage as GreetingSection,
  InfoCardsGrid,
  RoadmapFormModal,
  RoadmapSection,
  useDashboardData,
} from '@/feature/dashboard';
import { useRoadmapFormFlow } from '@/feature/roadmap/stores/roadmapFormFlow';
import { tokens } from '@/shared/tokens';

const DashboardContent = () => {
  const { userData, roadmapsData, isLoading, error } = useDashboardData();
  const { openModal } = useRoadmapFormFlow();

  const handleAddRoadmap = () => {
    openModal();
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <StyledPageContainer>
        <StyledLoadingContainer>
          <StyledLoadingText>대시보드를 불러오는 중...</StyledLoadingText>
        </StyledLoadingContainer>
      </StyledPageContainer>
    );
  }

  // 에러 상태
  if (error || !userData) {
    return (
      <StyledPageContainer>
        <StyledLoadingContainer>
          <StyledErrorText>대시보드를 불러오는데 실패했습니다.</StyledErrorText>
        </StyledLoadingContainer>
      </StyledPageContainer>
    );
  }

  return (
    <StyledPageContainer>
      <StyledContentContainer>
        <GreetingSection userName={userData.name} />

        <InfoCardsGrid
          myRoadmapsCount={userData.myRoadmapsCount}
          myRoadmapsInProgress={userData.myRoadmapsInProgress}
          teamRoadmapsCount={userData.teamRoadmapsCount}
          teamRoadmapsInProgress={userData.teamRoadmapsInProgress}
          connectedSchool={userData.connectedSchool}
        />

        <RoadmapSection items={roadmapsData} onAddRoadmap={handleAddRoadmap} />
      </StyledContentContainer>

      <RoadmapFormModal />
    </StyledPageContainer>
  );
};

export default DashboardContent;

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  padding: 0 60px 80px;
  box-sizing: border-box;
`;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxlarge};
  width: 100%;
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  width: 100%;
`;

const StyledLoadingText = styled.div`
  color: ${tokens.colors.neutral[600]};
  font-size: 18px;
`;

const StyledErrorText = styled.div`
  color: ${tokens.colors.error[200]};
  font-size: 18px;
`;
