'use client';

import styled from '@emotion/styled';
import { useCallback, useState } from 'react';
import type { Node } from 'reactflow';
import { useRoadmapNodesWebSocket } from '@/feature/roadmap';
import type { NodeDeleteMessage, RoadmapNodeMessage } from '@/shared/api';
import { ViewerCanvas } from './components/ViewerCanvas';
import { ViewerHeader } from './components/ViewerHeader';
import { type ViewerNodeType, ViewerSidebar } from './components/ViewerSidebar';

interface RoadmapViewerProps {
  roadmapId: string;
  roadmapTitle: string;
  nodes: Node[];
  edges: any[];
  onEditClick?: () => void;
  showEditButton?: boolean;
}

interface SelectedNodeData {
  id: string;
  name: string;
  description: string;
  type: ViewerNodeType;
  childNodeIds?: string[];
  nextNodeIds?: string[];
}

export const RoadmapViewer = ({
  roadmapId,
  roadmapTitle,
  nodes,
  edges,
  onEditClick,
  showEditButton = true,
}: RoadmapViewerProps) => {
  const [selectedNodeData, setSelectedNodeData] = useState<SelectedNodeData | null>(null);

  // WebSocket integration for real-time node synchronization (read-only)
  useRoadmapNodesWebSocket({
    roadmapId: Number(roadmapId),
    onCreated: useCallback((nodeData: RoadmapNodeMessage) => {
      console.log('Node created in viewer:', nodeData);
      // TODO: Add node to canvas in real-time
      // For now, viewer will refetch on next load
    }, []),
    onDeleted: useCallback((nodeId: NodeDeleteMessage) => {
      console.log('Node deleted in viewer:', nodeId);
      // TODO: Remove node from canvas in real-time
      // For now, viewer will refetch on next load
    }, []),
    autoSubscribe: true,
  });

  const handleNodeClick = useCallback(
    (node: Node) => {
      // horizonNode의 data.type에서 노드 타입 추출
      const nodeType: ViewerNodeType = node.data.type === 'secondary' ? 'secondary' : 'standard';

      // 하위 노드 ID 목록 (이 노드가 source인 엣지 중 side handle로 연결된 것들)
      const childNodeIds = edges
        .filter((edge) => edge.source === node.id && edge.sourceHandle === 'side')
        .map((edge) => edge.target);

      // 다음 노드 ID 목록 (이 노드가 source인 엣지 중 bottom handle로 연결된 것들)
      const nextNodeIds = edges
        .filter((edge) => edge.source === node.id && edge.sourceHandle === 'bottom')
        .map((edge) => edge.target);

      setSelectedNodeData({
        id: node.id,
        name: node.data.label || node.data.title || 'Untitled',
        description: node.data.description || '노드 설명이 없습니다.',
        type: nodeType,
        childNodeIds,
        nextNodeIds,
      });
    },
    [edges],
  );

  const handleChildNodeClick = useCallback(
    (childNodeId: string) => {
      const childNode = nodes.find((n) => n.id === childNodeId);
      if (childNode) {
        handleNodeClick(childNode);
      }
    },
    [nodes, handleNodeClick],
  );

  const handleNextNodeClick = useCallback(
    (nextNodeId: string) => {
      const nextNode = nodes.find((n) => n.id === nextNodeId);
      if (nextNode) {
        handleNodeClick(nextNode);
      }
    },
    [nodes, handleNodeClick],
  );

  const handleQuizClick = useCallback(() => {
    // TODO: 퀴즈 모달 또는 페이지로 이동
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSelectedNodeData(null);
  }, []);

  // 선택된 노드의 자식 노드 정보 생성
  const childNodes = selectedNodeData?.childNodeIds?.map((childId) => {
    const childNode = nodes.find((n) => n.id === childId);
    return {
      id: childId,
      name: childNode?.data?.label || childNode?.data?.title || 'Untitled',
      progress: childNode?.data?.quizCurrent || 0,
      totalQuiz: childNode?.data?.quizTotal || 4,
    };
  });

  // 선택된 노드의 다음 노드 정보 생성
  const nextNodes = selectedNodeData?.nextNodeIds?.map((nextId) => {
    const nextNode = nodes.find((n) => n.id === nextId);
    return {
      id: nextId,
      name: nextNode?.data?.label || nextNode?.data?.title || 'Untitled',
      progress: nextNode?.data?.progress || 0,
    };
  });

  // 퀴즈 진행도 (현재는 mock 데이터, 실제로는 API에서 가져와야 함)
  const quizProgress =
    selectedNodeData?.type === 'secondary'
      ? {
          current: 0,
          total: 4,
          allSolved: false,
        }
      : undefined;

  // 전체 진행도 계산 (하위 노드들의 평균)
  const overallProgress =
    childNodes && childNodes.length > 0
      ? Math.round(
          childNodes.reduce((sum, child) => sum + (child.progress / child.totalQuiz) * 100, 0) /
            childNodes.length,
        )
      : undefined;

  return (
    <StyledContainer>
      <ViewerHeader
        roadmapTitle={roadmapTitle}
        onEditClick={onEditClick}
        showEditButton={showEditButton}
      />
      <StyledMain $hasSidebar={!!selectedNodeData}>
        <ViewerCanvas initialNodes={nodes} initialEdges={edges} onNodeClick={handleNodeClick} />
        {selectedNodeData && (
          <ViewerSidebar
            nodeName={selectedNodeData.name}
            nodeDescription={selectedNodeData.description}
            nodeType={selectedNodeData.type}
            childNodes={childNodes}
            nextNodes={nextNodes}
            quizProgress={quizProgress}
            overallProgress={overallProgress}
            onQuizClick={handleQuizClick}
            onChildNodeClick={handleChildNodeClick}
            onNextNodeClick={handleNextNodeClick}
            onClose={handleCloseSidebar}
          />
        )}
      </StyledMain>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const StyledMain = styled.main<{ $hasSidebar: boolean }>`
  position: relative;
  flex: 1;
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  overflow: hidden;
`;
