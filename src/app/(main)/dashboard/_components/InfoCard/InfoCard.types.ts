import type { RoadmapCategory } from '@/lib/types/dashboard';

export interface InfoCardProps {
  className?: string;
  category: RoadmapCategory;
  count?: number;
  subCount?: number;
  schoolName?: string;
  hasItem?: boolean;
}
