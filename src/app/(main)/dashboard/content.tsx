'use client';

import styled from '@emotion/styled';
import { useRoadmapFormFlow } from '@/lib/stores/roadmapFormFlow';
import { tokens } from '@/shared/tokens';
import {
  RoadmapFormModal,
  useDashboardData,
  GreetingMessage as GreetingSection,
  InfoCardsGrid,
  RoadmapSection,
} from '@/feature/dashboard';

const DashboardContent = () => {
  const { userData, roadmapsData } = useDashboardData();
  const { openModal } = useRoadmapFormFlow();

  const handleAddRoadmap = () => {
    openModal();
  };

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
