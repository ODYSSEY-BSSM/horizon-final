import styled from '@emotion/styled';
import { InfoCard } from '@/feature/dashboard';
import { tokens } from '@/shared/tokens';

interface InfoCardsGridProps {
  myRoadmapsCount: number;
  myRoadmapsInProgress: number;
  teamRoadmapsCount: number;
  teamRoadmapsInProgress: number;
  connectedSchool: string;
}

const InfoCardsGrid = ({
  myRoadmapsCount,
  myRoadmapsInProgress,
  teamRoadmapsCount,
  teamRoadmapsInProgress,
  connectedSchool,
}: InfoCardsGridProps) => {
  return (
    <StyledInfoCardsGrid>
      <InfoCard
        key="my-roadmaps"
        category="my-roadmaps"
        count={myRoadmapsCount}
        subCount={myRoadmapsInProgress}
        hasItem={true}
      />
      <InfoCard
        key="team-roadmaps"
        category="team-roadmaps"
        count={teamRoadmapsCount}
        subCount={teamRoadmapsInProgress}
        hasItem={true}
      />
      <InfoCard
        key="connected-school"
        category="connected-school"
        schoolName={connectedSchool}
        hasItem={true}
      />
    </StyledInfoCardsGrid>
  );
};

export default InfoCardsGrid;

const StyledInfoCardsGrid = styled.div`
  display: flex;
  gap: ${tokens.spacing.xxlarge};
  width: 100%;
`;
