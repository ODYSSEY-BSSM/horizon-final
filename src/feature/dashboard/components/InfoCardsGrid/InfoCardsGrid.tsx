'use client';

import styled from '@emotion/styled';

import { CARD_CONFIGS, InfoCard } from '@/feature/dashboard';
import type { InfoCardData, RoadmapCategory } from '@/feature/dashboard/types/dashboard';
import { tokens } from '@/shared/tokens';

interface InfoCardsGridProps {
  infoData: InfoCardData;
}

const InfoCardsGrid: React.FC<InfoCardsGridProps> = ({ infoData }) => {
  const visibleCategories = Object.keys(CARD_CONFIGS) as RoadmapCategory[];

  return (
    <StyledGridContainer>
      {visibleCategories.map((category) => (
        <InfoCard key={category} category={category} {...infoData[category]} />
      ))}
    </StyledGridContainer>
  );
};

export default InfoCardsGrid;

const StyledGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${tokens.spacing.large};
`;
