
export interface TeamDirectoryMessage {
  id: number;
  name: string;
  teamId: number;
  roadmaps: unknown[];
}

export type NodeType = 'TOP' | 'MIDDLE' | 'BOTTOM';
export type NodeCategory = 'develop' | string;

export interface RoadmapNodeMessage {
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  category: NodeCategory;
  roadmapId: number;
  parentNodeId: number | null;
  childNode: unknown[];
}

export interface NodeUpdateMessage {
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  category: NodeCategory;
  parentNodeId: number | null;
}

export interface CursorSendMessage {
  x: number;
  y: number;
}

export interface CursorReceiveMessage {
  userId: number;
  userName: string;
  x: number;
  y: number;
}

export type DeleteMessage = number;
