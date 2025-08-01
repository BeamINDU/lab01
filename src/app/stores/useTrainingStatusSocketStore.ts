import { create } from 'zustand';
// import { MockTrainingStatusWebSocket } from '@/app/mocks/mock-traning-status-websocket';
import { showSuccess, showError } from '@/app/utils/swal';
import { API_ROUTES } from "@/app/constants/endpoint";

interface WebSocketPayload {
  action: string;
  data: any;
}

interface TrainingStatusSocketState {
  socket: WebSocket | null;
  connect: (modelversionId: number, onStatus?: (status: 'success' | 'error') => void) => void;
  disconnect: () => void;
  cancel: () => Promise<boolean>;
  // send: (payload: WebSocketPayload, onProcessing?: () => void) => Promise<boolean>;
  isTraining: boolean;
}

export const UseTrainingStatusWebSocket = create<TrainingStatusSocketState>((set, get) => ({
  socket: null,
  isTraining: false,

  connect: (modelversionId: number, onStatus) => {
    // console.log('[connect] called');

    const currentSocket = get().socket;
    // console.log('[connect] current readyState =', currentSocket?.readyState);

    if (
      currentSocket &&
      ([WebSocket.OPEN, WebSocket.CONNECTING] as const).includes(currentSocket.readyState as 0 | 1)
    ) {
      // console.log('[connectTrainingStatus] skipping: socket already connected or connecting');
      return;
    }

    // For MockTrainingStatusWebSocket
    // const socket = new MockTrainingWebSocket(modelversionId);

    const socketUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://127.0.0.1:8010'}/${API_ROUTES.socket.training_status}/${modelversionId}`;
    const socket = new WebSocket(socketUrl);

    console.log('[connectTrainingStatus] WebSocket created', socket);

    socket.onopen = () => {
      console.log('[connectTrainingStatus] WebSocket training status connected');
      set({ socket: socket });
    };
    
    socket.onerror = (event) => {
      console.error('[connectTrainingStatus] WebSocket error event:', event);
      showError('WebSocket training status connection error.');
    };
    
    socket.onclose = (event) => {
      console.log(`WebSocket training status closed, code: ${event.code}, reason: ${event.reason}`);
      set({ socket: null, isTraining: false });
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Message from WebSocket training status:', data);
    
        if (data.status === 'success') {
          set({ isTraining: false });
          onStatus?.('success');
        } else if (data.status === 'error') {
          set({ isTraining: false });
          onStatus?.('error');
        }
      } catch (err) {
        console.error('Failed to parse [connectTrainingStatus] WebSocket message:', err);
      }
    };

    // call connect() only for mock
    // if (socket instanceof MockTrainingStatusWebSocket) {
    //   socket.connect(modelversionId);
    // }

  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      console.log('[disconnectTrainingStatus] closing WebSocket...');
      socket.close();
      set({ socket: null, isTraining: false });
    }
  },

  cancel: async () => {
    const socket = get().socket;

    if (socket?.readyState === WebSocket.OPEN) {
      try {
        console.log('[cancelTrainingStatus] closing WebSocket...');
        socket.close();
        set({ socket: null, isTraining: false });
        return true;
      } catch (err) {
        console.error('[cancelTraining] Error:', err);
        return false;
      }
    }

    console.warn('[cancelTrainingStatus] WebSocket already closed or not connected');
    set({ socket: null, isTraining: false });
    return false;
  },

  
  // send: async (payload, onProcessing) => {
  //   const socket = get().socket;

  //   if (socket?.readyState === WebSocket.OPEN) {
  //     console.log('[sendTraining] sending payload:', payload);
  //     socket.send(JSON.stringify(payload));
  //     set({ isTraining: true });
  //     onProcessing?.();
  //     return true;
  //   } else {
  //     console.warn('[sendTraining] WebSocket training status not ready');
  //     showError('WebSocket training status is not connected.');
  //     return false;
  //   }
  // },

}));
