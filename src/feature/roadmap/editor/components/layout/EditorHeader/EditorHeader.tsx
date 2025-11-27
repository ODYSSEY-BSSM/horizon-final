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
}

export const EditorHeader = ({
  state = 'editing',
  roadmapTitle = 'Roadmap1',
  roadmapId,
  onTempSave,
  onSave,
}: EditorHeaderProps) => {
  return (
    <RoadmapHeader
      mode="editor"
      roadmapTitle={roadmapTitle}
      roadmapId={roadmapId}
      editorState={state}
      onTempSave={onTempSave}
      onSave={onSave}
      fixed={false}
    />
  );
};
