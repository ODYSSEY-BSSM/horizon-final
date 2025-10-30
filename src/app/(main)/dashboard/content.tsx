'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { DashboardHeader, GreetingSection } from './_components';
import { useDashboard } from './_hooks/useDashboard';
import { useDashboardData } from './_hooks/useDashboardData';
import InfoCardsGrid from './_sections/InfoCardsGrid';
import RoadmapSection from './_sections/RoadmapSection';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  padding: 0 60px 80px;
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxlarge};
  width: 1080px;
`;

export default function DashboardContent() {
  const { handleSearch, handleAddRoadmap } = useDashboard();
  const { userData, roadmapsData } = useDashboardData();

  return (
    <PageContainer>
      <DashboardHeader onSearch={handleSearch} />
      <ContentContainer>
        <GreetingSection userName={userData.name} />

        <InfoCardsGrid
          myRoadmapsCount={userData.myRoadmapsCount}
          myRoadmapsInProgress={userData.myRoadmapsInProgress}
          teamRoadmapsCount={userData.teamRoadmapsCount}
          teamRoadmapsInProgress={userData.teamRoadmapsInProgress}
          connectedSchool={userData.connectedSchool}
        />

        <RoadmapSection items={roadmapsData} onAddRoadmap={handleAddRoadmap} />
      </ContentContainer>
    </PageContainer>
  );
}
