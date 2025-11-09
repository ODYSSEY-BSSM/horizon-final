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

export type FilterTab = 'recent' | 'progress' | 'name';
