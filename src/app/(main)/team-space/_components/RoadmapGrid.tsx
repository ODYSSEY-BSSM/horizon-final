'use client';

import styled from '@emotion/styled';
import type { Roadmap } from '@/lib/types/team';
import AddRoadmapCard from './AddRoadmapCard';
import RoadmapListItem from './RoadmapListItem';

interface RoadmapGridProps {
  roadmaps: Roadmap[];
  onAddRoadmap: () => void;
  onRoadmapClick: (roadmap: Roadmap) => void;
}

export default function RoadmapGrid({ roadmaps, onAddRoadmap, onRoadmapClick }: RoadmapGridProps) {
  return (
    <StyledContainer>
      <StyledGrid>
        {roadmaps.map((roadmap) => (
          <RoadmapListItem
            key={roadmap.id}
            roadmap={roadmap}
            onClick={() => onRoadmapClick(roadmap)}
          />
        ))}
        <AddRoadmapCard onClick={onAddRoadmap} />
      </StyledGrid>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
