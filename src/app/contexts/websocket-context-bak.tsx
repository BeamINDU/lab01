'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { usePopupTraining } from '@/app/contexts/popup-training-context';
import { MockTrainingWebSocket } from "@/app/mocks/mock-traning-websocket";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'

type WebSocketPayload = {
  action: string;
  data: any;
};

interface WebSocketContextType {
  send: (payload: WebSocketPayload) => void;
  cancelConnection: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | MockTrainingWebSocket | null>(null);
  const { displayProcessing, displaySuccess, displayError, hidePopup } = usePopupTraining();

  useEffect(() => {
    const isDev = process.env.NODE_ENV !== "production";
    const socketUrl = process.env.NEXT_PUBLIC_TRANING_SOCKET_URL || 'ws://localhost:8000/ws/training';
  
    ws.current = isDev
      ? new MockTrainingWebSocket()
      : new WebSocket(`${socketUrl}`);
  
    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };
  
    ws.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.status === 'done') {
        displaySuccess('Model training completed.');
      } else if (data.status === 'error') {
        displayError('Model training failed.');
      }
    };
  
    if ('connect' in ws.current && typeof ws.current.connect === 'function') {
      (ws.current as MockTrainingWebSocket).connect();
    }
  
    return () => {
      ws.current?.close();
    };
  }, [displayProcessing, displaySuccess, displayError]);

  
  const send = async (payload: WebSocketPayload) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      displayProcessing('Detection model training...');
      await new Promise((resolve) => setTimeout(resolve, 7000));
      ws.current.send(JSON.stringify(payload));
    } else {
      showError('WebSocket is not connected yet');
    }
  };

  const cancelConnection = async () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const result = await showConfirm('Are you sure you want to cancel this training model?')
      if (result.isConfirmed) {
        ws.current.close();
        console.info('WebSocket connection cancelled.');
        showSuccess('Training cancelled by user.');
        hidePopup();
      }
    }
  };

  return (
    <WebSocketContext.Provider value={{ send, cancelConnection }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used inside WebSocketProvider');
  return ctx;
}; 

