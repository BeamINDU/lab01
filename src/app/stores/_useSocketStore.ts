import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface State {
  liveSocket: Socket | null;
  trainingSocket: Socket | null;
  connect: () => void;
  disconnect: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

export const useSocketStore = create<State>((set, get) => ({
  liveSocket: null,
  trainingSocket: null,
  connect: () => {
    const live = io(`${BASE_URL}/live`);
    const train = io(`${BASE_URL}/train`);
    set({ liveSocket: live, trainingSocket: train });
  },
  disconnect: () => {
    const { liveSocket, trainingSocket } = get();
    liveSocket?.disconnect();
    trainingSocket?.disconnect();
    set({ liveSocket: null, trainingSocket: null });
  },
}));
 