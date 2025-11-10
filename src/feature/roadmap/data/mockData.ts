import type { RoadmapColor } from '@/shared/types/roadmap';

export interface MockRoadmap {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  lastModified: string;
  isPublic: boolean;
  updatedAt: string;
  type: 'my' | 'team';
  icon: string;
  color: RoadmapColor;
}

const ICONS = ['deployed_code', 'language', 'code', 'terminal', 'integration_instructions', 'web'];
const COLORS: RoadmapColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

export const MOCK_ROADMAPS: MockRoadmap[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  title: 'React 마스터 로드맵',
  description: 'React 학습 로드맵',
  thumbnail: '',
  progress: 50,
  lastModified: '2024-01-15',
  updatedAt: '2024-01-15',
  isPublic: i % 3 === 0,
  type: i % 2 === 0 ? ('my' as const) : ('team' as const),
  icon: ICONS[i % ICONS.length],
  color: COLORS[i % COLORS.length],
}));
