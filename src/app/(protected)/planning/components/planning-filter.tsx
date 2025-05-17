'use client';

import { Search } from 'lucide-react'
import { UseFormRegister } from "react-hook-form";

interface PlanningFilterFormProps {
  register: UseFormRegister<any>;
  onSearch: () => void;
}

export default function PlanningFilterForm({ register, onSearch }: PlanningFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Data From */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Data From</label>
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
        {/* Line ID */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Line ID</label>
          <input
            type="text"
            {...register("lineId")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Product ID */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Product ID</label>
          <input
            type="text"
            {...register("productId")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        {/* lot No */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Lot No</label>
          <input
            type="text"
            {...register("lotNo")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
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
