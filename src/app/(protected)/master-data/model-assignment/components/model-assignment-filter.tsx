'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import { getProductIdOptions } from "@/app/libs/services/product";
import { getCameraIdOptions } from "@/app/libs/services/camera";
import { getModelNameOptions } from "@/app/libs/services/detection-model";
import { ActiveStatus } from '@/app/constants/status';

interface ModelAssignmentFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function ModelAssignmentFilterForm({ register, setValue, onSearch }: ModelAssignmentFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Model Name - SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="modelName"
          label="Model Name"
          placeholder="Search model name..."
          dataLoader={getModelNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
        
        {/* Product ID - SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productId"
          label="Product ID"
          placeholder="Search product ID..."
          dataLoader={getProductIdOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Camera ID - SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="cameraId"
          label="Camera ID"
          placeholder="Search camera ID..."
          dataLoader={getCameraIdOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />

        {/* Status */}
        <SearchField
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
          onSelectionChange={(value) => {
            console.log('Status selected:', value, typeof value);
          }}
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