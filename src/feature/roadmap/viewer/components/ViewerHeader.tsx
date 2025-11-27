'use client';

import { RoadmapHeader } from '@/shared/components/RoadmapHeader';

export interface ViewerHeaderProps {
  roadmapTitle?: string;
  roadmapId?: string;
  onEditClick?: () => void;
  showEditButton?: boolean;
}

export const ViewerHeader = ({
  roadmapTitle = 'Roadmap1',
  roadmapId,
  onEditClick,
  showEditButton = true,
}: ViewerHeaderProps) => {
  return (
    <RoadmapHeader
      mode="viewer"
      roadmapTitle={roadmapTitle}
      roadmapId={roadmapId}
      onEditClick={onEditClick}
      showEditButton={showEditButton}
      fixed={true}
    />
  );
};
