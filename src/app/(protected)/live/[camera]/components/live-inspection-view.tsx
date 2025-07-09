"use client";

import { useState, useEffect } from "react";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { formatNumber, toNumber } from "@/app/utils/format";
import { useLiveSocketStore } from '@/app/stores/useLiveSocketStore';
import { Planning } from "@/app/types/planning";
import { startPlansConfirmation, stopPlans } from "@/app/libs/services/planning";
import SummaryBox from "./summary-box";
import CameraBox from "./camera-box";
import DetectionBox from "./detection-box";
import CurrentInspectionBox from "./current-Inspection-box"
import PlanningConfirmationModal from "./plans-confirm-model"
import { LiveInspection, CurrentInspection, DetectionInfo } from "@/app/types/live";

const emptyData: LiveInspection = {
  liveStream: '',
  location: 'Loading...',
  cameraId: '',
  cameraName: '',
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

export default function LiveInspectionViewPage({ cameraId }: { cameraId: string }) {
  const { socket, connect } = useLiveSocketStore();
  const [data, setData] = useState<LiveInspection>(emptyData);
  const [plans, setPlans] = useState<Planning[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // const [test, setTest] = useState<any>(null);
  // const fetchTestAPI = async () => {
  //   try {
  //     const res = await fetch("http://127.0.0.1:8022/getTestAPI", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }

  //     const data = await res.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Fetch failed:", error);
  //     throw error;
  //   }
  // };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await fetchTestAPI();
  //       setTest(result);
  //     } catch (err: any) {
  //       console.error(err.message || "Unknown error");
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    if (!socket) {
      connect(cameraId);
      return;
    }

    socket.onmessage = (event: MessageEvent) => {
      const incoming = JSON.parse(event.data);
      if (incoming.cameraId === cameraId) {
        setData(incoming);
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
      {/* <div>
        <h1>API Data:</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div> */}

      {/* SummaryBox */}
      <div className="grid grid-cols-4 gap-4 text-center text-2xl font-semibold p-4 rounded-t">
        <SummaryBox label="Lot No." value={data?.lotNo} loading={loading} />
        <SummaryBox label="Total NG" value={formatNumber(toNumber(data?.totalNG))} loading={loading} />
        <SummaryBox label="Total Product" value={formatNumber(toNumber(data?.totalProduct))} loading={loading} />
        <SummaryBox label="Actual" value={formatNumber(toNumber(data?.actualProduct))} loading={loading} />
      </div>

      {/* Main Grid Layout (Camera | CurrentInspection + Status + Detection) */}
      <div className="grid grid-cols-[820px_1fr] mt-0 rounded-b px-4 ">

        {/* LEFT SIDE */}
        <div className="space-y-4">
          <CameraBox location={data?.location} cameraName={data?.cameraName} liveStream={data?.liveStream} loading={loading} />
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          <CurrentInspectionBox data={data?.currentInspection} loading={loading} onStartPlan={handleStartPlan} />

          {/* Status */}
          <div
            className={`font-bold text-6xl flex justify-center items-center py-7 rounded
            ${loading
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
                ? Array.from({ length: data?.detectionInfo?.length }, (_, i) => ({
                  function: "",
                  predicted: "",
                  expected: "",
                  confident: 0,
                  status: "",
                }))
                : data.detectionInfo
            }
            loading={loading}
          />
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

