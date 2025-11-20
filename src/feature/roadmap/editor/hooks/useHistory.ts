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
 * 최대 히스토리 개수
 */
const MAX_HISTORY = 50;

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
        const updatedHistory = [...newHistory, { nodes, edges }];

        // 최대 개수 제한
        if (updatedHistory.length > MAX_HISTORY) {
          const trimmed = updatedHistory.slice(-MAX_HISTORY);
          setCurrentIndex(MAX_HISTORY - 1);
          return trimmed;
        }

        return updatedHistory;
      });

      // currentIndex 업데이트 (MAX_HISTORY 초과하지 않은 경우만)
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next >= MAX_HISTORY ? MAX_HISTORY - 1 : next;
      });
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
