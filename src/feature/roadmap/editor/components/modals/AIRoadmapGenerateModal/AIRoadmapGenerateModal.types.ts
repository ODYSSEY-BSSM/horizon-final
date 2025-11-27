import type { Node } from 'reactflow';

/**
 * AI 로드맵 생성 모달 Props
 */
export interface AIRoadmapGenerateModalProps {
  /** 폴더 ID */
  directoryId: number;
  /** 팀 ID (optional, 팀 로드맵인 경우) */
  teamId?: number;
  /** 모달 닫기 콜백 */
  onClose: () => void;
  /** 생성 성공 콜백 */
  onSuccess: (nodes: Node[], roadmapId: number) => void;
}
