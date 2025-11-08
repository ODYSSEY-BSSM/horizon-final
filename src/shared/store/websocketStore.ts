import { create } from 'zustand';

type WebSocketStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

interface WebSocketStore {
  status: WebSocketStatus;
  setStatus: (status: WebSocketStatus) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  status: 'DISCONNECTED',
  setStatus: (status) => set({ status }),
}));
