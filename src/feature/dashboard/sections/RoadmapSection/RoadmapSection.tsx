import type { RoadmapItem } from '@/feature/dashboard/types/dashboard';
import { RoadmapList } from '../../components/RoadmapList';

interface RoadmapSectionProps {
  items: RoadmapItem[];
  onAddRoadmap: () => void;
}

const RoadmapSection = ({ items, onAddRoadmap }: RoadmapSectionProps) => {
  return <RoadmapList items={items} onAddRoadmap={onAddRoadmap} />;
};

export default RoadmapSection;
