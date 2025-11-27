import type { Node } from 'reactflow';
import type { AINodeModifyResponse } from '../../../types/ai.types';

/**
 * AI 노드 수정 모달 Props
 */
export interface AINodeModifyModalProps {
  /** 로드맵 ID */
  roadmapId: number;
  /** 선택된 노드 ID */
  selectedNodeId: string | null;
  /** 전체 노드 목록 */
  nodes: Node[];
  /** 모달 닫기 콜백 */
  onClose: () => void;
  /** 수정 성공 콜백 */
  onSuccess: (modifiedNodes: AINodeModifyResponse[]) => void;
}
