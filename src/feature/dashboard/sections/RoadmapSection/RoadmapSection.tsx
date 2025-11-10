import { RoadmapList } from '@/feature/dashboard/components/RoadmapList';
import type { RoadmapItem } from '@/feature/dashboard/types/dashboard';

interface RoadmapSectionProps {
  items: RoadmapItem[];
  onAddRoadmap: () => void;
}

const RoadmapSection = ({ items, onAddRoadmap }: RoadmapSectionProps) => {
  return <RoadmapList items={items} onAddRoadmap={onAddRoadmap} />;
};

export default RoadmapSection;
