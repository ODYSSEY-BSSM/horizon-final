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
  childNode: Node[] | null;
}

export interface CursorPosition {
  x: number;
  y: number;
}

export interface UserCursor extends CursorPosition {
  userId: number;
  userName: string;
}

export interface CreateNodeRequest extends Omit<Node, 'id' | 'roadmapId' | 'childNode'> {}

export interface UpdateNodeRequest extends Partial<Omit<Node, 'id' | 'roadmapId' | 'childNode'>> {}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}
