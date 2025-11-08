export type NodeType = 'TOP' | 'MIDDLE' | 'BOTTOM';

export interface Node {
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  category: string;
  roadmapId: number;
  parentNodeId: number | null;
  childNode: Node[] | null; // API 명세서 확인 필요
  progress: number | null;
}

export interface CreateNodeRequest {
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  category: string;
  parentNodeId?: number | null;
}

export interface UpdateNodeRequest extends Partial<CreateNodeRequest> {}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export type CreateNodeResponse = ApiResponse<Node>;
export type GetNodeResponse = ApiResponse<Node>;
export type GetNodesResponse = ApiResponse<Node[]>;
export type UpdateNodeResponse = ApiResponse<Node>;
export type DeleteNodeResponse = ApiResponse<null>; // Assuming no data is returned on delete
