'use client';

import styled from '@emotion/styled';
import type { Roadmap, RoadmapColor } from '@/feature/roadmap';
import { RoadmapListItem } from '@/feature/roadmap';
import { AddRoadmapCard } from '@/feature/team';
import type { Roadmap as TeamRoadmap } from '@/feature/team/types/team';

interface RoadmapGridProps {
  roadmaps: TeamRoadmap[];
  onAddRoadmap: () => void;
  onRoadmapClick: (roadmap: TeamRoadmap) => void;
}

export default function RoadmapGrid({ roadmaps, onAddRoadmap, onRoadmapClick }: RoadmapGridProps) {
  return (
    <StyledContainer>
      <StyledGrid>
        {roadmaps.map((roadmap) => {
          const unifiedRoadmap: Roadmap = {
            id: roadmap.id,
            name: roadmap.name,
            description: roadmap.description,
            icon: roadmap.icon || 'deployed_code',
            color: roadmap.color || 'blue',
            type: roadmap.type || 'team',
            totalSteps: roadmap.totalSteps || 0,
            completedSteps: roadmap.completedSteps || 0,
            status: roadmap.status || 'in-progress',
            progress: roadmap.progress || 0,
            folderId: roadmap.folderId,
            createdAt: roadmap.createdAt,
            updatedAt: roadmap.updatedAt,
          };
          return (
            <RoadmapListItem
              key={roadmap.id}
              roadmap={unifiedRoadmap}
              onClick={() => onRoadmapClick(roadmap)}
            />
          );
        })}
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
