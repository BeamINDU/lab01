"use client";

import { useState, useEffect } from "react";
import { formatNumber, toNumber } from "@/app/utils/format";
import { formatDate, formatTime } from "@/app/utils/date";
import { LiveInspectionView } from "@/app/types/live";
import { useLiveSocketStore } from '@/app/stores/useLiveSocketStore'; 
import Field from "./Field";
import SummaryBox from "./SummaryBox";
import CameraBox from "./CameraBox";

const emptyData: LiveInspectionView = {
  liveStream: '',
  cameraId: "",
  cameraName: "Loading...",
  location: "Loading...",
  status: "",
  productId: "",
  productName: "",
  productTypeId: "",
  productTypeName: "",
  serialNo: "",
  defectType: "",
  productDateTime: "",
  lotNo: "",
  totalNG: "",
  totalPlanning: "",
  actualPlanning: "",
};

const LiveInspectionViewPage = ({ cameraId }: { cameraId: string }) => {
  const { socket, connect } = useLiveSocketStore();
  const [data, setData] = useState<LiveInspectionView>(emptyData);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-white flex flex-col">
      <div className={`bg-sky-300 p-3 text-xl font-bold text-black ${loading ? "animate-pulse" : ""}`}>
        {data.location}
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/2">
            <CameraBox cameraName={data.cameraName} liveStream={data.liveStream} loading={loading} />
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <div className="bg-gray-200 text-center text-3xl md:text-5xl font-bold py-6 md:py-9 flex justify-center items-center gap-4">
              <span>STATUS :</span>
              <span
                className={`flex items-center px-4 py-2 font-semibold w-40 md:w-56 h-12 md:h-14 rounded ${
                  loading ? "text-white bg-gray-300 text-transparent animate-pulse" : ""
                }`}
              >
                {data.status}
              </span>
            </div>

            <div className="bg-gray-200 p-4 md:p-6 text-black space-y-2 text-base md:text-xl leading-8 md:leading-10 max-h-[400px] overflow-auto">
              <Field label="Product ID" value={data.productId} loading={loading} />
              <Field label="Product Name" value={data.productName} loading={loading} />
              <Field label="Product Type" value={data.productTypeName} loading={loading} />
              <Field label="Serial No" value={data.serialNo} loading={loading} />
              <Field label="Defect Type" value={data.defectType} loading={loading} />
              <Field label="Production Date" value={formatDate(data.productDateTime)} loading={loading} />
              <Field label="Production Time" value={formatTime(data.productDateTime)} loading={loading} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2">
          <SummaryBox label="Lot No." value={data.lotNo} loading={loading} />
          <SummaryBox label="Total NG Product" value={formatNumber(toNumber(data.totalNG))} loading={loading} />
          <SummaryBox label="Total Planning Product" value={formatNumber(toNumber(data.totalPlanning))} loading={loading} />
          <SummaryBox label="Actual Planning Product" value={formatNumber(toNumber(data.actualPlanning))} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default LiveInspectionViewPage;
