'use client';

import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import { NODE_TYPES } from '../../constants/nodeTypes';
import { useStudioStore } from '../../stores/studioStore';
import type { StudioEdge, StudioNode } from '../../types/node';

interface StudioCanvasProps {
  roadmapId: number;
}

const connectionLineStyle = {
  strokeWidth: 2,
  stroke: '#94a3b8',
};

const defaultViewport = {
  x: 0,
  y: 0,
  zoom: 1,
};

export const StudioCanvas: React.FC<StudioCanvasProps> = ({ roadmapId: _roadmapId }) => {
  const { nodes, edges, setNodes, setEdges, setSelectedNodeId, isLoading } = useStudioStore();

  const onNodesChange = useCallback(
    (changes: any) => {
      // Apply changes to nodes
      const updatedNodes = nodes
        .map((node) => {
          const change = changes.find((c: any) => c.id === node.id);
          if (!change) {
            return node;
          }

          if (change.type === 'position' && change.position) {
            return { ...node, position: change.position };
          }
          if (change.type === 'select') {
            return { ...node, selected: change.selected };
          }
          if (change.type === 'remove') {
            return null;
          }
          return node;
        })
        .filter((node): node is StudioNode => node !== null);

      setNodes(updatedNodes);
    },
    [nodes, setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      // Apply changes to edges
      const updatedEdges = edges
        .map((edge) => {
          const change = changes.find((c: any) => c.id === edge.id);
          if (!change) {
            return edge;
          }

          if (change.type === 'select') {
            return { ...edge, selected: change.selected };
          }
          if (change.type === 'remove') {
            return null;
          }
          return edge;
        })
        .filter((edge): edge is StudioEdge => edge !== null);

      setEdges(updatedEdges);
    },
    [edges, setEdges],
  );

  const onConnect = useCallback(
    (connection: any) => {
      const newEdge: StudioEdge = {
        id: `edge-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: 'smoothstep',
      };
      setEdges([...edges, newEdge]);
    },
    [edges, setEdges],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: StudioNode) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const memoizedNodeTypes = useMemo(() => NODE_TYPES, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">로드맵 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={memoizedNodeTypes}
        fitView={nodes.length > 0}
        attributionPosition="top-right"
        defaultViewport={defaultViewport}
        connectionLineStyle={connectionLineStyle}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <MiniMap
          nodeStrokeColor="#64748b"
          nodeColor="#94a3b8"
          nodeBorderRadius={8}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e7eb" />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-gray-400 text-lg">노드를 추가하여 시작하세요</p>
            <p className="text-gray-300 text-sm mt-2">우측 상단의 + 버튼을 클릭하세요</p>
          </div>
        </div>
      )}
    </div>
  );
};
