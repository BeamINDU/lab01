'use client';

import { Search } from 'lucide-react'
import { UseFormRegister } from "react-hook-form";

interface ReportProductFilterFormProps {
  register: UseFormRegister<any>;
  onSearch: () => void;
}

export default function ReportProductFilterForm({ register, onSearch }: ReportProductFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Date From */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Date From</label>
          <input
            type="text"
            {...register("dateFrom")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        {/* Date To */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Date To</label>
          <input
            type="text"
            {...register("dateTo")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Lot No */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Lot No</label>
          <input
            type="text"
            {...register("lotNo")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        {/* Product ID */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Product ID</label>
          <input
            type="text"
            {...register("productId")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        {/* Camera ID */}
        {/* <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Camera ID</label>
          <input
            type="text"
            {...register("cameraId")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div> */}
        {/* Search Button */}
        <div className="flex items-center justify-start pt-[2px]">
          <button
            className="flex items-center gap-1 bg-[#004798] text-white px-4 py-2 rounded hover:bg-blue-900"
            onClick={onSearch}
          >
            Search
            <Search size={16} className="mt-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
