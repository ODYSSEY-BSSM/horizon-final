'use client';

import styled from '@emotion/styled';
import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  type NodeTypes,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { HorizonEdge } from '@/feature/roadmap/editor/components/edges/HorizonEdge';
import { HorizonNode } from '@/feature/roadmap/editor/components/nodes/HorizonNode/HorizonNode';
import { tokens } from '@/shared/tokens';

interface ViewerCanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodeClick?: (node: Node) => void;
}

// nodeTypes를 컴포넌트 외부에서 정의 (React Flow 권장사항)
const nodeTypes: NodeTypes = {
  horizonNode: HorizonNode,
};

const edgeTypes = {
  horizonEdge: HorizonEdge,
};

export const ViewerCanvas = ({ initialNodes, initialEdges, onNodeClick }: ViewerCanvasProps) => {
  // React Flow의 훅 사용 (에디터와 동일)
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // initialNodes 변경 시 nodes 업데이트
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // initialEdges 변경 시 edges 업데이트
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeClick?.(node);
    },
    [onNodeClick],
  );

  return (
    <StyledCanvasContainer>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={true}
        edgesFocusable={false}
        elementsSelectable={true}
        panOnScroll={true}
        zoomOnScroll={true}
        panOnDrag={true}
        minZoom={0.5}
        maxZoom={2}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
      >
        <Background color={tokens.colors.neutral[300]} gap={16} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </StyledCanvasContainer>
  );
};

const StyledCanvasContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${tokens.colors.neutral[100]};

  .react-flow__node {
    cursor: pointer;
  }

  .react-flow__controls {
    bottom: ${tokens.spacing.large};
    left: ${tokens.spacing.large};
  }
`;
