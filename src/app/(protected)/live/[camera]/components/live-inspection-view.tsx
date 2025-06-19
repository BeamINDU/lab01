"use client";

import { useState, useEffect } from "react";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { formatNumber, toNumber } from "@/app/utils/format";
import { useLiveSocketStore } from '@/app/stores/useLiveSocketStore';
import { Planning } from "@/app/types/planning";
import { LiveInspectionView } from "@/app/types/live";
import { startPlansConfirmation, stopPlans } from "@/app/libs/services/planning";
import SummaryBox from "./summary-box";
import CameraBox from "./camera-box";
import DetectionBox from "./detection-box";
import CurrentInspectionBox from "./current-Inspection-box"
import PlanningConfirmationModal from "./plans-confirm-model"

interface detectionInfo {
  title: string
  value: string
  expected: string
  confident: number
  status: string
}

interface currentInspection {
  productId: string
  productName: string
  serialNo: string
  productDateTime: Date | string
}

interface LiveInspection {
  liveStream: string
  location: string
  cameraId: string
  cameraName: string
  status: string
  lotNo: string
  totalNG: number | string
  totalProduct: number | string
  actualProduct: number | string
  currentInspection: currentInspection,
  detectionInfo: detectionInfo[]
}

const emptyData: LiveInspection = {
  liveStream: '',
  location: 'Loading...',
  cameraId: '',
  cameraName: 'Loading...',
  status: '',
  lotNo: '',
  totalNG: '',
  totalProduct: '',
  actualProduct: '',
  currentInspection: {
    productId: '',
    productName: '',
    serialNo: '',
    productDateTime: '',
  },
  detectionInfo: [],
};

const detectionTitles = [
  "Color Detection",
  "Type Classification",
  "Component Detection",
  "Object Counting",
  "Barcode Reading",
];

