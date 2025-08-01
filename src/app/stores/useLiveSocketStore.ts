import { create } from 'zustand';
import { MockLiveWebSocket } from '@/app/mocks/mock-live-websocket';
import { API_ROUTES } from "@/app/constants/endpoint";

interface LiveSocketState {
  socket: WebSocket | MockLiveWebSocket | null;
  connect: (cameraId: string) => void;
  disconnect: () => void;
  // send: (data: any) => void;
}

export const useLiveSocketStore = create<LiveSocketState>((set, get) => ({
  socket: null,

  connect: (cameraId: string) => {
    if (get().socket) return;

    // For MockLiveWebSocket
    // const socket = new MockLiveWebSocket(cameraId) as unknown as WebSocket;

    const socketUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://18.142.88.150:8010'}/${API_ROUTES.socket.live_defect}/${cameraId}`;
    const socket = new WebSocket(socketUrl);

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

    // For MockLiveWebSocket
    // if ('connect' in socket && typeof (socket as any).connect === 'function') {
    //   (socket as any).connect();
    // }

  },

  disconnect: () => {
    const socket = get().socket;
    socket?.close();
    set({ socket: null });
  },

  // send: (data: any) => {
  //   const socket = get().socket;
  //   if (socket?.readyState === WebSocket.OPEN) {
  //     socket.send(JSON.stringify(data));
  //   } else {
  //     console.warn("WebSocket not ready");
  //   }
  // },

}));
