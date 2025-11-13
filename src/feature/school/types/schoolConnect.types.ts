export interface SchoolInfo {
  id: string;
  name: string;
  logoUrl: string;
  nodeCount: number;
}

export interface SchoolNode {
  id: string;
  name: string;
  teacher: string;
  usageCount: number;
}

export type ConnectionStatus = 'disconnected' | 'connected' | 'connecting' | 'error';

export interface SchoolConnectState {
  status: ConnectionStatus;
  school: SchoolInfo | null;
  nodes: SchoolNode[];
}

export interface ModalState {
  connectFail: boolean;
  disconnectConfirm: boolean;
}
