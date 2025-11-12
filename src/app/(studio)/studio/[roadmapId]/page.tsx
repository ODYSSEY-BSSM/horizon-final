'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { StudioCanvas } from '@/feature/studio/components/canvas';
import { NodeEditor } from '@/feature/studio/components/editor';
import { StudioToolbar } from '@/feature/studio/components/toolbar';
import { useStudioNodes } from '@/feature/studio/hooks/useStudioNodes';
import { useStudioStore } from '@/feature/studio/stores/studioStore';
import {
  buildEdgesFromNodes,
  transformToReactFlowNodes,
} from '@/feature/studio/utils/nodeTransform';

export default function StudioPage() {
  const params = useParams();
  const roadmapId = Number(params.roadmapId);

  const { setNodes, setEdges, setRoadmapId, setIsLoading, reset } = useStudioStore();

  // Fetch nodes from API
  const { data: nodesData, isLoading, error } = useStudioNodes(roadmapId);

  // Set roadmap ID on mount
  useEffect(() => {
    setRoadmapId(roadmapId);

    // Cleanup when component unmounts
    return () => {
      reset();
    };
  }, [roadmapId, setRoadmapId, reset]);

  // Update store when nodes data changes
  useEffect(() => {
    setIsLoading(isLoading);

    if (nodesData && !isLoading) {
      // Transform backend data to React Flow format
      const reactFlowNodes = transformToReactFlowNodes(nodesData);
      const reactFlowEdges = buildEdgesFromNodes(nodesData);

      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
    }
  }, [nodesData, isLoading, setNodes, setEdges, setIsLoading]);

  const handleSave = async () => {
    // TODO: Implement batch save functionality
  };

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">오류 발생</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Toolbar */}
      <StudioToolbar onSave={handleSave} isSaving={false} />

      {/* Canvas */}
      <StudioCanvas roadmapId={roadmapId} />

      {/* Node Editor (shown when a node is selected) */}
      <NodeEditor />
    </div>
  );
}
