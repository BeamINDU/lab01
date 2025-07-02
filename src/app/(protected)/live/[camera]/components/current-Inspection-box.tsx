"use client";

import { formatDate, formatTime } from "@/app/utils/date";
import { CurrentInspection } from "@/app/types/live";

type CurrentInspectionBoxProps = {
  data: CurrentInspection;
  loading: boolean;
  onStartPlan: () => void;
};

export default function CurrentInspectionBox({ data, loading, onStartPlan }: CurrentInspectionBoxProps) {
  return (
    <div className="grid grid-cols-2 gap-0 text-lg font-semibold space-y-1 items-center">
      <Field label="Product ID" value={data?.productId} loading={loading} />
      <Field label="Product Name" value={data?.productName} loading={loading} />
      <Field label="Serial No" value={data?.serialNo} loading={loading} />
      <Field label="Production Date" value={formatDate(data?.productDateTime)} loading={loading} />
      <Field label="Production Time" value={formatTime(data?.productDateTime)} loading={loading} />
      
      {/* ปุ่มให้กิน 1 คอลัมน์ และจัดชิดขวา */}
      <div
        className={`${loading ? "animate-pulse" : ""} justify-self-end`}
      >
        {loading ? (
          <div className="w-28 h-10 bg-gray-300 animate-pulse" />
        ) : (
          <button
            className="w-20 text-sm bg-blue-400 text-white font-semibold px-2 py-1 rounded hover:bg-blue-500 transition"
            onClick={onStartPlan}
          >
            START
          </button>
        )}
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  loading: boolean;
};

function Field({ label, value, loading }: FieldProps) {
  return (
    <div className="flex items-center space-x-2 text-gray-800">
      <b>{label}</b>
      <span>:</span>
      <span className={loading ? "w-36 h-6 bg-gray-300 animate-pulse rounded" : ""}>
        {loading ? "\u00A0" : value}
      </span>
    </div>
  )
}