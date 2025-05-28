"use client";

import { useState, useEffect } from "react";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { formatNumber } from "@/app/utils/format";
import { formatDate, formatTime } from "@/app/utils/date";
import { LiveInspectionView } from "@/app/types/live"
import { detail } from "@/app/lib/services/live";

const LiveInspectionViewPage = ({ camera }: { camera: string }) => {
  const [data, setData] = useState<LiveInspectionView | null>(null);

  useEffect(() => {
    if (!camera) return;
  
    const fetchData = async () => {
      try {
        // const result = await detail(camera);
        // setData(result);
      } catch (error) {
        console.error(error);
        showError('Failed to load inspection detail');
        setData(null);
      }
    };
  
    fetchData();
  }, [camera]);

  if (!data) {
    return (
      <div className="p-4 text-center text-lg text-gray-600">
        Loading inspection data...
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-sky-300 p-2 text-xl font-bold text-black">
        {data?.location}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Left side - Camera Box */}
        <div className="bg-gray-200">
          <div className="bg-black text-white px-4 py-2 font-semibold">
            {data?.cameraName}
          </div>
          <div className="flex items-center justify-center h-[480px] bg-gray-300 text-black text-center">
            Picture 640 × 480
          </div>
        </div>

        {/* Right side - Status & Info */}
        <div className="space-y-4">
          <div className="bg-gray-200 text-center text-5xl font-bold py-9">
            STATUS : {data?.status}
          </div>

          <div className="bg-gray-200 p-6 text-black space-y-2 text-xl leading-10 h-[392px]">
            <p><b>Product ID</b> : {data?.productId}</p>
            <p><b>Product Name</b> : {data?.productName}</p>
            <p><b>Product Type</b> : {data?.productTypeName}</p>
            <p><b>Serial No</b> : {data?.serialNo}</p>
            <p><b>Defect Type</b> : {data?.defectType}</p>
            <p><b>Production Date</b> : {formatDate(data?.productionDateTime)}</p>
            <p><b>Production Time</b> : {formatTime(data?.productionDateTime)}</p>
          </div>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <SummaryBox label="Lot No." value={data?.lotNo} />
        <SummaryBox label="Total NG Product" value={formatNumber(data?.totalNG)} />
        <SummaryBox label="Total Planning Product" value={formatNumber(data?.totalPlanning)} />
        <SummaryBox label="Actual Planning Product" value={formatNumber(data?.actualPlanning)} />
      </div>
    </div>
  );
};

type SummaryBoxProps = {
  label: string;
  value: string | number;
};

function SummaryBox({ label, value }: SummaryBoxProps) {
  return (
    <div className="bg-gray-200 p-6 text-center rounded">
      <div className="text-5xl font-semibold">{value}</div>
      <div className="text-lg">{label}</div>
    </div>
  );
}

export default LiveInspectionViewPage;
