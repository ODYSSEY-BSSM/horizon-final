import type { Roadmap } from '@/feature/roadmap/types';

export interface RoadmapListItemProps {
  roadmap: Roadmap;
  onClick?: (id: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}
