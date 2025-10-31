import type { RoadmapItem } from '@/lib/types/dashboard';
import RoadmapList from '../_components/RoadmapList';

interface RoadmapSectionProps {
  items: RoadmapItem[];
  onAddRoadmap: () => void;
}

const RoadmapSection = ({ items, onAddRoadmap }: RoadmapSectionProps) => {
  return <RoadmapList items={items} onAddRoadmap={onAddRoadmap} />;
};

export default RoadmapSection;
