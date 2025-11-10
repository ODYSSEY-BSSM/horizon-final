import type { Roadmap } from '@/feature/roadmap/types';

export interface RoadmapListItemProps {
  roadmap: Roadmap;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}
