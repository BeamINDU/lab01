'use client';

import { X } from 'lucide-react';
import { showConfirm, showError, showSuccess } from '@/app/utils/swal';
import { usePopupTraining } from '@/app/contexts/popup-training-context';

import { useTrainingSocketStore } from '@/app/stores/useTrainingSocketStore'; 
// import { useWebSocket } from '@/app/contexts/websocket-context';

export const PopupTraining = () => {
  const { displayProcessing, displayError, hidePopup, popup } = usePopupTraining();
  const { cancelConnection } = useTrainingSocketStore();
  // const { cancelConnection } = useWebSocket();

  if (!popup.isVisible) return null;

  const getStatusStyles = () => {
    switch (popup.status) {
      case 'processing':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'success':
        return 'bg-green-100 border-green-300 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-700';
      default:
        return '';
    }
  };

  const getStatusDot = () => {
    const baseClass = 'w-4 h-4 rounded-full';
    switch (popup.status) {
      case 'processing':
        return <div className={`${baseClass} animate-ping bg-blue-500`} />;
      case 'success':
        return <div className={`${baseClass} bg-green-500`} />;
      case 'error':
        return <div className={`${baseClass} bg-red-500`} />;
      default:
        return null;
    }
  };

  const handleCancel = async () => {
    const result = await showConfirm('Are you sure you want to cancel this training model?');
    console.log(result); 
  
    if (result && result.isConfirmed) {
      const cancelled = await cancelConnection();
      if (cancelled) {
        await showError('Training cancelled by user.');
        displayError('Training cancelled by user.');
      }
    }
  };
  
  return (
    <div
      className={`fixed bottom-5 right-5 z-[1000] rounded-2xl shadow-2xl border-2 w-[430px] min-h-[90px] flex flex-col justify-center items-center text-center transition-all duration-300 ${getStatusStyles()}`}
    >
      <button
        onClick={hidePopup}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
        aria-label="Close popup"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4 justify-start">
        {getStatusDot()}
        <span className="text-sm leading-snug line-clamp-2 max-w-[300px] text-left">
          {popup.message}
        </span>
        {/* <span className="text-md leading-snug truncate max-w-[300px] whitespace-nowrap overflow-hidden">
          {popup.message}
        </span> */}
      </div>

      {/* {popup.status === 'processing' && (
        <button
          onClick={handleCancel}
          className="mt-3 inline-block px-4 py-1 bg-red-300 text-red-800 rounded-lg hover:bg-red-400 text-xs"
        >
          Stop training
        </button>
      )} */}
    </div>
  );
};
