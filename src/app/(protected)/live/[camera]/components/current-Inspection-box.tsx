"use client";

import { formatDate, formatTime } from "@/app/utils/date";

interface currentInspection {
  productId: string
  productName: string
  serialNo: string
  productDateTime: Date | string
}

type CurrentInspectionBoxProps = {
  data: currentInspection;
  loading: boolean;
};

export default function CurrentInspectionBox ({ data, loading }: CurrentInspectionBoxProps) {
  return (
    <div>
      <div
        className={`font-semibold px-2 py-2 rounded-t text-center
          ${loading ? "bg-gray-300 text-transparent animate-pulse" : "bg-black text-white"}`}
      >
        Current Inspection
      </div>
      <div className="bg-white border p-2 text-lg rounded-b space-y-2">
        <Field label="Product ID" value={data?.productId} loading={loading} />
        <Field label="Product Name" value={data?.productName} loading={loading} />
        <Field label="Serial No" value={data?.serialNo} loading={loading} />
        <Field label="Production Date" value={formatDate(data?.productDateTime)} loading={loading} />
        <Field label="Production Time" value={formatTime(data?.productDateTime)} loading={loading} />
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  loading: boolean;
};

function Field ({ label, value, loading }: FieldProps) {
  return (
    <div className="flex items-center space-x-2 text-gray-800">
      <b>{label}</b>
      <span>:</span>
      <span className={ loading ? "w-48 h-6 bg-gray-300 animate-pulse rounded" : "" }>
        {loading ? "\u00A0" : value}
      </span>
    </div>
  )
}