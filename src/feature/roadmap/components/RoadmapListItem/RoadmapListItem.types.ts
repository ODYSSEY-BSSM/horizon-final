import type { Roadmap } from '../../types';

export interface RoadmapListItemProps {
  roadmap: Roadmap;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}
