import { create } from 'zustand';
import { MockTrainingWebSocket } from '@/app/mocks/mock-traning-websocket';
import { showSuccess, showError } from '@/app/utils/swal';
import { API_ROUTES } from "@/app/constants/endpoint";

// interface WebSocketPayload {
//   action: string;
//   data: any;
// }

interface TrainingSocketState {
  socketTraining: WebSocket | MockTrainingWebSocket | null;
  currentModelVersionId: number | null;
  connectTraining: ( modelversionId: number, onStatus?: (status: 'completed' | 'completed all' | 'error') => void) => void;
  disconnectTraining: () => void;
  // sendTraining: (payload: WebSocketPayload, onProcessing?: () => void) => Promise<boolean>;
  cancelTraining: () => Promise<boolean>;
}

export const useTrainingSocketStore = create<TrainingSocketState>((set, get) => ({
  socketTraining: null,
  currentModelVersionId: null,

  connectTraining: (modelversionId, onStatus) => {
    const { socketTraining, currentModelVersionId, disconnectTraining } = get();

    const isConnected =
      socketTraining &&
      [WebSocket.OPEN, WebSocket.CONNECTING].includes(socketTraining.readyState as 0 | 1);

    // if (isConnected) {
    //   if (currentModelVersionId === modelversionId) {
    //     console.log('[Training] Already connected to this modelversionId, skipping...');
    //     return;
    //   } else {
    //     console.log('[Training] Switching modelversionId, disconnecting previous...');
    //     disconnectTraining();
    //   }
    // }

    if (isConnected) {
      if (currentModelVersionId === modelversionId) return;
      console.log('[Training] Switching modelversionId. Disconnecting...');
      disconnectTraining();
    }

    const socketUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://127.0.0.1:8010'}/${API_ROUTES.socket.training_action}/${modelversionId}`;
    const socket = new WebSocket(socketUrl);
    // console.log('[Training] WebSocket created:', socket);

    socket.onopen = () => {
      console.log('[Training] WebSocket connected');
      set({ socketTraining: socket, currentModelVersionId: modelversionId });
    };

    socket.onerror = (event) => {
      console.error('[Training] WebSocket error event:', event);
      showError('[Training] WebSocket connection error.');
    };

    socket.onclose = (event) => {
      console.log(`[Training] WebSocket training closed, code: ${event.code}, reason: ${event.reason}`);
      set({ socketTraining: null, currentModelVersionId: null });
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const status = data.status;
        
        console.log(`[Training] Current modelVersionId: ${modelversionId}`);
        console.log('[Training] Message:', data);

        if (status === 'completed all') {
          onStatus?.('completed all');
          get().disconnectTraining();
        } else if (status === 'error') {
          onStatus?.('error');
        }
      } catch (err) {
        console.error('[Training] Message parse error:', err);
      }
    };

    // For Mock WebSocket (uncomment if needed)
    // if (socket instanceof MockTrainingWebSocket) {
    //   socket.connect(modelversionId);
    // }
  },

  disconnectTraining: () => {
    const socket = get().socketTraining;
    if (socket) {
      console.log('[Training] Closing WebSocket...');
      socket.close();
      set({ socketTraining: null, currentModelVersionId: null });
    }
  },

  cancelTraining: async () => {
    const socket = get().socketTraining;

    if (socket?.readyState === WebSocket.OPEN) {
      try {
        console.log('[Training] Closing WebSocket...');
        socket.close();
        set({ socketTraining: null, currentModelVersionId: null });
        return true;
      } catch (err) {
        console.error('[Training] WebSocket error:', err);
        return false;
      }
    }

    console.warn('[Training] WebSocket already closed or not connected');
    set({ socketTraining: null, currentModelVersionId: null });
    return false;
  },

  
  // sendTraining: async (payload, onProcessing) => {
  //   const socket = get().socketTraining;

  //   if (socket?.readyState === WebSocket.OPEN) {
  //     console.log('[Training] Sending payload:', payload);
  //     socket.send(JSON.stringify(payload));
  //     onProcessing?.();
  //     return true;
  //   } else {
  //     console.warn('[Training] WebSocket training not ready');
  //     showError('WebSocket training is not connected.');
  //     return false;
  //   }
  // },

}));
