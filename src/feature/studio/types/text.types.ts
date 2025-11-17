import type { Node } from 'reactflow';

/**
 * 텍스트 타입
 * - title: 제목 (20px Bold)
 * - paragraph: 본문 (16px Regular)
 */
export type TextType = 'title' | 'paragraph';

/**
 * 텍스트 노드 데이터
 */
export interface TextNodeData {
  text: string;
  type: TextType;
}

/**
 * React Flow Node 타입 확장
 */
export type HorizonText = Node<TextNodeData>;

/**
 * 텍스트 노드 생성 파라미터
 */
export interface CreateTextParams {
  id: string;
  position: { x: number; y: number };
  data: TextNodeData;
}
