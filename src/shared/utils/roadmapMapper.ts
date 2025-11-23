import type { RoadmapResponse, TeamRoadmapResponse } from '@/feature/roadmap/types/roadmapApi';
import type { RoadmapColor, RoadmapItem, RoadmapStatus } from '@/shared/types';

const mapColorToRoadmapColor = (color: string): RoadmapColor => {
  const colorMap: Record<string, RoadmapColor> = {
    RED: 'red',
    ORANGE: 'orange',
    YELLOW: 'yellow',
    GREEN: 'green',
    BLUE: 'blue',
    PURPLE: 'purple',
  };

  return colorMap[color.toUpperCase()] || 'blue';
};

const calculateStatus = (progress: number): RoadmapStatus => {
  if (progress === 0) {
    return 'not-started';
  }
  if (progress === 100) {
    return 'completed';
  }
  return 'in-progress';
};

export const mapRoadmapResponseToRoadmapItem = (roadmap: RoadmapResponse): RoadmapItem => {
  return {
    id: roadmap.uuid.toString(),
    title: roadmap.roadmapInfo.title,
    icon: roadmap.icon || 'deployed_code',
    color: mapColorToRoadmapColor(roadmap.color),
    category: 'personal',
    steps: 0, // API doesn't provide total steps
    status: calculateStatus(roadmap.progress),
    progress: roadmap.progress,
  };
};

export const mapTeamRoadmapResponseToRoadmapItem = (roadmap: TeamRoadmapResponse): RoadmapItem => {
  return {
    id: roadmap.uuid.toString(),
    title: roadmap.roadmapInfo.title,
    icon: roadmap.icon || 'deployed_code',
    color: mapColorToRoadmapColor(roadmap.color),
    category: 'team',
    steps: 0, // API doesn't provide total steps
    status: calculateStatus(roadmap.progress),
    progress: roadmap.progress,
  };
};
