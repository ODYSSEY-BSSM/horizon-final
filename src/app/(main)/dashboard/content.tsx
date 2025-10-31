'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { useDashboard } from './_hooks/useDashboard';
import { useDashboardData } from './_hooks/useDashboardData';
import DashboardHeader from './_sections/DashboardHeader';
import GreetingSection from './_sections/GreetingSection';
import InfoCardsGrid from './_sections/InfoCardsGrid';
import RoadmapSection from './_sections/RoadmapSection';

const DashboardContent = () => {
  const { handleSearch, handleAddRoadmap } = useDashboard();
  const { userData, roadmapsData } = useDashboardData();

  return (
    <StyledPageContainer>
      <DashboardHeader onSearch={handleSearch} />
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
  max-width: 1080px;
`;
