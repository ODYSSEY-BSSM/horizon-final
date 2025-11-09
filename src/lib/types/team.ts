export type Team = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
};

export type TeamFolder = {
  id: string;
  teamId: string;
  name: string;
  description: string;
  progress: number;
  roadmapCount: number;
  createdRoadmapCount: number;
  lastRoadmapName?: string;
};

export type Roadmap = {
  id: string;
  folderId: string;
  name: string;
  description: string;
  progress?: number;
  totalSteps?: number;
  completedSteps?: number;
  type?: 'personal' | 'team';
  status?: 'in-progress' | 'completed';
  icon?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FilterTab = {
  label: string;
  value: string;
};
