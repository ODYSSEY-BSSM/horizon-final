import { create } from 'zustand';

/**
 * 에디터 상태 타입
 */
interface EditorState {
  // 선택된 노드 ID
  selectedNodeId: string | null;

  // 현재 선택된 툴 (selector, node, section, text, ai)
  selectedTool: string;

  // 선택된 노드 타입 (드롭다운에서 선택된 노드 타입)
  selectedNodeType: 'title' | 'standard' | 'secondary' | null;

  // 선택된 텍스트 타입
  selectedTextType: 'title' | 'subtitle' | 'body' | null;

  // Actions
  setSelectedNodeId: (id: string | null) => void;
  setSelectedTool: (tool: string) => void;
  setSelectedNodeType: (type: 'title' | 'standard' | 'secondary' | null) => void;
  setSelectedTextType: (type: 'title' | 'subtitle' | 'body' | null) => void;
}

/**
 * 에디터 상태 관리 스토어
 */
export const useEditorStore = create<EditorState>((set) => ({
  selectedNodeId: null,
  selectedTool: 'selector',
  selectedNodeType: null,
  selectedTextType: null,

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedNodeType: (type) => set({ selectedNodeType: type }),
  setSelectedTextType: (type) => set({ selectedTextType: type }),
}));
