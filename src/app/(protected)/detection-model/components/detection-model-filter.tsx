'use client';

import { Search } from 'lucide-react'
import { UseFormRegister } from "react-hook-form";

interface ProductFilterFormProps {
  register: UseFormRegister<any>;
  onSearch: () => void;
}

export default function ProductFilterForm({ register, onSearch }: ProductFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Model ID */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Model ID</label>
          <input
            type="text"
            {...register("modelId")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        {/* Model Name */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Model Name</label>
          <input
            type="text"
            {...register("modelName")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        {/* Version */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Version</label>
          <input
            type="number"
            {...register("version")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Function */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Function</label>
          <input
            type="text"
            {...register("function")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        {/* Status */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Status</label>
          <input
            type="text"
            {...register("status")}
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
