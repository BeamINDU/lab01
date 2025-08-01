import { create } from 'zustand';
import { MockTrainingWebSocket } from '@/app/mocks/mock-traning-websocket';
import { showSuccess, showError } from '@/app/utils/swal';
import { API_ROUTES } from "@/app/constants/endpoint";

interface WebSocketPayload {
  action: string;
  data: any;
}

interface TrainingSocketState {
  socketTraining: WebSocket | MockTrainingWebSocket | null;
  connectTraining: (modelversionId: number, onStatus?: (status: 'completed' |'completed all' | 'error') => void) => void;
  disconnectTraining: () => void;
  sendTraining: (payload: WebSocketPayload, onProcessing?: () => void) => Promise<boolean>;
  cancelTraining: () => Promise<boolean>;
}

export const useTrainingSocketStore = create<TrainingSocketState>((set, get) => ({
  socketTraining: null,

  connectTraining: (modelversionId: number, onStatus) => {
    // console.log('[connect] called');

    const currentSocket = get().socketTraining;
    // console.log('[connect] current readyState =', currentSocket?.readyState);

    if (
      currentSocket &&
      ([WebSocket.OPEN, WebSocket.CONNECTING] as const).includes(currentSocket.readyState as 0 | 1)
    ) {
      console.log('[connect] skipping: socket training already connected or connecting');
      return;
    }

    // For MockTrainingWebSocket
    // const socket = new MockTrainingWebSocket(modelversionId);

    const socketUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://127.0.0.1:8010'}/${API_ROUTES.socket.training_action}/${modelversionId}`;
    const socket = new WebSocket(socketUrl);

    console.log('[connect] socket training created', socket);

    socket.onopen = () => {
      console.log('Training WebSocket connected');
      set({ socketTraining: socket });
    };
    
    socket.onerror = (event) => {
      console.error('WebSocket training error event:', event);
      showError('WebSocket training connection error.');
    };
    
    socket.onclose = (event) => {
      console.log(`WebSocket training closed, code: ${event.code}, reason: ${event.reason}`);
      set({ socketTraining: null });
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Message from WebSocket training:', data);
    
        if (data.status === 'completed all') {
          onStatus?.('completed all');
          get().disconnectTraining();
        } else if (data.status === 'error') {
          onStatus?.('error');
        }
      } catch (err) {
        console.error('Failed to parse WebSocket training message:', err);
      }
    };

    // Call connect() only for mock
    // if (socket instanceof MockTrainingWebSocket) {
    //   socket.connect(modelversionId);
    // }

  },

  disconnectTraining: () => {
    const socket = get().socketTraining;
    if (socket) {
      console.log('[disconnect] closing WebSocket training...');
      socket.close();
      set({ socketTraining: null });
    }
  },

  sendTraining: async (payload, onProcessing) => {
    const socket = get().socketTraining;

    if (socket?.readyState === WebSocket.OPEN) {
      console.log('[send] sending payload:', payload);
      socket.send(JSON.stringify(payload));
      onProcessing?.();
      return true;
    } else {
      console.warn('[send] WebSocket training not ready');
      showError('WebSocket training is not connected.');
      return false;
    }
  },

  cancelTraining: async () => {
    const socket = get().socketTraining;

    if (socket?.readyState === WebSocket.OPEN) {
      try {
        console.log('[cancelConnection] closing WebSocket training...');
        socket.close();
        set({ socketTraining: null });
        return true;
      } catch (err) {
        console.error('[cancelConnection] WebSocket training error:', err);
        return false;
      }
    }

    console.warn('[cancelConnection] WebSocket training already closed or not connected');
    set({ socketTraining: null });
    return false;
  },
}));
