import type { StudioEdge, StudioNode } from './node';

export interface StudioCanvasState {
  nodes: StudioNode[];
  edges: StudioEdge[];
  selectedNodeId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  roadmapId: number | null;
}

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}
