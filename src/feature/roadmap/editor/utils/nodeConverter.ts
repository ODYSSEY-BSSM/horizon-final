/**
 * React Flow ↔ API 데이터 변환 유틸리티
 */

import type { Node } from 'reactflow';
import type { ApiColor, ApiNodeType, NodeRequest, NodeResponse } from '../types/api.types';
import type { HorizonNodeData, NodeColor, NodeType } from '../types/node.types';

// ============================================================================
// Type Mapping Helpers
// ============================================================================

/**
 * React Flow 노드 타입 → API 노드 타입 변환
 */
export function mapTypeToApi(type: NodeType): ApiNodeType {
  const mapping: Record<NodeType, ApiNodeType> = {
    title: 'TOP',
    standard: 'MIDDLE',
    secondary: 'BOTTOM',
  };
  return mapping[type];
}

/**
 * API 노드 타입 → React Flow 노드 타입 변환
 */
export function mapTypeFromApi(type: ApiNodeType): NodeType {
  const mapping: Record<ApiNodeType, NodeType> = {
    TOP: 'title',
    MIDDLE: 'standard',
    BOTTOM: 'secondary',
  };
  return mapping[type];
}

/**
 * React Flow 색상 → API 색상 변환
 */
export function mapColorToApi(color: NodeColor): ApiColor {
  return color.toUpperCase() as ApiColor;
}

/**
 * API 색상 → React Flow 색상 변환
 */
export function mapColorFromApi(color: ApiColor): NodeColor {
  return color.toLowerCase() as NodeColor;
}

// ============================================================================
// Coordinate Conversion
// ============================================================================

/**
 * 노드의 절대 좌표 계산
 * 부모 노드가 있으면 부모의 절대 좌표에 상대 좌표를 더함
 *
 * @param node - 절대 좌표를 계산할 노드
 * @param allNodes - 전체 노드 배열
 * @param visited - 순환 참조 감지를 위한 방문한 노드 ID 집합
 * @returns 절대 좌표
 */
export function calculateAbsolutePosition(
  node: Node,
  allNodes: Node[],
  visited: Set<string> = new Set(),
): { x: number; y: number } {
  // 순환 참조 감지
  if (visited.has(node.id)) {
    return { x: node.position.x, y: node.position.y };
  }

  // 부모가 없으면 현재 위치가 절대 좌표
  if (!node.parentNode) {
    return { x: node.position.x, y: node.position.y };
  }

  // 방문 기록 추가
  visited.add(node.id);

  // 부모 노드 찾기
  const parentNode = allNodes.find((n) => n.id === node.parentNode);
  if (!parentNode) {
    return { x: node.position.x, y: node.position.y };
  }

  // 부모의 절대 좌표 계산 (재귀)
  const parentAbsolute = calculateAbsolutePosition(parentNode, allNodes, visited);

  // 부모의 절대 좌표 + 현재 노드의 상대 좌표
  return {
    x: parentAbsolute.x + node.position.x,
    y: parentAbsolute.y + node.position.y,
  };
}

/**
 * 절대 좌표를 부모 기준 상대 좌표로 변환
 */
export function calculateRelativePosition(
  absoluteX: number,
  absoluteY: number,
  parentNode: NodeResponse | null,
): { x: number; y: number } {
  // 부모가 없으면 절대 좌표 그대로 반환
  if (!parentNode) {
    return { x: absoluteX, y: absoluteY };
  }

  // 부모 기준 상대 좌표 계산
  return {
    x: absoluteX - parentNode.x,
    y: absoluteY - parentNode.y,
  };
}

// ============================================================================
// Node Data Extraction
// ============================================================================

/**
 * React Flow 노드에서 제목 추출
 */
function extractTitle(data: HorizonNodeData): string {
  if (data.type === 'title') {
    return data.label;
  }
  return data.title;
}

/**
 * React Flow 노드에서 설명 추출
 */
function extractDescription(data: HorizonNodeData): string {
  if (data.type === 'standard') {
    return data.description || '-';
  }
  // title, secondary는 설명이 없지만 필수값이므로 기본값 반환
  return '-';
}

// ============================================================================
// React Flow → API 변환
// ============================================================================

/**
 * React Flow 노드 → API NodeRequest 변환
 *
 * @param node - React Flow 노드
 * @param allNodes - 전체 노드 배열 (절대 좌표 계산용)
 * @returns API 노드 생성/업데이트 요청 데이터
 */
