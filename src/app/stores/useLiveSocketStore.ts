import { create } from 'zustand';
import { MockLiveWebSocket } from '@/app/mocks/mock-live-websocket';

interface LiveSocketState {
  socket: WebSocket | MockLiveWebSocket | null;
  connect: () => void;
  disconnect: () => void;
  send: (data: any) => void;
}

export const useLiveSocketStore = create<LiveSocketState>((set, get) => ({
  socket: null,

  connect: () => {
    if (get().socket) return;
  
    const isDev = process.env.NODE_ENV !== 'production';
    const socketUrl = process.env.NEXT_PUBLIC_LIVE_SOCKET_URL || 'ws://localhost:8000/ws/live';

    const socket = isDev
      ? new MockLiveWebSocket() as unknown as WebSocket
      : new WebSocket(socketUrl);
  
      socket.onopen = () => {
      console.log("Live WebSocket connected");
      set({ socket: socket });
    };
  
    socket.onclose = () => {
      console.log("Live WebSocket closed");
      set({ socket: null });
    };

    socket.onerror = (err) => {
      console.error("Live WebSocket error:", err);
    };

    // ถ้าเป็น MockLiveWebSocket ให้เรียก connect() ของมันด้วย
    // if ('connect' in socket && typeof (socket as MockLiveWebSocket).connect === 'function') {
    //   (socket as MockLiveWebSocket).connect();
    // }
  },

  disconnect: () => {
    const socket = get().socket;
    socket?.close();
    set({ socket: null });
  },

  send: (data: any) => {
    const socket = get().socket;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not ready");
    }
  },

}));
