'use client';

import { Global } from '@emotion/react';
import styled from '@emotion/styled';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

import { useToast } from '@/shared/hooks/useToast';
import { tokens } from '@/shared/tokens';
import { useCreateNode, useDeleteNode, useNodes, useUpdateNode } from './api/nodeApi';
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
import type { NodeRequest } from './types/api.types';
import type { NodeType } from './types/node.types';
import { loadEdges, saveEdges } from './utils/edgeStorage';
import {
  apiNodesToReactFlow,
  apiToReactFlow,
  calculateAbsolutePosition,
  mapColorToApi,
  mapTypeToApi,
  reactFlowNodesToApi,
} from './utils/nodeConverter';

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
    data: {
      type: 'title' as const,
      label: 'Roadmap Title',
      color: 'blue' as const,
      isSchoolNode: false,
    },
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
      isSchoolNode: false,
    },
    style: { zIndex: 1 },
  },
];

const initialEdges: Edge[] = [];

// 상수 정의
const HISTORY_DEBOUNCE_MS = 500;
const SAVE_SUCCESS_DISPLAY_MS = 3000;

interface RoadmapEditorProps {
  roadmapId: number;
}

export const RoadmapEditor = ({ roadmapId }: RoadmapEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [headerState, setHeaderState] = useState<EditorHeaderState>('editing');
  const [isEdgesLoaded, setIsEdgesLoaded] = useState(false);

  // Refs for cleanup
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Toast
  const { toast } = useToast();

  // API 연동: 노드 목록 조회
  const { data: apiNodes, isLoading, isError } = useNodes(roadmapId);
  const updateNodeMutation = useUpdateNode(roadmapId);
  const createNodeMutation = useCreateNode(roadmapId);
  const deleteNodeMutation = useDeleteNode(roadmapId);

  // 히스토리 관리
  const { saveState, undo, redo, canUndo, canRedo } = useHistory();

  // 노드 생성 훅 (섹션과 텍스트용)
  const { addSection, addText } = useNodeCreator();

  // 에디터 스토어
  const { selectedNodeId, setSelectedNodeId } = useEditorStore();

  // 선택된 노드 찾기
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  // 노드 타입 결정 (메모이제이션)
  const nodeType = useMemo<
    'title' | 'standard' | 'secondary' | 'section' | 'titleText' | 'paragraphText'
  >(() => {
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
  }, [selectedNode]);

  // 연결선 추가
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: 'horizonEdge' }, eds));
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
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId],
  );

  // 캔버스 클릭 시 선택 해제
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // 노드 삭제 핸들러 (섹션 삭제 시 자식 노드의 부모 참조 제거)
  const onNodesDelete = useCallback(
    async (deletedNodes: Node[]) => {
      const deletedNodeIds = new Set(deletedNodes.map((n) => n.id));

      // horizonNode만 API 호출 (섹션과 텍스트는 로컬에서만 삭제)
      const horizonNodesToDelete = deletedNodes.filter((node) => node.type === 'horizonNode');

      // API 호출 (병렬 처리)
      if (roadmapId && horizonNodesToDelete.length > 0) {
        try {
          await Promise.all(
            horizonNodesToDelete.map((node) => {
              const nodeId = Number.parseInt(node.id, 10);
              if (!Number.isNaN(nodeId)) {
                return deleteNodeMutation.mutateAsync(nodeId);
              }
              // 임시 ID인 경우 (API에서 생성되지 않은 노드) 스킵
              return Promise.resolve();
            }),
          );

          toast({
            title: 'Success',
            description: `${horizonNodesToDelete.length} node(s) deleted`,
            variant: 'success',
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to delete some nodes',
            variant: 'failed',
          });
        }
      }

      // 로컬 상태 업데이트 (자식 노드의 부모 참조 제거)
      setNodes((nds) => {
        // 좌표 계산용 배열: 현재 노드 + 삭제된 노드 (부모 노드 찾기 위함)
        const allNodesForCalc = [...nds, ...deletedNodes];

        return nds.map((node) => {
          // 삭제된 노드를 부모로 가진 노드의 부모 참조 제거
          if (node.parentNode && deletedNodeIds.has(node.parentNode)) {
            // 절대 좌표 계산 (삭제된 부모 포함)
            const absolutePos = calculateAbsolutePosition(node, allNodesForCalc);

            // 부모 참조 제거하고 절대 좌표로 변환
            // biome-ignore lint/correctness/noUnusedVariables: parentNode을 제거하기 위한 구조 분해
            const { parentNode, ...rest } = node;
            return {
              ...rest,
              position: absolutePos,
            };
          }
          return node;
        });
      });
    },
    [roadmapId, deleteNodeMutation, setNodes, toast],
  );

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
        const sectionWidth = (section.style?.width as number | undefined) ?? 600;
        const sectionHeight = (section.style?.height as number | undefined) ?? 400;

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
    toast({
      title: 'Coming Soon',
      description: 'Temporary save feature is under development',
      variant: 'success',
    });
  }, [toast]);

  // 저장 핸들러
  const handleSave = useCallback(async () => {
    if (!roadmapId) {
      toast({
        title: 'Error',
        description: 'Roadmap ID is required',
        variant: 'failed',
      });
      return;
    }

    setHeaderState('saving');

    try {
      // horizonNode만 필터링
      const horizonNodes = nodes.filter((node) => node.type === 'horizonNode');

      // React Flow 노드를 API 형식으로 변환 (전체 배열 전달하여 부모 노드 찾기 가능)
      const apiNodeRequests = reactFlowNodesToApi(nodes);

      // 각 노드 업데이트 (병렬 처리) - Promise.allSettled 사용
      const results = await Promise.allSettled(
        horizonNodes.map((node, index) => {
          const nodeId = Number.parseInt(node.id, 10);
          if (Number.isNaN(nodeId)) {
            // 새로 생성된 노드는 임시 ID를 가지므로 스킵 (향후 createNode로 처리)
            return Promise.resolve({ skipped: true, nodeId: node.id });
          }
          return updateNodeMutation
            .mutateAsync({ nodeId, data: apiNodeRequests[index] })
            .then((result) => ({ skipped: false, nodeId, result }));
        }),
      );

      // 실패한 노드 확인
      const failures = results.filter((r) => r.status === 'rejected');
      const skipped = results.filter(
        (r) => r.status === 'fulfilled' && (r.value as any).skipped === true,
      );

      if (failures.length > 0) {
        toast({
          title: 'Partial Save',
          description: `${results.length - failures.length - skipped.length} nodes saved, ${failures.length} failed`,
          variant: 'failed',
        });
        setHeaderState('editing');
        return;
      }

      setHeaderState('saved');
      const savedCount = results.length - skipped.length;
      toast({
        title: 'Success',
        description:
          skipped.length > 0
            ? `${savedCount} nodes saved (${skipped.length} new nodes skipped)`
            : 'Roadmap saved successfully',
        variant: 'success',
      });

      // 이전 timeout 정리
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // 3초 후에 다시 editing 상태로 전환
      saveTimeoutRef.current = setTimeout(() => {
        setHeaderState('editing');
      }, SAVE_SUCCESS_DISPLAY_MS);
    } catch (error) {
      setHeaderState('editing');
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Failed to save roadmap',
        variant: 'failed',
      });
    }
  }, [roadmapId, nodes, updateNodeMutation, toast]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // selectedNodeId와 React Flow의 선택 상태 동기화 (최적화)
  useEffect(() => {
    setNodes((nds) => {
      // 변경이 필요한지 먼저 확인
      const needsUpdate = nds.some((node) => {
        const shouldBeSelected = node.id === selectedNodeId;
        return node.selected !== shouldBeSelected;
      });

      if (!needsUpdate) {
        return nds;
      }

      return nds.map((node) => ({
        ...node,
        selected: node.id === selectedNodeId,
      }));
    });
  }, [selectedNodeId, setNodes]);

  // 노드 데이터 업데이트 핸들러
  const handleNodeUpdate = useCallback(
    (field: string, value: string | number | boolean) => {
      if (!selectedNodeId) {
        return;
      }

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== selectedNodeId) {
            return node;
          }

          // 타입 변경 시 데이터 구조 변환
          if (field === 'type') {
            // horizonNode에만 타입 전환 로직 적용 (텍스트/섹션 노드는 단순 필드 변경)
            if (node.type === 'horizonNode') {
              const newType = value as NodeType;
              const currentData = node.data as any;

              // 타입별 필수 필드 설정
              const newData: any = {
                type: newType,
                color: currentData.color || 'blue',
                isSchoolNode: currentData.isSchoolNode ?? false,
              };

              if (newType === 'title') {
                // title 노드는 label 필드 사용
                newData.label = currentData.label || currentData.title || 'New Title';
              } else if (newType === 'standard' || newType === 'secondary') {
                // standard/secondary 노드는 title, description 필드 사용
                newData.title = currentData.title || currentData.label || 'New Node';
                newData.description = currentData.description || '';
                newData.progress = currentData.progress || 0;
              }

              return { ...node, data: newData };
            }

            // 텍스트/섹션 노드는 type만 변경 (기존 데이터 보존)
            return { ...node, data: { ...node.data, type: value } };
          }

          // 일반 필드 업데이트
          return { ...node, data: { ...node.data, [field]: value } };
        }),
      );
    },
    [selectedNodeId, setNodes],
  );

  // 노드 스타일 업데이트 핸들러 (섹션 크기 등)
  const handleNodeStyleUpdate = useCallback(
    (styleField: string, value: string | number) => {
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
    async (nodeTypeStr: string) => {
      if (!roadmapId) {
        toast({
          title: 'Error',
          description: 'Roadmap ID is required',
          variant: 'failed',
        });
        return;
      }

      if (!apiNodes) {
        toast({
          title: 'Error',
          description: 'Roadmap data is not loaded yet',
          variant: 'failed',
        });
        return;
      }

      const nodeType = nodeTypeStr as NodeType;

      // 노드 기본 데이터 구성
      const defaultTitle =
        nodeType === 'title'
          ? 'Title Node'
          : nodeType === 'standard'
            ? 'Standard Node'
            : 'Secondary Node';
      const defaultDescription = nodeType === 'standard' ? '노드의 학습 내용을 작성해주세요.' : '';

      // API 요청 데이터 생성
      const nodeRequest: NodeRequest = {
        title: defaultTitle,
        description: defaultDescription,
        height: 93, // 현재 노드 크기
        width: 93,
        type: mapTypeToApi(nodeType),
        x: 250,
        y: 250,
        color: mapColorToApi('blue'),
      };

      try {
        // API 호출
        const response = await createNodeMutation.mutateAsync(nodeRequest);

        // API 응답을 React Flow 노드로 변환 (apiNodes는 이미 체크됨)
        const newNode = apiToReactFlow(response, apiNodes);

        // React Flow 상태에 노드 추가
        setNodes((nds) => [...nds, newNode]);

        toast({
          title: 'Success',
          description: 'Node created successfully',
          variant: 'success',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to create node',
          variant: 'failed',
        });
      }
    },
    [roadmapId, createNodeMutation, apiNodes, setNodes, toast],
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

  // API 노드 로드 시 React Flow 노드로 변환
  useEffect(() => {
    if (apiNodes && apiNodes.length > 0) {
      const reactFlowNodes = apiNodesToReactFlow(apiNodes);
      setNodes(reactFlowNodes);
    }
  }, [apiNodes, setNodes]);

  // 초기 로드: localStorage에서 Edge 복원
  useEffect(() => {
    if (roadmapId && roadmapId > 0) {
      const savedEdges = loadEdges(roadmapId);
      if (savedEdges.length > 0) {
        setEdges(savedEdges);
      }
      setIsEdgesLoaded(true);
    }
  }, [roadmapId, setEdges]);

  // Edge 변경 시 자동으로 localStorage에 저장 (로드 완료 후에만)
  useEffect(() => {
    if (isEdgesLoaded && roadmapId && roadmapId > 0) {
      saveEdges(roadmapId, edges);
    }
  }, [isEdgesLoaded, roadmapId, edges]);

  // 노드/엣지 변경 완료 시 히스토리 저장 (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        saveState(nodes, edges);
      }
    }, HISTORY_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [nodes, edges, saveState]);

  // 로딩 상태
  if (roadmapId && isLoading) {
    return (
      <StyledEditorContainer>
        <StyledLoadingContainer>
          <StyledLoadingText>Loading roadmap...</StyledLoadingText>
        </StyledLoadingContainer>
      </StyledEditorContainer>
    );
  }

  // 에러 상태
  if (roadmapId && isError) {
    return (
      <StyledEditorContainer>
        <StyledErrorContainer>
          <StyledErrorText>Failed to load roadmap</StyledErrorText>
          <StyledErrorMessage>Please try again later</StyledErrorMessage>
        </StyledErrorContainer>
      </StyledEditorContainer>
    );
  }

  return (
    <StyledEditorContainer>
      {/* React Flow z-index 전역 스타일 */}
      <Global
        styles={`
          .react-flow__edges {
            z-index: 1 !important;
          }
        `}
      />

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
          onNodesDelete={onNodesDelete}
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
          nodeType={nodeType}
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

const StyledLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const StyledLoadingText = styled.div`
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  color: ${tokens.colors.neutral[600]};
`;

const StyledErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: ${tokens.spacing.medium};
`;

const StyledErrorText = styled.div`
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  color: ${tokens.colors.error[200]};
`;

const StyledErrorMessage = styled.div`
  font-size: ${tokens.typos.fontSize[14]};
  color: ${tokens.colors.neutral[600]};
`;
