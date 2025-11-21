'use client';

import { ReactFlowProvider } from 'reactflow';
import { RoadmapEditor } from '@/feature/roadmap/editor';

interface EditorContentProps {
  roadmapId: number;
}

export function EditorContent({ roadmapId }: EditorContentProps) {
  return (
    <ReactFlowProvider>
      <RoadmapEditor roadmapId={roadmapId} />
    </ReactFlowProvider>
  );
}