export default function LiveInspectionViewPage({ cameraId }: { cameraId: string }) {
  const { socket, connect } = useLiveSocketStore();
  const [data, setData] = useState<LiveInspection>(emptyData);
  const [plans, setPlans] = useState<Planning[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!socket) {
      connect(cameraId);
      return;
    }

    socket.onmessage = (event: MessageEvent) => {
      const incoming = JSON.parse(event.data);
      if (incoming.cameraId === cameraId) {
        const detectionInfo = [
          {
            title: detectionTitles[0],
            value: incoming.colorDetection.predictedResult,
            expected: incoming.colorDetection.expected,
            confident: incoming.colorDetection.confident,
            status: incoming.colorDetection.status,
          },
          {
            title: detectionTitles[1],
            value: incoming.typeClassification.predictedResult,
            expected: incoming.typeClassification.expected,
            confident: incoming.typeClassification.confident,
            status: incoming.typeClassification.status,
          },
          {
            title: detectionTitles[2],
            value: incoming.componentDetection.predictedResult,
            expected: incoming.componentDetection.expected,
            confident: incoming.componentDetection.confident,
            status: incoming.componentDetection.status,
          },
          {
            title: detectionTitles[3],
            value: incoming.objectCounting.predictedResult,
            expected: incoming.objectCounting.expected,
            confident: incoming.objectCounting.confident,
            status: incoming.objectCounting.status,
          },
          {
            title: detectionTitles[4],
            value: incoming.barcodeReading.predictedResult,
            expected: incoming.barcodeReading.expected,
            confident: incoming.barcodeReading.confident,
            status: incoming.barcodeReading.status,
          },
        ];
        setData({ ...incoming, detectionInfo });
        setLoading(false);
      }
    };

    socket.onerror = () => {
      console.warn("WebSocket connection error");
      setData(emptyData);
      setLoading(true);
    };

    socket.send(JSON.stringify({ action: "join", cameraId }));

    return () => {
      socket.send(JSON.stringify({ action: "leave", cameraId }));
      socket.close();
    };
  }, [socket, cameraId]);


  const handleStartPlan = async () => {
    try {
      // if (socket?.readyState !== WebSocket.OPEN) {
      //   connect(cameraId);
      //   showSuccess('Socket started');
      // } else {
      //   showError('Socket is already connected');
      // }

      const res = await startPlansConfirmation();
      setPlans(res);

      setIsOpen(true);
    } catch (error) {
      console.error('Failed to open modal:', error);
      showError('Failed to load plans');
    }
  };
  
  const handleStopPlan = async () => {
    const result = await showConfirm('Are you sure you want to stop these plans?')
    if (result.isConfirmed) {
      try {
        // if (socket?.readyState === WebSocket.OPEN) {
        //   socket.send(JSON.stringify({ action: "leave", cameraId }));
        //   socket.close();
        //   showSuccess('Socket stopped');
        // } else {
        //   showError('Socket is already closed');
        // }
        
        // const res = await stopPlans();

        showSuccess(`Planning stop successfully`)
        setIsOpen(false)
      } catch (error) {
        console.error('Failed to stop plan', error);
        showError('Failed to stop plan');
      }
    }
  };

  const handleConfirmPlan = async () => {
    const result = await showConfirm('Are you sure you want to confirm these plans?')
    if (result.isConfirmed) {
      try {
        
        showSuccess(`Planning confirmation successfully`)
        setIsOpen(false)
      } catch (error) {
        console.error('Failed to confirm planning:', error);
        showError('Failed to confirm planning');
      }
    }
  };
  
  return (
    <div className="px-2 py-1">
      {/* Header */}
      {/* <div className={`flex justify-between items-center bg-sky-500 text-white text-xl font-bold text-xl px-4 py-2 rounded-t h-13 ${loading ? "animate-pulse" : ""}`}>
        <span>{data?.location} {data?.cameraName}</span>
        
        <button 
          className="w-24 bg-white text-sky-500 font-semibold px-3 py-1 rounded hover:bg-gray-100 transition"
          onClick={handleStartPlan}
        >
          START
        </button>
      </div> */}

      {/* Main Grid */}
      <div className="grid grid-cols-[820px_1fr] mt-0 bg-gray-100 rounded-b">

        {/* Camera and Summary */}
        <div className="space-y-4">
          {/* Camera */}
          <CameraBox location={data?.location} cameraName={data?.cameraName} liveStream={data?.liveStream} loading={loading} />

          {/* Current Inspection */}
          <CurrentInspectionBox data={data?.currentInspection} loading={loading} onStartPlan={handleStartPlan} />
        </div>

        {/* Status and Detection Info */}
        <div className="space-y-4">

          {/* Status */}
          <div
            className={`font-bold text-6xl flex justify-center items-center py-8 rounded
              ${
                loading
                  ? "bg-gray-400 text-transparent animate-pulse"
                  : data?.status === "OK"
                  ? "bg-green-500 text-white"
                  : "bg-[#FF5050] text-white"
              }
            `}
          >
            <span>STATUS : {data?.status}</span>
          </div>

          {/* Detection Info */}
          <DetectionBox
            items={
              loading
                ? Array.from({ length: 5 }, (_, i) => ({
                    title: detectionTitles[i],
                    value: "",
                    expected: "",
                    confident: 0,
                    status: "",
                  }))
                : data.detectionInfo
            }
            loading={loading}
          />

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 text-center text-2xl font-semibold">
            <SummaryBox label="Lot No." value={data?.lotNo} loading={loading} />
            <SummaryBox label="Total NG" value={formatNumber(toNumber(data?.totalNG))} loading={loading} />
            <SummaryBox label="Total Product" value={formatNumber(toNumber(data?.totalProduct))} loading={loading} />
            <SummaryBox label="Actual" value={formatNumber(toNumber(data?.actualProduct))} loading={loading} />
          </div>
        </div>
      </div>

      {/* Planning Confirmation Modal */}
      {isOpen && (
        <PlanningConfirmationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleConfirmPlan}
          onStop={handleStopPlan}
          plans={plans}
        />
      )}
    </div>
  );
}

