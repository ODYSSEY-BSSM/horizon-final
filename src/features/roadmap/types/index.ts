export type RoadmapColor =
  | 'RED'
  | 'ORANGE'
  | 'YELLOW'
  | 'GREEN'
  | 'BLUE'
  | 'INDIGO'
  | 'PURPLE'
  | 'PINK'
  | 'GRAY';

export type RoadmapIcon =
  | 'DATABASE'
  | 'CODE'
  | 'BOLT'
  | 'SERVER'
  | 'CLOUD'
  | 'LAYOUT'
  | 'PALETTE'
  | 'ROCKET'
  | 'MESSAGE';

export interface CreateRoadmapRequest {
  title: string;
  description: string;
  categories: string[];
  directoryId: number;
  color: RoadmapColor;
  icon: RoadmapIcon;
}

export interface Roadmap {
  id: number;
  title: string;
  description: string;
  categories: string[];
  lastModifiedAt: string;
  lastAccessedAt: string;
  isFavorite: boolean;
  uuid: string | null;
  color: string;
  icon: string;
  progress: number;
}

export interface TeamRoadmap extends Roadmap {
  teamId: number;
  teamName: string;
}

export interface CreateRoadmapResponse {
  code: string;
  message: string;
  data: Roadmap;
}

export interface GetRoadmapsResponse {
  code: string;
  message: string;
  data: Roadmap[];
}

export interface GetTeamRoadmapsResponse {
  code: string;
  message: string;
  data: TeamRoadmap[];
}
