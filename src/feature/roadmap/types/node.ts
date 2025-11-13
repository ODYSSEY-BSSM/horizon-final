import type { Color, NodeType, Subject } from '@/shared/api/types';

export interface NodeCreateRequest {
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  color: Color;
  parentNodeId?: number;
}

export interface EducationNodeConvertRequest {
  subject: Subject;
}

export interface NodeResponse {
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  color: string;
  roadmapId: number;
  parentNodeId?: number;
  childNode: NodeResponse[];
  progress: number;
  isEducation: boolean;
  subject?: string;
}

export interface NodeUpdateRequest {
  title?: string;
  description?: string;
  height?: number;
  width?: number;
  type?: NodeType;
  x?: number;
  y?: number;
  color?: Color;
  parentNodeId?: number;
}

export interface NodeListResponse {
  nodes: NodeResponse[];
}
