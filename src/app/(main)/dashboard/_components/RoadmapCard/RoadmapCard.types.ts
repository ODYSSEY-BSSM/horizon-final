import type { RoadmapItem } from '@/lib/types/dashboard';

export interface RoadmapCardProps {
  item: RoadmapItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}
