import { create } from 'zustand';
import { MockTrainingWebSocket } from '@/app/mocks/mock-traning-websocket';
import { showSuccess, showError } from '@/app/utils/swal';

interface WebSocketPayload {
  action: string;
  data: any;
}

interface TrainingSocketState {
  socket: WebSocket | MockTrainingWebSocket | null;
  isTraining: boolean;
  connect: (onStatus?: (status: 'done' | 'error' | 'cancel') => void) => void;
  disconnect: () => void;
  send: (payload: WebSocketPayload, onProcessing?: () => void) => Promise<boolean>;
  cancelConnection: () => Promise<boolean>;
}

export const useTrainingSocketStore = create<TrainingSocketState>((set, get) => ({
  socket: null,
  isTraining: false,

  connect: (onStatus) => {
    console.log('[connect] called');

    const currentSocket = get().socket;
    console.log('[connect] current readyState =', currentSocket?.readyState);

    if (
      currentSocket &&
      ([WebSocket.OPEN, WebSocket.CONNECTING] as const).includes(currentSocket.readyState as 0 | 1)
    ) {
      console.log('[connect] skipping: socket already connected or connecting');
      return;
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const socketUrl = process.env.NEXT_PUBLIC_TRANING_SOCKET_URL || 'ws://localhost:8000/ws/training';

    const socket = isDev
      ? new MockTrainingWebSocket()
      : new WebSocket(socketUrl);

    // console.log('[connect] socket created', socket);

    socket.onopen = () => {
      console.log('Training WebSocket connected');
      set({ socket });
    };
    
    socket.onerror = (event) => {
      console.error('WebSocket error event:', event);
      showError('WebSocket connection error.');
    };
    
    socket.onclose = (event) => {
      console.log(`WebSocket closed, code: ${event.code}, reason: ${event.reason}`);
      set({ socket: null, isTraining: false });
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Message from WebSocket:', data);
    
        if (data.status === 'done') {
          set({ isTraining: false });
          onStatus?.('done');
        } else if (data.status === 'error') {
          set({ isTraining: false });
          onStatus?.('error');
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    // เรียก connect ถ้าเป็น mock
    if ('connect' in socket && typeof (socket as MockTrainingWebSocket).connect === 'function') {
      (socket as MockTrainingWebSocket).connect();
    }
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      console.log('[disconnect] closing WebSocket...');
      socket.close();
      set({ socket: null, isTraining: false });
    }
  },

  send: async (payload, onProcessing) => {
    const socket = get().socket;

    if (socket?.readyState === WebSocket.OPEN) {
      console.log('[send] sending payload:', payload);
      socket.send(JSON.stringify(payload));
      set({ isTraining: true });
      onProcessing?.();
      return true;
    } else {
      console.warn('[send] WebSocket not ready');
      showError('WebSocket is not connected.');
      return false;
    }
  },

  cancelConnection: async () => {
    const socket = get().socket;

    if (socket?.readyState === WebSocket.OPEN) {
      try {
        console.log('[cancelConnection] closing WebSocket...');
        socket.close();
        set({ socket: null, isTraining: false });
        return true;
      } catch (err) {
        console.error('[cancelConnection] Error:', err);
        return false;
      }
    }

    console.warn('[cancelConnection] WebSocket already closed or not connected');
    set({ socket: null, isTraining: false });
    return false;
  },
}));
