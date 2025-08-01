'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import { getCameraIdOptions, getCameraNameOptions, getCameraLocationOptions, getCameraIpOptions } from "@/app/libs/services/camera";
import { ActiveStatus } from '@/app/constants/status';

interface CameraFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function CameraFilterForm({ register, setValue, onSearch }: CameraFilterFormProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[3fr_3fr_3fr_1fr] gap-4">
        {/* Camera ID */}
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
        
        {/* Camera Name */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="cameraName"
          label="Camera Name"
          placeholder="Search camera name..."
          dataLoader={getCameraNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />

        {/* IP Address */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="cameraIp"
          label="IP Address"
          placeholder="Search ip address..."
          dataLoader={getCameraIpOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />

        {/* <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-start sm:items-center gap-2">
          <label className="font-semibold text-sm sm:text-base whitespace-nowrap min-w-[130px] sm:min-w-[150px]">IP Address</label>
          <input
            {...register("cameraIp")}
            placeholder="Search ip address..."
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div> */}

      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[3fr_3fr_3fr_1fr] gap-4">
        {/* Location */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="location"
          label="Location"
          placeholder="Search location..."
          dataLoader={getCameraLocationOptions}
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
        <div className="flex items-end">
          <button
            className="flex items-center gap-1 btn-primary-dark text-white px-4 py-2 rounded hover:bg-blue-900 whitespace-nowrap"
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