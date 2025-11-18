'use client';

import { ReactFlowProvider } from 'reactflow';
import { RoadmapEditor } from '@/feature/roadmap/editor';

export function EditorContent() {
  return (
    <ReactFlowProvider>
      <RoadmapEditor />
    </ReactFlowProvider>
  );
}
