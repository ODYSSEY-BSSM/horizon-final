'use client';

import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeTypes,
  MiniMap,
  type Node,
  type NodeTypes,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { tokens } from '@/shared/tokens';
import { HorizonEdge } from './components/edges';
import { EditorHeader, type EditorHeaderState } from './components/layout/EditorHeader';
import { EditorSidebar } from './components/layout/EditorSidebar';
import { HorizonNode } from './components/nodes/HorizonNode';
import { HorizonSection } from './components/nodes/HorizonSection';
import { HorizonText } from './components/nodes/HorizonText';
import { EditorToolbar } from './components/toolbar/EditorToolbar';
import { HistoryController } from './components/ui/HistoryController';
import { useHistory } from './hooks/useHistory';
import { useNodeCreator } from './hooks/useNodeCreator';
import { useEditorStore } from './store/editorStore';

// 노드 타입 등록
const nodeTypes: NodeTypes = {
  horizonNode: HorizonNode,
  horizonSection: HorizonSection,
  horizonText: HorizonText,
};

// 엣지 타입 등록
const edgeTypes: EdgeTypes = {
  horizonEdge: HorizonEdge,
};

// 초기 노드 데이터 (예시)
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'horizonNode',
    position: { x: 250, y: 200 },
    data: { type: 'title' as const, label: 'Roadmap Title', color: 'blue' as const },
    style: { zIndex: 1 },
  },
  {
    id: '2',
    type: 'horizonNode',
    position: { x: 250, y: 320 },
    data: {
      type: 'standard' as const,
      title: 'Standard Node',
      description: '노드 설명을 입력하세요',
      color: 'blue' as const,
      progress: 50,
    },
    style: { zIndex: 1 },
  },
];

const initialEdges: Edge[] = [];

