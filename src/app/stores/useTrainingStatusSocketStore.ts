import { create } from 'zustand';
import { showSuccess, showError } from '@/app/utils/swal';
import { API_ROUTES } from "@/app/constants/endpoint";
import { ModelStatus } from "@/app/constants/status"

interface WebSocketPayload {
  action: string;
  data: any;
}

type WSLike = WebSocket | any; // หรือใช้ type guard ถ้าต้องการจำกัด mock ให้ปลอดภัยขึ้น

interface TrainingStatusSocketState {
  socket: WSLike | null;
  currentModelVersionId: number | null;
  connectStatus: (modelversionId: number, onStatus?: (status: 'Training' | 'Ready' | 'Error') => void) => void;
  disconnectStatus: () => void;
  cancelStatus: () => Promise<boolean>;
  // send: (payload: WebSocketPayload, onProcessing?: () => void) => Promise<boolean>;
  isTraining: boolean;
}

const useMockSocket = false; // toggle ใช้ mock socket

export const UseTrainingStatusWebSocket = create<TrainingStatusSocketState>((set, get) => ({
  socket: null,
  currentModelVersionId: null,
  isTraining: false,

  connectStatus: (modelversionId, onStatus) => {
    const { socket, currentModelVersionId, disconnectStatus } = get();

    const isConnected = socket && [WebSocket.OPEN, WebSocket.CONNECTING].includes(socket.readyState);

    if (isConnected) {
      if (currentModelVersionId === modelversionId) return;
      console.log('[TrainingStatus] Switching modelversionId. Disconnecting...');
      disconnectStatus();
    }

    let newSocket: WSLike;

    if (useMockSocket) {
      // newSocket = new MockTrainingStatusWebSocket(modelversionId);
    } else {
      const socketUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://127.0.0.1:8010'}/${API_ROUTES.socket.training_status}/${modelversionId}`;
      newSocket = new WebSocket(socketUrl);
    }

    newSocket.onopen = () => {
      console.log('[TrainingStatus] WebSocket connected');
      set({ socket: newSocket, currentModelVersionId: modelversionId });
    };

    newSocket.onerror = (event: Event) => {
      console.error('[TrainingStatus] WebSocket error:', event);
      showError('[TrainingStatus] WebSocket connection error.');
    };

    newSocket.onclose = (event: CloseEvent) => {
      console.log(`[TrainingStatus] WebSocket closed. code=${event.code}, reason=${event.reason}`);
      set({ socket: null, isTraining: false, currentModelVersionId: null });
    };

    newSocket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const modelstatus = data.data[0].modelstatus;
        console.log('[TrainingStatus] Message:', { modelVersionId:modelversionId, status:modelstatus });
        // console.log('[TrainingStatus] Message:', data);

        if (modelstatus === ModelStatus.Training) {
          set({ isTraining: true });
          onStatus?.('Training');
        } else if (modelstatus === ModelStatus.Ready) {
          set({ isTraining: false });
          onStatus?.('Ready');
          get().disconnectStatus();
        }
      } catch (err) {
        console.error('[TrainingStatus] Message parse error:', err);
        onStatus?.('Error');
      }
    };
  },

  disconnectStatus: () => {
    const socket = get().socket;
    if (socket) {
      console.log('[TrainingStatus] Closing WebSocket...');
      socket.close?.();
      set({ socket: null, isTraining: false, currentModelVersionId: null });
    }
  },

  cancelStatus: async () => {
    const socket = get().socket;

    if (socket?.readyState === WebSocket.OPEN) {
      try {
        console.log('[TrainingStatus] Closing WebSocket...');
        socket.close?.();
        set({ socket: null, isTraining: false, currentModelVersionId: null });
        return true;
      } catch (err) {
        console.error('[TrainingStatus] WebSocket error:', err);
        return false;
      }
    }

    console.warn('[TrainingStatus] WebSocket already closed or not connected');
    set({ socket: null, isTraining: false, currentModelVersionId: null });
    return false;
  },

  // send: async (payload, onProcessing) => {
  //   const socket = get().socket;

  //   if (socket?.readyState === WebSocket.OPEN) {
  //     try {
  //       console.log('[TrainingStatus] Sending payload:', payload);
  //       socket.send(JSON.stringify(payload));
  //       set({ isTraining: true });
  //       onProcessing?.();
  //       return true;
  //     } catch (err) {
  //       console.error('[TrainingStatus] Failed to send:', err);
  //       showError('Failed to send training data.');
  //       return false;
  //     }
  //   } else {
  //     console.warn('[TrainingStatus] WebSocket not ready');
  //     showError('WebSocket is not connected.');
  //     return false;
  //   }
  // },

}));
