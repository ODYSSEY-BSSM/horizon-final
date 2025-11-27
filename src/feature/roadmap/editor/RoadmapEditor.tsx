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

import {
  useCursorWebSocket,
  useRoadmapNodesWebSocket,
  useSectionWebSocket,
  useTextWebSocket,
} from '@/feature/roadmap';
import type {
  CursorReceiveMessage,
  NodeDeleteMessage,
  RoadmapNodeMessage,
  SectionDeleteMessage,
  SectionMessage,
  SectionUpdateMessage,
  TextDeleteMessage,
  TextMessage,
  TextUpdateMessage,
} from '@/shared/api';
import { useToast } from '@/shared/hooks/useToast';
import { tokens } from '@/shared/tokens';
import { useRoadmap } from '../hooks/useRoadmapQueries';
import { useCreateNode, useDeleteNode, useNodes, useUpdateNode } from './api/nodeApi';
import { useCreateSection } from './api/sectionApi';
import { useCreateText } from './api/textApi';
import { HorizonEdge } from './components/edges';
import { EditorHeader, type EditorHeaderState } from './components/layout/EditorHeader';
import { EditorSidebar } from './components/layout/EditorSidebar';
import { AINodeModifyModal } from './components/modals/AINodeModifyModal';
import { AIRoadmapGenerateModal } from './components/modals/AIRoadmapGenerateModal';
import { HorizonNode } from './components/nodes/HorizonNode';
import { HorizonSection } from './components/nodes/HorizonSection';
import { HorizonText } from './components/nodes/HorizonText';
import { EditorToolbar } from './components/toolbar/EditorToolbar';
import { HistoryController } from './components/ui/HistoryController';
import { useHistory } from './hooks/useHistory';
import { useAIStore } from './store/aiStore';
import { useEditorStore } from './store/editorStore';
import type { AINodeModifyResponse } from './types/ai.types';
import type { ApiColor, ApiNodeType, NodeRequest, NodeResponse } from './types/api.types';
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
import { loadNodes, saveLastSaveTime, saveNodes } from './utils/nodeStorage';

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

// 초기 노드 데이터 (서버에서 로드)
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// 상수 정의
const HISTORY_DEBOUNCE_MS = 500;
const SAVE_SUCCESS_DISPLAY_MS = 3000;
const AUTO_SAVE_INTERVAL_MS = 30000;

interface RoadmapEditorProps {
  roadmapId: number;
  /** 폴더 ID (AI 로드맵 생성용, optional) */
  directoryId?: number;
  /** 팀 ID (팀 로드맵인 경우, optional) */
  teamId?: number;
}