export const RoadmapEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [headerState, setHeaderState] = useState<EditorHeaderState>('editing');

  // 히스토리 관리
  const { saveState, undo, redo, canUndo, canRedo } = useHistory();

  // 노드 생성 훅
  const { addNode, addSection, addText } = useNodeCreator();

  // 에디터 스토어
  const { selectedNodeId, setSelectedNodeId } = useEditorStore();

  // 선택된 노드 찾기
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  // 노드 타입 결정
  const getNodeType = ():
    | 'title'
    | 'standard'
    | 'secondary'
    | 'section'
    | 'titleText'
    | 'paragraphText' => {
    if (!selectedNode) {
      return 'title';
    }

    if (selectedNode.type === 'horizonSection') {
      return 'section';
    }
    if (selectedNode.type === 'horizonText') {
      return selectedNode.data.type === 'title' ? 'titleText' : 'paragraphText';
    }
    // horizonNode
    return selectedNode.data.type || 'title';
  };

  // 연결선 추가
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges],
  );

  // Undo 핸들러
  const handleUndo = useCallback(() => {
    const prevState = undo();
    if (prevState) {
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
    }
  }, [undo, setNodes, setEdges]);

  // Redo 핸들러
  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
    }
  }, [redo, setNodes, setEdges]);

  // 노드 선택 핸들러
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId],
  );

  // 캔버스 클릭 시 선택 해제
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // 노드 드래그 종료 시 부모-자식 관계 설정
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // 섹션이 아닌 노드만 처리
      if (node.type === 'horizonSection') {
        return;
      }

      // 모든 섹션 찾기
      const sections = nodes.filter((n) => n.type === 'horizonSection');

      // 노드의 절대 좌표 계산 (parentNode가 있으면 상대 좌표이므로 변환 필요)
      let absoluteX = node.position.x;
      let absoluteY = node.position.y;

      if (node.parentNode) {
        const currentParent = nodes.find((n) => n.id === node.parentNode);
        if (currentParent) {
          absoluteX = currentParent.position.x + node.position.x;
          absoluteY = currentParent.position.y + node.position.y;
        }
      }

      // 현재 노드가 어느 섹션 안에 있는지 확인
      let newParentId: string | undefined;

      for (const section of sections) {
        const sectionX = section.position.x;
        const sectionY = section.position.y;
        const sectionWidth = (section.style?.width as number) || 600;
        const sectionHeight = (section.style?.height as number) || 400;

        // 노드가 섹션 영역 안에 있는지 확인
        if (
          absoluteX >= sectionX &&
          absoluteX <= sectionX + sectionWidth &&
          absoluteY >= sectionY &&
          absoluteY <= sectionY + sectionHeight
        ) {
          newParentId = section.id;
          break;
        }
      }

      // 부모가 변경된 경우에만 업데이트
      if (node.parentNode !== newParentId) {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              if (newParentId) {
                // 부모 섹션 찾기
                const parent = nds.find((p) => p.id === newParentId);
                if (parent) {
                  // 절대 좌표를 부모 기준 상대 좌표로 변환
                  const relativeX = absoluteX - parent.position.x;
                  const relativeY = absoluteY - parent.position.y;
                  return {
                    ...n,
                    parentNode: newParentId,
                    position: { x: relativeX, y: relativeY },
                  };
                }
              } else {
                // 부모에서 제거 - 절대 좌표로 변환
                // biome-ignore lint/correctness/noUnusedVariables: parentNode을 제거하기 위한 구조 분해
                const { parentNode, ...rest } = n;
                return {
                  ...rest,
                  position: { x: absoluteX, y: absoluteY },
                };
              }
            }
            return n;
          }),
        );
      }
    },
    [nodes, setNodes],
  );

  // 임시저장 핸들러
  const handleTempSave = useCallback(() => {
    // TODO: 임시저장 API 호출
  }, []);

  // 저장 핸들러
  const handleSave = useCallback(() => {
    setHeaderState('saving');

    // TODO: 저장 API 호출
    // 임시로 2초 후에 저장 완료 처리
    setTimeout(() => {
      setHeaderState('saved');

      // 3초 후에 다시 editing 상태로 전환
      setTimeout(() => {
        setHeaderState('editing');
      }, 3000);
    }, 2000);
  }, []);

  // selectedNodeId와 React Flow의 선택 상태 동기화
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: node.id === selectedNodeId,
      })),
    );
  }, [selectedNodeId, setNodes]);

  // edge에 z-index 자동 추가 (섹션 위에 표시)
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: { ...edge.style, zIndex: 1 },
      })),
    );
  }, [setEdges]);

  // 노드 데이터 업데이트 핸들러
  const handleNodeUpdate = useCallback(
    (field: string, value: any) => {
      if (!selectedNodeId) {
        return;
      }

      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId ? { ...node, data: { ...node.data, [field]: value } } : node,
        ),
      );
    },
    [selectedNodeId, setNodes],
  );

  // 노드 스타일 업데이트 핸들러 (섹션 크기 등)
  const handleNodeStyleUpdate = useCallback(
    (styleField: string, value: any) => {
      if (!selectedNodeId) {
        return;
      }

      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? { ...node, style: { ...node.style, [styleField]: value } }
            : node,
        ),
      );
    },
    [selectedNodeId, setNodes],
  );

  // 툴바 - 노드 타입 선택 핸들러
  const handleNodeTypeSelect = useCallback(
    (nodeType: string) => {
      if (nodeType === 'title') {
        addNode('title', { x: 250, y: 250 });
      } else if (nodeType === 'standard') {
        addNode('standard', { x: 250, y: 250 });
      } else if (nodeType === 'secondary') {
        addNode('secondary', { x: 250, y: 250 });
      }
    },
    [addNode],
  );

  // 툴바 - 도구 선택 핸들러
  const handleToolSelect = useCallback(
    (tool: string) => {
      if (tool === 'section') {
        addSection({ x: 100, y: 100 }, { width: 600, height: 400 });
      }
    },
    [addSection],
  );

  // 툴바 - 텍스트 타입 선택 핸들러
  const handleTextTypeSelect = useCallback(
    (textType: string) => {
      if (textType === 'title-text') {
        addText('title', { x: 250, y: 250 });
      } else if (textType === 'paragraph-text') {
        addText('paragraph', { x: 250, y: 250 });
      }
    },
    [addText],
  );

  // 노드/엣지 변경 완료 시 히스토리 저장 (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        saveState(nodes, edges);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [nodes, edges, saveState]);

  return (
    <StyledEditorContainer>
      {/* 헤더 */}
      <EditorHeader state={headerState} onTempSave={handleTempSave} onSave={handleSave} />

      {/* 히스토리 컨트롤러 */}
      <StyledHistoryController>
        <HistoryController
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      </StyledHistoryController>

      {/* React Flow 캔버스 */}
      <StyledCanvasWrapper>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: 'horizonEdge', style: { zIndex: 1 } }}
          elevateNodesOnSelect={false}
          elevateEdgesOnSelect={false}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background gap={16} size={1} color={tokens.colors.neutral[200]} />
          <Controls />
          <MiniMap
            nodeColor={tokens.colors.primary[500]}
            maskColor="rgba(0, 0, 0, 0.1)"
            style={{
              backgroundColor: tokens.colors.white,
              border: `1px solid ${tokens.colors.neutral[200]}`,
              borderRadius: tokens.radius.small,
            }}
          />
        </ReactFlow>
      </StyledCanvasWrapper>

      {/* 사이드바 */}
      <StyledSidebar>
        <EditorSidebar
          nodeType={getNodeType()}
          nodeData={selectedNode?.data}
          nodeStyle={selectedNode?.style}
          onNodeUpdate={handleNodeUpdate}
          onNodeStyleUpdate={handleNodeStyleUpdate}
        />
      </StyledSidebar>

      {/* 툴바 */}
      <StyledToolbar>
        <EditorToolbar
          onToolSelect={handleToolSelect}
          onNodeTypeSelect={handleNodeTypeSelect}
          onTextTypeSelect={handleTextTypeSelect}
        />
      </StyledToolbar>
    </StyledEditorContainer>
  );
};

const StyledEditorContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background-color: ${tokens.colors.neutral[100]};
`;

const StyledHistoryController = styled.div`
  position: absolute;
  top: 84px;
  left: 20px;
  z-index: 10;
`;

const StyledCanvasWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  margin-top: 64px;
`;

const StyledSidebar = styled.div`
  position: absolute;
  top: 64px;
  right: 0;
  height: calc(100vh - 64px);
  z-index: 10;
`;

const StyledToolbar = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;
