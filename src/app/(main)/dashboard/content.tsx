'use client';

import styled from '@emotion/styled';
import { useRoadmapFormFlow } from '@/lib/stores/roadmapFormFlow';
import { tokens } from '@/shared/tokens';
import RoadmapFormModal from './_forms/RoadmapFormModal/RoadmapFormModal';
import { useDashboardData } from './_hooks/useDashboardData';
import GreetingSection from './_sections/GreetingSection';
import InfoCardsGrid from './_sections/InfoCardsGrid';
import RoadmapSection from './_sections/RoadmapSection';

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
  padding: 40px 60px 80px;
  box-sizing: border-box;
`;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxlarge};
  width: 100%;
`;
