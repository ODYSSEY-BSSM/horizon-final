import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import type { HorizonNodeData, NodeType } from '../types/node.types';

/**
 * 노드 생성 훅
 * 툴바에서 노드 타입을 선택하면 캔버스에 노드를 추가합니다.
 */
export const useNodeCreator = () => {
  const { setNodes } = useReactFlow();

  /**
   * 노드 추가 함수
   * @param type - 노드 타입 (title, standard, secondary)
   * @param position - 노드 위치 (기본값: 화면 중앙)
   */
  const addNode = useCallback(
    (type: NodeType, position = { x: 250, y: 250 }) => {
      const newNode = {
        id: `node-${crypto.randomUUID()}`,
        type: 'horizonNode',
        position,
        data: createNodeData(type),
        style: { zIndex: 1 }, // 일반 노드는 섹션 위에 표시
      };

      setNodes((nds) => [...nds, newNode]);
      return newNode.id;
    },
    [setNodes],
  );

  /**
   * 섹션 추가 함수
   * @param position - 섹션 위치
   * @param size - 섹션 크기
   */
  const addSection = useCallback(
    (position = { x: 100, y: 100 }, size = { width: 600, height: 400 }) => {
      const newSection = {
        id: `section-${crypto.randomUUID()}`,
        type: 'horizonSection',
        position,
        data: { label: 'New Section', color: 'blue' as const },
        style: { width: size.width, height: size.height, zIndex: 0 }, // 섹션은 배경 레이어
        selected: false, // 선택되지 않은 상태로 생성
      };

      setNodes((nds) => [...nds, newSection]);
      return newSection.id;
    },
    [setNodes],
  );

  /**
   * 텍스트 추가 함수
   * @param textType - 텍스트 타입
   * @param position - 텍스트 위치
   */
  const addText = useCallback(
    (textType: 'title' | 'paragraph' = 'paragraph', position = { x: 250, y: 250 }) => {
      const newText = {
        id: `text-${crypto.randomUUID()}`,
        type: 'horizonText',
        position,
        data: { type: textType, text: 'New Text' },
        style: { zIndex: 1 }, // 텍스트도 섹션 위에 표시
      };

      setNodes((nds) => [...nds, newText]);
      return newText.id;
    },
    [setNodes],
  );

  return { addNode, addSection, addText };
};

/**
 * 노드 타입에 따른 기본 데이터 생성
 */
function createNodeData(type: NodeType): HorizonNodeData {
  switch (type) {
    case 'title':
      return {
        type: 'title',
        label: 'Title Node',
        color: 'blue',
      };
    case 'standard':
      return {
        type: 'standard',
        title: 'Standard Node',
        description: '노드의 학습 내용을 작성해주세요.',
        color: 'blue',
        progress: 0,
      };
    case 'secondary':
      return {
        type: 'secondary',
        title: 'Secondary Node',
        color: 'blue',
        quizCurrent: 0,
        quizTotal: 4,
      };
  }
}
