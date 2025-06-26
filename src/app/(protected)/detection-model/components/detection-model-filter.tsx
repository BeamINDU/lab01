'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, Control, UseFormSetValue } from "react-hook-form";
import { getModelNameOptions, getFunctionOptions } from "@/app/libs/services/detection-model";
import SearchFieldResponsive  from '@/app/components/common/SearchField';
import { ActiveStatus } from '@/app/constants/status'; 

interface ProductFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  onSearch: () => void;
}

export default function ProductFilterForm({register, setValue, control, onSearch }: ProductFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Model Name */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="modelName"
          label="Model Name"
          placeholder="Search plan ID..."
          dataLoader={getModelNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />
        {/* Version */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-start sm:items-center gap-2">
          <label className="font-semibold text-sm sm:text-base whitespace-nowrap min-w-[130px] sm:min-w-[150px]">Version</label>
          <input
            type="number"
            {...register("version")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Function */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="function"
          label="Function"
          placeholder="Search Function..."
          dataLoader={getFunctionOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />
        {/* Status */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="status"
          label="Status"
          placeholder="Select status..."
          options={[
            { label: "All", value: "" },
            ...ActiveStatus.map(status => ({
              label: status.label,
              value: String(status.value),
            }))
          ]}
          allowFreeText={false}
        />
        {/* Search Button */}
        <div className="flex items-center justify-start pt-[2px]">
          <button
            className="flex items-center gap-1 btn-primary-dark text-white px-4 py-2 rounded hover:bg-blue-900"
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
