import { Search } from 'lucide-react'
import { UseFormRegister } from "react-hook-form";

interface ProductTypeFilterFormProps {
  register: UseFormRegister<any>;
  onSearch: () => void;
}

export default function ProductTypeFilterForm({ register, onSearch }: ProductTypeFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Product Type ID */}
        <div className="grid grid-cols-[110px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Product Type ID</label>
          <input
            type="text"
            {...register("productTypeId")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        {/* Product Type Name */}
        <div className="grid grid-cols-[130px_1fr] items-center gap-2">
          <label className="font-semibold w-[150px]">Product Type Name</label>
          <input
            type="text"
            {...register("productTypeName")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status - เปลี่ยนจาก input เป็น select */}
        <div className="grid grid-cols-[110px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Status</label>
          <select
            {...register("status", { valueAsNumber: true })}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
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