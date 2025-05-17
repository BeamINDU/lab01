'use client';

import { Search } from 'lucide-react'
import { UseFormRegister } from "react-hook-form";

interface DefectTypeFilterFormProps {
  register: UseFormRegister<any>;
  onSearch: () => void;
}

export default function DefectTypeFilterForm({ register, onSearch }: DefectTypeFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Defect Type ID */}
        <div className="grid grid-cols-[120px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Defect Type ID</label>
          <input
            type="text"
            {...register("defectTypeId")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Defect Type Name */}
        <div className="grid grid-cols-[120px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Defect Type Name</label>
          <input
            type="text"
            {...register("defectTypeName")}
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
