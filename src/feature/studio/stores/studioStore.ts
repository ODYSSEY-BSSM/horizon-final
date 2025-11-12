import { create } from 'zustand';
import type { StudioCanvasState } from '../types/canvas';
import type { StudioEdge, StudioNode } from '../types/node';

interface StudioStoreState extends StudioCanvasState {
  // Actions
  setNodes: (nodes: StudioNode[]) => void;
  setEdges: (edges: StudioEdge[]) => void;
  addNode: (node: StudioNode) => void;
  updateNode: (nodeId: string, updates: Partial<StudioNode>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSaving: (isSaving: boolean) => void;
  setRoadmapId: (roadmapId: number | null) => void;
  reset: () => void;
}

const initialState: StudioCanvasState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isLoading: false,
  isSaving: false,
  roadmapId: null,
};

export const useStudioStore = create<StudioStoreState>((set) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
    })),

  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),

  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsSaving: (isSaving) => set({ isSaving }),

  setRoadmapId: (roadmapId) => set({ roadmapId }),

  reset: () => set(initialState),
}));
