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
  usageCount: number; // 0이면 "사용되지 않음"
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
