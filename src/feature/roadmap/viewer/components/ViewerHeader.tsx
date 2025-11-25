'use client';

import { RoadmapHeader } from '@/shared/components/RoadmapHeader';

export interface ViewerHeaderProps {
  roadmapTitle?: string;
  onEditClick?: () => void;
  showEditButton?: boolean;
}

export const ViewerHeader = ({
  roadmapTitle = 'Roadmap1',
  onEditClick,
  showEditButton = true,
}: ViewerHeaderProps) => {
  return (
    <RoadmapHeader
      mode="viewer"
      roadmapTitle={roadmapTitle}
      onEditClick={onEditClick}
      showEditButton={showEditButton}
      fixed={true}
    />
  );
};
