'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

type PopupState = {
  isVisible: boolean;
  message: string;
  status: 'processing' | 'success' | 'error';
};

interface PopupTrainingContextType {
  popup: PopupState;
  displayProcessing: (message: string) => void;
  displaySuccess: (message: string) => void;
  displayError: (message: string) => void;
  hidePopup: () => void;
}

const PopupTrainingContext = createContext<PopupTrainingContextType | null>(null);

export const PopupTrainingProvider = ({ children }: { children: React.ReactNode }) => {
  const [popup, setPopup] = useState<PopupState>({
    isVisible: false,
    message: '',
    status: 'processing',
  });

  const displayProcessing = useCallback((message: string) => {
    setPopup({
      isVisible: true,
      message,
      status: 'processing',
    });
  }, []);

  const displaySuccess = useCallback((message: string) => {
    setPopup({
      isVisible: true,
      message,
      status: 'success',
    });
  }, []);

  const displayError = useCallback((message: string) => {
    setPopup({
      isVisible: true,
      message,
      status: 'error',
    });
  }, []);

  const hidePopup = useCallback(() => {
    setPopup({
      isVisible: false,
      message: '',
      status: 'processing',
    });
  }, []);

  return (
    <PopupTrainingContext.Provider
      value={{
        popup,
        displayProcessing,
        displaySuccess,
        displayError,
        hidePopup,
      }}
    >
      {children}
    </PopupTrainingContext.Provider>
  );
};

export const usePopupTraining = () => {
  const ctx = useContext(PopupTrainingContext);
  if (!ctx) {
    throw new Error('usePopupTraining must be used inside PopupTrainingProvider');
  }
  return ctx;
};
