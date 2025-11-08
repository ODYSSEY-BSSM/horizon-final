import { create } from 'zustand';
import type { Node, UserCursor } from '../types';

interface NodeStore {
  nodes: Record<number, Node[]>;
  cursors: Record<number, UserCursor[]>;
  setNodes: (roadmapId: number, nodes: Node[]) => void;
  addNode: (roadmapId: number, node: Node) => void;
  updateNode: (roadmapId: number, node: Node) => void;
  removeNode: (roadmapId: number, nodeId: number) => void;
  updateCursor: (roadmapId: number, cursor: UserCursor) => void;
}

export const useNodeStore = create<NodeStore>((set) => ({
  nodes: {},
  cursors: {},
  setNodes: (roadmapId, nodes) =>
    set((state) => ({ nodes: { ...state.nodes, [roadmapId]: nodes } })),
  addNode: (roadmapId, node) =>
    set((state) => ({
      nodes: { ...state.nodes, [roadmapId]: [...(state.nodes[roadmapId] || []), node] },
    })),
  updateNode: (roadmapId, node) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [roadmapId]: (state.nodes[roadmapId] || []).map((n) => (n.id === node.id ? node : n)),
      },
    })),
  removeNode: (roadmapId, nodeId) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [roadmapId]: (state.nodes[roadmapId] || []).filter((n) => n.id !== nodeId),
      },
    })),
  updateCursor: (roadmapId, cursor) =>
    set((state) => {
      const existingCursors = state.cursors[roadmapId] || [];
      const cursorIndex = existingCursors.findIndex((c) => c.userId === cursor.userId);
      let newCursors = [];
      if (cursorIndex > -1) {
        newCursors = [...existingCursors];
        newCursors[cursorIndex] = cursor;
      } else {
        newCursors = [...existingCursors, cursor];
      }
      return { cursors: { ...state.cursors, [roadmapId]: newCursors } };
    }),
}));
