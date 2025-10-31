import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import InfoCard from '../_components/InfoCard';

interface InfoCardsGridProps {
  myRoadmapsCount: number;
  myRoadmapsInProgress: number;
  teamRoadmapsCount: number;
  teamRoadmapsInProgress: number;
  connectedSchool: string;
}

const StyledInfoCardsGrid = styled.div`
  display: flex;
  gap: ${tokens.spacing.xxlarge};
  width: 100%;
`;

export default function InfoCardsGrid({
  myRoadmapsCount,
  myRoadmapsInProgress,
  teamRoadmapsCount,
  teamRoadmapsInProgress,
  connectedSchool,
}: InfoCardsGridProps) {
  return (
    <StyledInfoCardsGrid>
      <InfoCard
        category="my-roadmaps"
        count={myRoadmapsCount}
        subCount={myRoadmapsInProgress}
        hasItem={true}
      />
      <InfoCard
        category="team-roadmaps"
        count={teamRoadmapsCount}
        subCount={teamRoadmapsInProgress}
        hasItem={true}
      />
      <InfoCard category="connected-school" schoolName={connectedSchool} hasItem={true} />
    </StyledInfoCardsGrid>
  );
}
