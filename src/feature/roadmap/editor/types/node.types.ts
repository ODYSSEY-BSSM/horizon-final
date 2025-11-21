import type { Node } from 'reactflow';

/**
 * 노드 색상 타입
 * 6가지 색상 테마 지원
 */
export type NodeColor = 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'green';

/**
 * 노드 타입
 * - title: 섹션 헤더용 타이틀 노드
 * - standard: 진행률 바가 있는 표준 노드
 * - secondary: 퀴즈 개수가 표시되는 세컨더리 노드
 */
export type NodeType = 'title' | 'standard' | 'secondary';

/**
 * 타이틀 노드 데이터
 */
export interface TitleNodeData {
  type: 'title';
  label: string;
  color: NodeColor;
  isSchoolNode?: boolean; // 학교 연계 노드 여부
}

/**
 * 표준 노드 데이터
 */
export interface StandardNodeData {
  type: 'standard';
  title: string;
  description: string;
  color: NodeColor;
  progress: number; // 0-100 범위의 진행률
  isSchoolNode?: boolean; // 학교 연계 노드 여부
}

/**
 * 세컨더리 노드 데이터
 */
export interface SecondaryNodeData {
  type: 'secondary';
  title: string;
  color: NodeColor;
  quizCurrent: number; // 현재 완료한 퀴즈 개수
  quizTotal: number; // 전체 퀴즈 개수
  isSchoolNode?: boolean; // 학교 연계 노드 여부
}

/**
 * HorizonNode 데이터 유니온 타입
 */
export type HorizonNodeData = TitleNodeData | StandardNodeData | SecondaryNodeData;

/**
 * React Flow Node 타입 확장
 */
export type HorizonNode = Node<HorizonNodeData>;

/**
 * 노드 위치 정보
 */
export interface NodePosition {
  x: number;
  y: number;
}

/**
 * 노드 생성 파라미터
 */
export interface CreateNodeParams {
  id: string;
  type: NodeType;
  position: NodePosition;
  data: HorizonNodeData;
}
