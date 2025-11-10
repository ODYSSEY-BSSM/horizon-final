import type { RoadmapItem } from '@/feature/dashboard/types/dashboard';
import type { Roadmap } from '@/feature/roadmap';
import type { Roadmap as TeamRoadmap } from '@/feature/team/types/team';
import type { RoadmapColor } from '@/shared/types/roadmap';

const isValidRoadmapColor = (color: string): color is RoadmapColor => {
  return ['red', 'orange', 'yellow', 'green', 'blue', 'purple'].includes(color);
};

export const mapTeamRoadmapToRoadmap = (teamRoadmap: TeamRoadmap): Roadmap => {
  const color =
    teamRoadmap.color && isValidRoadmapColor(teamRoadmap.color) ? teamRoadmap.color : 'blue';

  return {
    id: teamRoadmap.id,
    name: teamRoadmap.name,
    description: teamRoadmap.description,
    icon: teamRoadmap.icon || 'deployed_code',
    color,
    type: teamRoadmap.type || 'team',
    totalSteps: teamRoadmap.totalSteps || 0,
    completedSteps: teamRoadmap.completedSteps || 0,
    status: teamRoadmap.status || 'in-progress',
    progress: teamRoadmap.progress || 0,
    folderId: teamRoadmap.folderId,
    createdAt: teamRoadmap.createdAt,
    updatedAt: teamRoadmap.updatedAt,
  };
};

export const mapTeamRoadmapToRoadmapItem = (teamRoadmap: TeamRoadmap): RoadmapItem => {
  return {
    id: teamRoadmap.id,
    title: teamRoadmap.name,
    icon: teamRoadmap.icon || 'deployed_code',
    color: teamRoadmap.color && isValidRoadmapColor(teamRoadmap.color) ? teamRoadmap.color : 'blue',
    category: teamRoadmap.type === 'personal' ? 'personal' : 'team',
    steps: teamRoadmap.totalSteps || 0,
    status: teamRoadmap.status || 'in-progress',
    progress: teamRoadmap.progress || 0,
  };
};
