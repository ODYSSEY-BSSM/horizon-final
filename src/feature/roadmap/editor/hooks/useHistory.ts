import { useCallback, useState } from 'react';
import type { Edge, Node } from 'reactflow';

/**
 * 히스토리 상태 타입
 */
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

/**
 * 히스토리 관리 훅
 * Undo/Redo 기능을 제공합니다.
 */
export const useHistory = () => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  /**
   * 현재 상태를 히스토리에 저장
   */
  const saveState = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      setHistory((prev) => {
        // 현재 인덱스 이후의 히스토리 제거
        const newHistory = prev.slice(0, currentIndex + 1);
        // 새 상태 추가
        return [...newHistory, { nodes, edges }];
      });
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex],
  );

  /**
   * Undo: 이전 상태로 되돌리기
   */
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  /**
   * Redo: 다음 상태로 이동
   */
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  /**
   * 히스토리 초기화
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    saveState,
    undo,
    redo,
    clearHistory,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    historyLength: history.length,
    currentIndex,
  };
};
