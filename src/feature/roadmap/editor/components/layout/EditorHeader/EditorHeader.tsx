'use client';

import type { EditorState } from '@/shared/components/RoadmapHeader';
import { RoadmapHeader } from '@/shared/components/RoadmapHeader';

export type EditorHeaderState = EditorState;

export interface EditorHeaderProps {
  state?: EditorHeaderState;
  roadmapTitle?: string;
  roadmapId?: string;
  onTempSave?: () => void;
  onSave?: () => void;
  /** 뷰어로 이동하기 전에 호출됨 (저장 등) - Promise 완료 후 이동 */
  onBeforeViewerNavigate?: () => Promise<void>;
}

export const EditorHeader = ({
  state = 'editing',
  roadmapTitle = 'Roadmap1',
  roadmapId,
  onTempSave,
  onSave,
  onBeforeViewerNavigate,
}: EditorHeaderProps) => {
  return (
    <RoadmapHeader
      mode="editor"
      roadmapTitle={roadmapTitle}
      roadmapId={roadmapId}
      editorState={state}
      onTempSave={onTempSave}
      onSave={onSave}
      onBeforeViewerNavigate={onBeforeViewerNavigate}
      fixed={false}
    />
  );
};
