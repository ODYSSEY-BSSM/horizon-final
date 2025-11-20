import { useCallback, useReducer } from 'react';
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
 * 히스토리 관리를 위한 전체 상태
 */
interface HistoryManagerState {
  history: HistoryState[];
  currentIndex: number;
}

/**
 * 히스토리 액션 타입
 */
type HistoryAction =
  | { type: 'SAVE_STATE'; payload: { nodes: Node[]; edges: Edge[] } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' };

/**
 * 히스토리 리듀서
 */
function historyReducer(state: HistoryManagerState, action: HistoryAction): HistoryManagerState {
  switch (action.type) {
    case 'SAVE_STATE': {
      const { nodes, edges } = action.payload;

      // 마지막 상태와 동일한지 확인 (중복 저장 방지)
      const lastState = state.history[state.currentIndex];
      if (
        lastState &&
        JSON.stringify(lastState.nodes) === JSON.stringify(nodes) &&
        JSON.stringify(lastState.edges) === JSON.stringify(edges)
      ) {
        return state; // 변경사항 없음
      }

      // 현재 인덱스 이후의 히스토리 제거
      const newHistory = state.history.slice(0, state.currentIndex + 1);

      // 새 상태 추가
      const updatedHistory = [...newHistory, { nodes, edges }];

      // 최대 개수 제한
      if (updatedHistory.length > MAX_HISTORY) {
        const trimmed = updatedHistory.slice(-MAX_HISTORY);
        return {
          history: trimmed,
          currentIndex: MAX_HISTORY - 1,
        };
      }

      return {
        history: updatedHistory,
        currentIndex: updatedHistory.length - 1,
      };
    }

    case 'UNDO': {
      if (state.currentIndex > 0) {
        return {
          ...state,
          currentIndex: state.currentIndex - 1,
        };
      }
      return state;
    }

    case 'REDO': {
      if (state.currentIndex < state.history.length - 1) {
        return {
          ...state,
          currentIndex: state.currentIndex + 1,
        };
      }
      return state;
    }

    case 'CLEAR': {
      return {
        history: [],
        currentIndex: -1,
      };
    }

    default:
      return state;
  }
}

/**
 * 히스토리 관리 훅
 * Undo/Redo 기능을 제공합니다.
 */
export const useHistory = () => {
  const [state, dispatch] = useReducer(historyReducer, {
    history: [],
    currentIndex: -1,
  });

  /**
   * 현재 상태를 히스토리에 저장
   */
  const saveState = useCallback((nodes: Node[], edges: Edge[]) => {
    dispatch({ type: 'SAVE_STATE', payload: { nodes, edges } });
  }, []);

  /**
   * Undo: 이전 상태로 되돌리기
   */
  const undo = useCallback(() => {
    if (state.currentIndex > 0) {
      dispatch({ type: 'UNDO' });
      return state.history[state.currentIndex - 1];
    }
    return null;
  }, [state.currentIndex, state.history]);

  /**
   * Redo: 다음 상태로 이동
   */
  const redo = useCallback(() => {
    if (state.currentIndex < state.history.length - 1) {
      dispatch({ type: 'REDO' });
      return state.history[state.currentIndex + 1];
    }
    return null;
  }, [state.currentIndex, state.history]);

  /**
   * 히스토리 초기화
   */
  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return {
    saveState,
    undo,
    redo,
    clearHistory,
    canUndo: state.currentIndex > 0,
    canRedo: state.currentIndex < state.history.length - 1,
    historyLength: state.history.length,
    currentIndex: state.currentIndex,
  };
};
