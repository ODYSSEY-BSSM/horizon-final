import { notFound } from 'next/navigation';
import { ViewerContent } from './content';

interface PageProps {
  params: Promise<{
    roadmapId: string;
  }>;
}

export default async function RoadmapViewerPage({ params }: PageProps) {
  const { roadmapId } = await params;
  const numericRoadmapId = Number(roadmapId);

  // roadmapId 유효성 검증
  if (Number.isNaN(numericRoadmapId) || numericRoadmapId <= 0) {
    notFound();
  }

  return <ViewerContent roadmapId={numericRoadmapId} />;
}