export const RoadmapEditor = ({ roadmapId, directoryId, teamId }: RoadmapEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [headerState, setHeaderState] = useState<EditorHeaderState>('editing');
  const [isEdgesLoaded, setIsEdgesLoaded] = useState(false);
  const [isNodesLoaded, setIsNodesLoaded] = useState(false);

  // Refs for cleanup
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // 초기 로드 완료 여부 (저장 후 apiNodes 변경 시 useEffect 재실행 방지)
  const isInitialLoadDoneRef = useRef(false);
  // 이전 roadmapId 추적 (로드맵 전환 시 ref 리셋용)
  const prevRoadmapIdRef = useRef<number | null>(null);

  // roadmapId 변경 시 초기화 상태 리셋
  useEffect(() => {
    if (prevRoadmapIdRef.current !== null && prevRoadmapIdRef.current !== roadmapId) {
      // 로드맵 전환 감지 - 상태 리셋
      isInitialLoadDoneRef.current = false;
      setIsNodesLoaded(false);
      setIsEdgesLoaded(false);
      setNodes([]);
      setEdges([]);
    }
    prevRoadmapIdRef.current = roadmapId;
  }, [roadmapId, setNodes, setEdges]);

  // Refs for preventing duplicate API calls (timestamp-based debounce)
  const lastNodeCreateTime = useRef(0);
  const lastSectionCreateTime = useRef(0);
  const lastTextCreateTime = useRef(0);
  const isSavingRef = useRef(false); // 저장 중복 호출 방지
  const DEBOUNCE_MS = 1000; // 1초 내 중복 호출 방지

  // Toast
  const { toast } = useToast();

  // API 연동: 로드맵 정보 조회
  const { data: roadmapData } = useRoadmap(roadmapId);

  // API 연동: 노드 목록 조회
  const { data: apiNodes, isLoading, isError } = useNodes(roadmapId);
  const updateNodeMutation = useUpdateNode(roadmapId);
  const createNodeMutation = useCreateNode(roadmapId);
  const deleteNodeMutation = useDeleteNode(roadmapId);

  // API 연동: Section/Text 생성 (목록 조회 API 없음)
  const createSectionMutation = useCreateSection(roadmapId);
  const createTextMutation = useCreateText(roadmapId);

  // WebSocket handlers for real-time synchronization
  const handleNodeCreated = useCallback(
    (nodeData: RoadmapNodeMessage) => {
      setNodes((nds) => {
        // Convert WebSocket message to NodeResponse format
        const nodeResponse: NodeResponse = {
          id: nodeData.id,
          title: nodeData.title,
          description: nodeData.description,
          height: nodeData.height,
          width: nodeData.width,
          type: nodeData.type as ApiNodeType,
          x: nodeData.x,
          y: nodeData.y,
          color: 'blue' as ApiColor, // Default color since WebSocket message doesn't include it
          roadmapId: nodeData.roadmapId,
          parentNodeId: nodeData.parentNodeId ?? 0,
          childNode: [],
          progress: 0,
          isEducation: false,
          subject: '',
        };

        // Convert API node to ReactFlow node and add it to the canvas
        const newNode = apiToReactFlow(nodeResponse, apiNodes || []);

        // Check if node already exists to avoid duplicates
        if (nds.some((n) => n.id === newNode.id)) {
          return nds;
        }
        return [...nds, newNode];
      });
    },
    [setNodes, apiNodes],
  );

  const handleNodeDeleted = useCallback(
    (nodeId: NodeDeleteMessage) => {
      // Remove node from canvas when deleted by another user or process
      setNodes((nds) => nds.filter((n) => n.id !== String(nodeId)));
    },
    [setNodes],
  );

  // WebSocket integration for real-time node synchronization
  useRoadmapNodesWebSocket({
    roadmapId,
    onCreated: handleNodeCreated,
    onDeleted: handleNodeDeleted,
    autoSubscribe: true,
  });

  // WebSocket integration for real-time cursor sharing
  useCursorWebSocket({
    roadmapId,
    onCursorMove: useCallback((_cursor: CursorReceiveMessage) => {
      // TODO: 커서 렌더링 구현 필요
    }, []),
    autoSubscribe: true,
  });

  // WebSocket integration for real-time section synchronization
  useSectionWebSocket({
    roadmapId,
    onCreated: useCallback((_section: SectionMessage['section']) => {
      // TODO: Convert section to ReactFlow node and add to canvas
    }, []),
    onUpdated: useCallback((_update: SectionUpdateMessage) => {
      // TODO: Update section node on canvas
    }, []),
    onDeleted: useCallback(
      (sectionId: SectionDeleteMessage) => {
        setNodes((nds) => nds.filter((n) => n.id !== String(sectionId)));
      },
      [setNodes],
    ),
    autoSubscribe: true,
  });

  // WebSocket integration for real-time text synchronization
  useTextWebSocket({
    roadmapId,
    onCreated: useCallback((_text: TextMessage['texts']) => {
      // TODO: Convert text to ReactFlow node and add to canvas
    }, []),
    onUpdated: useCallback((_update: TextUpdateMessage) => {
      // TODO: Update text node on canvas
    }, []),
    onDeleted: useCallback(
      (textId: TextDeleteMessage) => {
        setNodes((nds) => nds.filter((n) => n.id !== String(textId)));
      },
      [setNodes],
    ),
    autoSubscribe: true,
  });

  // 히스토리 관리
  const { saveState, undo, redo, canUndo, canRedo } = useHistory();

  // 에디터 스토어
  const { selectedNodeId, setSelectedNodeId } = useEditorStore();

  // AI 스토어
  const {
    isGenerateModalOpen,
    isModifyModalOpen,
    openGenerateModal,
    closeGenerateModal,
    openModifyModal,
    closeModifyModal,
  } = useAIStore();

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

      // API 호출 (병렬 처리) with 404 handling
      if (roadmapId && horizonNodesToDelete.length > 0) {
        const deleteResults = await Promise.allSettled(
          horizonNodesToDelete.map(async (node) => {
            const nodeId = Number.parseInt(node.id, 10);
            // 서버에 존재하는 정수 ID(양수)만 삭제
            if (!Number.isNaN(nodeId) && nodeId > 0) {
              try {
                return await deleteNodeMutation.mutateAsync(nodeId);
              } catch (error) {
                // 404 errors are expected if node was already deleted - ignore them
                if (error instanceof Error && error.message.includes('404')) {
                  return { alreadyDeleted: true };
                }
                throw error;
              }
            }
            // 임시/로컬 ID는 서버 호출 없이 스킵
            return Promise.resolve();
          }),
        );

        const failures = deleteResults.filter(
          (result) =>
            result.status === 'rejected' ||
            (result.status === 'fulfilled' && result.value?.alreadyDeleted),
        );
        const successCount = deleteResults.length - failures.length;

        if (failures.length === 0) {
          toast({
            title: '성공',
            description: `${successCount}개의 노드가 삭제되었습니다`,
            variant: 'success',
          });
        } else if (successCount > 0) {
          toast({
            title: '일부 성공',
            description: `${successCount}개 삭제됨, ${failures.length}개는 이미 제거됨`,
            variant: 'success',
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
      // 섹션 드래그 시: 섹션 영역 안에 있는 노드들을 자식으로 설정
      if (node.type === 'horizonSection') {
        const sectionX = node.position.x;
        const sectionY = node.position.y;
        const sectionWidth = (node.style?.width as number | undefined) ?? 600;
        const sectionHeight = (node.style?.height as number | undefined) ?? 400;

        setNodes((nds) =>
          nds.map((n) => {
            // 섹션 자체나 다른 섹션은 처리하지 않음
            if (n.type === 'horizonSection') {
              return n;
            }

            // 노드의 절대 좌표 계산
            let nodeAbsoluteX = n.position.x;
            let nodeAbsoluteY = n.position.y;

            if (n.parentNode && n.parentNode !== node.id) {
              // 다른 섹션의 자식인 경우 절대 좌표 계산
              const currentParent = nds.find((p) => p.id === n.parentNode);
              if (currentParent) {
                nodeAbsoluteX = currentParent.position.x + n.position.x;
                nodeAbsoluteY = currentParent.position.y + n.position.y;
              }
            } else if (n.parentNode === node.id) {
              // 이미 이 섹션의 자식인 경우 절대 좌표 계산
              nodeAbsoluteX = sectionX + n.position.x;
              nodeAbsoluteY = sectionY + n.position.y;
            }

            // 노드가 이 섹션 영역 안에 있는지 확인
            const isInsideSection =
              nodeAbsoluteX >= sectionX &&
              nodeAbsoluteX <= sectionX + sectionWidth &&
              nodeAbsoluteY >= sectionY &&
              nodeAbsoluteY <= sectionY + sectionHeight;

            if (isInsideSection && n.parentNode !== node.id) {
              // 섹션 안에 있고, 아직 이 섹션의 자식이 아닌 경우 → 자식으로 설정
              const relativeX = nodeAbsoluteX - sectionX;
              const relativeY = nodeAbsoluteY - sectionY;

              // 기존 parentNode 제거하고 새 parentNode 설정
              const { parentNode: _oldParent, ...rest } = n;
              return {
                ...rest,
                parentNode: node.id,
                position: { x: relativeX, y: relativeY },
              };
            }

            if (!isInsideSection && n.parentNode === node.id) {
              // 섹션 밖으로 나갔고, 이 섹션의 자식인 경우 → 부모에서 제거
              const { parentNode: _oldParent, ...rest } = n;
              return {
                ...rest,
                position: { x: nodeAbsoluteX, y: nodeAbsoluteY },
              };
            }

            return n;
          }),
        );
        return;
      }

      // 일반 노드 드래그 시: 기존 로직
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

  // 임시저장 핸들러 (localStorage만)
  const handleTempSave = useCallback(() => {
    if (!roadmapId) {
      return;
    }

    // localStorage에 노드와 엣지 저장
    saveNodes(roadmapId, nodes);
    saveEdges(roadmapId, edges);
    saveLastSaveTime(roadmapId);

    toast({
      title: '임시 저장',
      description: '로컬 스토리지에 저장되었습니다',
      variant: 'success',
    });
  }, [roadmapId, nodes, edges, toast]);

  // 저장 핸들러
  const handleSave = useCallback(async () => {
    // 중복 호출 방지 (ref 기반 - 즉시 체크)
    if (isSavingRef.current) {
      return;
    }
    isSavingRef.current = true;

    if (!roadmapId) {
      isSavingRef.current = false;
      toast({
        title: '오류',
        description: '로드맵 ID가 필요합니다',
        variant: 'failed',
      });
      return;
    }

    setHeaderState('saving');

    try {
      // horizonNode만 필터링
      const horizonNodes = nodes.filter((node) => node.type === 'horizonNode');

      // 신규 노드와 기존 노드 분리
      const newNodes: Node[] = [];
      const existingNodes: Node[] = [];

      for (const node of horizonNodes) {
        const nodeId = Number.parseInt(node.id, 10);
        if (Number.isNaN(nodeId) || nodeId < 0) {
          // 임시 ID (문자열 또는 음수)는 신규 노드
          newNodes.push(node);
        } else {
          // 양수 정수 ID는 기존 노드
          existingNodes.push(node);
        }
      }

      // React Flow 노드를 API 형식으로 변환
      const apiNodeRequests = reactFlowNodesToApi(nodes);

      // 임시 ID -> 실제 ID 매핑 (신규 노드 생성 후 사용)
      const idMapping = new Map<string, number>();

      // 1단계: 신규 노드 생성 (순차 처리 - 부모 먼저 생성)
      const newNodeResults: Array<{ success: boolean; tempId: string; realId?: number }> = [];

      for (const node of newNodes) {
        const index = horizonNodes.indexOf(node);
        const apiRequest = apiNodeRequests[index];

        try {
          const response = await createNodeMutation.mutateAsync(apiRequest);
          idMapping.set(node.id, response.id);
          newNodeResults.push({ success: true, tempId: node.id, realId: response.id });
        } catch (_error) {
          newNodeResults.push({ success: false, tempId: node.id });
        }
      }

      // 2단계: 기존 노드 업데이트 (병렬 처리)
      const updateResults = await Promise.allSettled(
        existingNodes.map((node) => {
          const nodeId = Number.parseInt(node.id, 10);
          const index = horizonNodes.indexOf(node);
          return updateNodeMutation
            .mutateAsync({ nodeId, data: apiNodeRequests[index] })
            .then((result) => ({ success: true, nodeId, result }));
        }),
      );

      // 결과 집계
      const newNodeSuccesses = newNodeResults.filter((r) => r.success).length;
      const newNodeFailures = newNodeResults.filter((r) => !r.success).length;
      const updateSuccesses = updateResults.filter((r) => r.status === 'fulfilled').length;
      const updateFailures = updateResults.filter((r) => r.status === 'rejected').length;

      const totalSuccess = newNodeSuccesses + updateSuccesses;
      const totalFailures = newNodeFailures + updateFailures;

      // 3단계: 임시 ID를 실제 ID로 교체 (노드 + 참조 업데이트)
      if (idMapping.size > 0) {
        // 노드 ID 및 parentNode 참조 업데이트
        setNodes((nds) =>
          nds.map((node) => {
            const realId = idMapping.get(node.id);
            const realParentId = node.parentNode ? idMapping.get(node.parentNode) : undefined;

            return {
              ...node,
              id: realId ? String(realId) : node.id,
              parentNode: realParentId
                ? String(realParentId)
                : node.parentNode
                  ? node.parentNode
                  : undefined,
            };
          }),
        );

        // 엣지의 source/target 참조 업데이트
        setEdges((eds) =>
          eds.map((edge) => {
            const newSource = idMapping.get(edge.source);
            const newTarget = idMapping.get(edge.target);

            return {
              ...edge,
              source: newSource ? String(newSource) : edge.source,
              target: newTarget ? String(newTarget) : edge.target,
            };
          }),
        );
      }

      // 결과에 따라 토스트 표시
      if (totalFailures > 0) {
        toast({
          title: '일부 저장',
          description: `${totalSuccess}개 저장됨, ${totalFailures}개 실패`,
          variant: 'failed',
        });
        setHeaderState('editing');
        isSavingRef.current = false;
        return;
      }

      setHeaderState('saved');
      isSavingRef.current = false;
      toast({
        title: '성공',
        description: `${totalSuccess}개의 노드가 저장되었습니다`,
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
      isSavingRef.current = false;
      toast({
        title: '저장 실패',
        description: error instanceof Error ? error.message : '로드맵 저장에 실패했습니다',
        variant: 'failed',
      });
    }
  }, [
    roadmapId,
    nodes,
    updateNodeMutation,
    createNodeMutation,
    toast,
    setNodes, // 엣지의 source/target 참조 업데이트
    setEdges,
  ]);

  // 30초 자동 임시저장 (최적화: ref를 사용해 최신 값 참조)
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  useEffect(() => {
    if (!roadmapId) {
      return;
    }

    // 30초마다 localStorage에 자동 저장
    autoSaveIntervalRef.current = setInterval(() => {
      saveNodes(roadmapId, nodesRef.current);
      saveEdges(roadmapId, edgesRef.current);
      saveLastSaveTime(roadmapId);
    }, AUTO_SAVE_INTERVAL_MS);

    return () => {
      // Cleanup: timeout과 interval 정리
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [roadmapId]);

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
              const currentData = node.data;

              // 타입별 필수 필드 설정
              const newData = {
                type: newType,
                color: ('color' in currentData ? currentData.color : 'blue') as ApiColor,
                isSchoolNode: ('isSchoolNode' in currentData
                  ? currentData.isSchoolNode
                  : false) as boolean,
              };

              if (newType === 'title') {
                // title 노드는 label 필드 사용
                return {
                  ...node,
                  data: {
                    ...newData,
                    label: ('label' in currentData
                      ? currentData.label
                      : 'title' in currentData
                        ? currentData.title
                        : 'New Title') as string,
                  },
                };
              }

              if (newType === 'standard' || newType === 'secondary') {
                // standard/secondary 노드는 title, description 필드 사용
                return {
                  ...node,
                  data: {
                    ...newData,
                    title: ('title' in currentData
                      ? currentData.title
                      : 'label' in currentData
                        ? currentData.label
                        : 'New Node') as string,
                    description: ('description' in currentData
                      ? currentData.description
                      : '') as string,
                    progress: ('progress' in currentData ? currentData.progress : 0) as number,
                  },
                };
              }
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
      // 중복 호출 방지 (timestamp 기반 debounce)
      const now = Date.now();
      if (now - lastNodeCreateTime.current < DEBOUNCE_MS) {
        return;
      }
      lastNodeCreateTime.current = now;

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
          title: '오류',
          description: '로드맵 데이터가 아직 로드되지 않았습니다',
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
      const defaultDescription = nodeType === 'standard' ? '노드의 학습 내용을 작성해주세요.' : '-';

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
          title: '성공',
          description: '노드가 생성되었습니다',
          variant: 'success',
        });
      } catch (error) {
        toast({
          title: '오류',
          description: error instanceof Error ? error.message : '노드 생성에 실패했습니다',
          variant: 'failed',
        });
      }
    },
    [roadmapId, createNodeMutation, apiNodes, setNodes, toast],
  );

  // 툴바 - 도구 선택 핸들러 (섹션 생성)
  const handleToolSelect = useCallback(
    async (tool: string) => {
      if (tool === 'section') {
        // 중복 호출 방지 (timestamp 기반 debounce)
        const now = Date.now();
        if (now - lastSectionCreateTime.current < DEBOUNCE_MS) {
          return;
        }
        lastSectionCreateTime.current = now;

        try {
          const position = { x: 100, y: 100 };
          const size = { width: 600, height: 400 };

          // API 호출
          const response = await createSectionMutation.mutateAsync({
            name: 'New Section',
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height,
          });

          // React Flow에 섹션 추가
          const newSection = {
            id: String(response.id),
            type: 'horizonSection',
            position,
            data: { label: response.name, color: 'blue' as const },
            style: { width: size.width, height: size.height, zIndex: 0 },
            selected: false,
          };

          setNodes((nds) => [...nds, newSection]);

          toast({
            title: '성공',
            description: '섹션이 생성되었습니다',
            variant: 'success',
          });
        } catch (error) {
          toast({
            title: '오류',
            description: error instanceof Error ? error.message : '섹션 생성에 실패했습니다',
            variant: 'failed',
          });
        }
      }
    },
    [createSectionMutation, setNodes, toast],
  );

  // 툴바 - 텍스트 타입 선택 핸들러
  const handleTextTypeSelect = useCallback(
    async (textType: string) => {
      // 중복 호출 방지 (timestamp 기반 debounce)
      const now = Date.now();
      if (now - lastTextCreateTime.current < DEBOUNCE_MS) {
        return;
      }
      lastTextCreateTime.current = now;

      const position = { x: 250, y: 250 };
      const apiTextType = textType === 'title-text' ? 'TITLE' : 'PARAGRAPH';
      const localTextType = textType === 'title-text' ? 'title' : 'paragraph';

      try {
        // API 호출
        const response = await createTextMutation.mutateAsync({
          text: 'New Text',
          type: apiTextType as 'TITLE' | 'PARAGRAPH',
        });

        // React Flow에 텍스트 추가
        const newText = {
          id: String(response.id),
          type: 'horizonText',
          position,
          data: { type: localTextType as 'title' | 'paragraph', text: response.text },
          style: { zIndex: 1 },
        };

        setNodes((nds) => [...nds, newText]);

        toast({
          title: '성공',
          description: '텍스트가 생성되었습니다',
          variant: 'success',
        });
      } catch (error) {
        toast({
          title: '오류',
          description: error instanceof Error ? error.message : '텍스트 생성에 실패했습니다',
          variant: 'failed',
        });
      }
    },
    [createTextMutation, setNodes, toast],
  );

  // 툴바 - AI 액션 선택 핸들러
  const handleAiActionSelect = useCallback(
    (action: string) => {
      if (action === 'generate') {
        if (!directoryId) {
          toast({
            title: '오류',
            description: 'AI 로드맵 생성은 폴더에서만 가능합니다',
            variant: 'failed',
          });
          return;
        }
        openGenerateModal();
      } else if (action === 'edit-selection') {
        if (!selectedNodeId) {
          toast({
            title: '알림',
            description: '수정할 노드를 먼저 선택해주세요',
            variant: 'failed',
          });
          return;
        }
        openModifyModal();
      }
    },
    [directoryId, selectedNodeId, openGenerateModal, openModifyModal, toast],
  );

  // AI 로드맵 생성 성공 핸들러
  const handleAiGenerateSuccess = useCallback(
    (newNodes: Node[], _newRoadmapId: number) => {
      // 생성된 노드들을 캔버스에 추가
      setNodes((nds) => [...nds, ...newNodes]);
      toast({
        title: '성공',
        description: 'AI가 로드맵을 생성했습니다',
        variant: 'success',
      });
    },
    [setNodes, toast],
  );

  // AI 노드 수정 성공 핸들러
  const handleAiModifySuccess = useCallback(
    (modifiedNodes: AINodeModifyResponse[]) => {
      // 수정된 노드들 업데이트
      setNodes((nds) =>
        nds.map((node) => {
          const modified = modifiedNodes.find((m) => String(m.id) === node.id);
          if (modified) {
            return {
              ...node,
              data: {
                ...node.data,
                title: modified.title,
                description: modified.description,
              },
            };
          }
          return node;
        }),
      );

      // 노드 캐시 무효화 (서버에서 최신 데이터 가져오기)
      toast({
        title: '성공',
        description: 'AI가 노드를 수정했습니다',
        variant: 'success',
      });
    },
    [setNodes, toast],
  );

  // API 노드 로드 시 React Flow 노드로 변환 (localStorage 위치 우선)
  // Section/Text는 목록 조회 API가 없으므로 localStorage에서만 로드
  // ⚠️ 초기 로드 시에만 실행 (저장 후 invalidateQueries로 인한 재실행 방지)
  useEffect(() => {
    // roadmapId가 없거나 API 데이터가 아직 로드되지 않았으면 스킵
    if (!roadmapId || apiNodes === undefined) {
      return;
    }

    // 이미 초기 로드가 완료된 경우 스킵 (저장 후 refetch 시 화면 튀는 문제 방지)
    if (isInitialLoadDoneRef.current) {
      return;
    }

    // localStorage에서 저장된 노드 가져오기
    const localNodes = loadNodes(roadmapId);
    const localNodeMap = new Map<string, Node>();
    if (localNodes) {
      for (const node of localNodes) {
        localNodeMap.set(node.id, node);
      }
    }

    // 모든 노드를 담을 배열
    const allNodes: Node[] = [];

    // 1. API 노드들을 ReactFlow 노드로 변환
    if (apiNodes.length > 0) {
      const reactFlowNodes = apiNodesToReactFlow(apiNodes);
      allNodes.push(...reactFlowNodes);
    }

    // 2. localStorage에 저장된 위치/data/style 병합
    const mergedNodes = allNodes.map((node) => {
      const savedNode = localNodeMap.get(node.id);
      if (savedNode) {
        return {
          ...node,
          position: savedNode.position,
          data: savedNode.data ?? node.data,
          style: savedNode.style ?? node.style,
        };
      }
      return node;
    });

    // 3. localStorage에만 있는 로컬 노드(섹션, 텍스트 등) 추가
    if (localNodes) {
      for (const localNode of localNodes) {
        const existsInMerged = mergedNodes.some((n) => n.id === localNode.id);
        if (!existsInMerged) {
          mergedNodes.push(localNode);
        }
      }
    }

    setNodes(mergedNodes);
    setIsNodesLoaded(true);
    isInitialLoadDoneRef.current = true; // 초기 로드 완료 표시
    // setNodes는 useNodesState에서 제공하는 안정적인 함수이므로 의존성에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapId, apiNodes, setNodes]);

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

  // Node 변경 시 자동으로 localStorage에 저장 (로드 완료 후에만)
  useEffect(() => {
    if (isNodesLoaded && roadmapId && roadmapId > 0) {
      saveNodes(roadmapId, nodes);
    }
  }, [isNodesLoaded, roadmapId, nodes]);

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
      <EditorHeader
        state={headerState}
        roadmapTitle={roadmapData?.roadmapInfo?.title || 'Roadmap'}
        roadmapId={String(roadmapId)}
        onTempSave={handleTempSave}
        onSave={handleSave}
        onBeforeViewerNavigate={handleSave}
      />

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

      {/* 사이드바 - 노드 선택 시에만 표시 */}
      {selectedNode && (
        <StyledSidebar>
          <EditorSidebar
            nodeType={nodeType}
            nodeData={selectedNode?.data}
            nodeStyle={selectedNode?.style}
            onNodeUpdate={handleNodeUpdate}
            onNodeStyleUpdate={handleNodeStyleUpdate}
          />
        </StyledSidebar>
      )}

      {/* 툴바 */}
      <StyledToolbar>
        <EditorToolbar
          onToolSelect={handleToolSelect}
          onNodeTypeSelect={handleNodeTypeSelect}
          onTextTypeSelect={handleTextTypeSelect}
          onAiActionSelect={handleAiActionSelect}
        />
      </StyledToolbar>

      {/* AI 로드맵 생성 모달 */}
      {isGenerateModalOpen && directoryId && (
        <AIRoadmapGenerateModal
          directoryId={directoryId}
          teamId={teamId}
          onClose={closeGenerateModal}
          onSuccess={handleAiGenerateSuccess}
        />
      )}

      {/* AI 노드 수정 모달 */}
      {isModifyModalOpen && selectedNodeId && (
        <AINodeModifyModal
          roadmapId={roadmapId}
          selectedNodeId={selectedNodeId}
          nodes={nodes}
          onClose={closeModifyModal}
          onSuccess={handleAiModifySuccess}
        />
      )}
    </StyledEditorContainer>
  );
};

const StyledEditorContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  position: relative;
`;

const StyledSidebar = styled.div`
  position: absolute;
  top: 64px;
  right: 0;
  bottom: 0;
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