export function reactFlowToApi(node: Node, allNodes: Node[]): NodeRequest {
  const data = node.data as HorizonNodeData;

  // 절대 좌표 계산
  const absolutePos = calculateAbsolutePosition(node, allNodes);

  // 크기 추출 (기본값: 200x100) - nullish coalescing 사용
  const width = (node.style?.width as number | undefined) ?? 200;
  const height = (node.style?.height as number | undefined) ?? 100;

  // 부모 노드 ID 변환 (string → number) - NaN 체크 추가
  let parentNodeId: number | undefined;
  if (node.parentNode) {
    const parsed = Number.parseInt(node.parentNode, 10);
    if (!Number.isNaN(parsed)) {
      parentNodeId = parsed;
    }
  }

  return {
    title: extractTitle(data),
    description: extractDescription(data),
    height,
    width,
    type: mapTypeToApi(data.type),
    x: Math.round(absolutePos.x),
    y: Math.round(absolutePos.y),
    color: mapColorToApi(data.color),
    parentNodeId,
  };
}

/**
 * 여러 React Flow 노드 → API NodeRequest 배열 변환
 * 섹션과 텍스트 노드는 제외
 */
export function reactFlowNodesToApi(nodes: Node[]): NodeRequest[] {
  // horizonNode만 필터링 (섹션과 텍스트 제외)
  const horizonNodes = nodes.filter((node) => node.type === 'horizonNode');

  return horizonNodes.map((node) => reactFlowToApi(node, nodes));
}

// ============================================================================
// API → React Flow 변환
// ============================================================================

/**
 * API NodeResponse → React Flow 노드 변환
 *
 * @param apiNode - API 노드 응답 데이터
 * @param allApiNodes - 전체 API 노드 배열 (상대 좌표 계산용)
 * @returns React Flow 노드
 */
export function apiToReactFlow(apiNode: NodeResponse, allApiNodes: NodeResponse[]): Node {
  const nodeType = mapTypeFromApi(apiNode.type);
  const color = mapColorFromApi(apiNode.color);

  // 부모 노드 찾기
  const parentNode =
    (apiNode.parentNodeId ? allApiNodes.find((n) => n.id === apiNode.parentNodeId) : null) ?? null;

  // 상대 좌표 계산
  const relativePos = calculateRelativePosition(apiNode.x, apiNode.y, parentNode);

  // 노드 데이터 구성
  let data: HorizonNodeData;
  if (nodeType === 'title') {
    data = {
      type: 'title',
      label: apiNode.title,
      color,
    };
  } else if (nodeType === 'standard') {
    data = {
      type: 'standard',
      title: apiNode.title,
      description: apiNode.description,
      color,
      progress: apiNode.progress,
    };
  } else {
    // secondary
    data = {
      type: 'secondary',
      title: apiNode.title,
      color,
      quizCurrent: 0, // API에 퀴즈 정보 없음
      quizTotal: 0,
    };
  }

  return {
    id: String(apiNode.id),
    type: 'horizonNode',
    position: relativePos,
    data,
    style: {
      width: apiNode.width,
      height: apiNode.height,
      zIndex: 1, // 일반 노드는 z-index 1
    },
    parentNode: apiNode.parentNodeId ? String(apiNode.parentNodeId) : undefined,
  };
}

/**
 * API NodeResponse 배열 → React Flow 노드 배열 변환
 */
export function apiNodesToReactFlow(apiNodes: NodeResponse[]): Node[] {
  return apiNodes.map((apiNode) => apiToReactFlow(apiNode, apiNodes));
}

// ============================================================================
// Validation
// ============================================================================

/**
 * NodeRequest 유효성 검사
 */
export function validateNodeRequest(request: NodeRequest): string[] {
  const errors: string[] = [];

  // 제목 검사
  if (!request.title || request.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (request.title.length > 64) {
    errors.push('Title must be 64 characters or less');
  }

  // 설명 길이 검사
  if (request.description && request.description.length > 1500) {
    errors.push('Description must be 1500 characters or less');
  }

  // 크기 검사 - NaN, Infinity, 범위 체크
  if (
    !Number.isFinite(request.width) ||
    !Number.isFinite(request.height) ||
    request.width <= 0 ||
    request.height <= 0
  ) {
    errors.push('Width and height must be positive finite numbers');
  }

  if (request.width > 10000 || request.height > 10000) {
    errors.push('Width and height must not exceed 10000');
  }

  // 좌표 검사 - NaN, Infinity 체크
  if (!Number.isFinite(request.x) || !Number.isFinite(request.y)) {
    errors.push('X and Y coordinates must be finite numbers');
  }

  return errors;
}
