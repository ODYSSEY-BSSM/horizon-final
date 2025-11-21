import { EditorContent } from './content';

interface PageProps {
  params: Promise<{
    roadmapId: string;
  }>;
}

export default async function RoadmapEditorPage({ params }: PageProps) {
  const { roadmapId } = await params;
  return <EditorContent roadmapId={Number(roadmapId)} />;
}
