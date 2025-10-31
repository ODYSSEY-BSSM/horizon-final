import type { RoadmapItem } from '@/lib/types/dashboard';
import RoadmapList from '../RoadmapList';

interface RoadmapSectionProps {
  items: RoadmapItem[];
  onAddRoadmap: () => void;
}

export default function RoadmapSection({ items, onAddRoadmap }: RoadmapSectionProps) {
  return <RoadmapList items={items} onAddRoadmap={onAddRoadmap} />;
}
