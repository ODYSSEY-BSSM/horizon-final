import { create } from 'zustand';
import type { Node } from '../types';

interface NodeStore {
  nodesByRoadmap: Record<number, Node[]>;
  setNodes: (roadmapId: number, nodes: Node[]) => void;
  addNode: (roadmapId: number, node: Node) => void;
  updateNode: (roadmapId: number, updatedNode: Node) => void;
  removeNode: (roadmapId: number, nodeId: number) => void;
}

export const useNodeStore = create<NodeStore>((set) => ({
  nodesByRoadmap: {},
  setNodes: (roadmapId, nodes) =>
    set((state) => ({
      nodesByRoadmap: { ...state.nodesByRoadmap, [roadmapId]: nodes },
    })),
  addNode: (roadmapId, node) =>
    set((state) => ({
      nodesByRoadmap: {
        ...state.nodesByRoadmap,
        [roadmapId]: [...(state.nodesByRoadmap[roadmapId] || []), node],
      },
    })),
  updateNode: (roadmapId, updatedNode) =>
    set((state) => ({
      nodesByRoadmap: {
        ...state.nodesByRoadmap,
        [roadmapId]: (state.nodesByRoadmap[roadmapId] || []).map((n) =>
          n.id === updatedNode.id ? updatedNode : n,
        ),
      },
    })),
  removeNode: (roadmapId, nodeId) =>
    set((state) => ({
      nodesByRoadmap: {
        ...state.nodesByRoadmap,
        [roadmapId]: (state.nodesByRoadmap[roadmapId] || []).filter((n) => n.id !== nodeId),
      },
    })),
}));
