'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import { search as searchCameras } from "@/app/libs/services/camera";
import { ActiveStatus } from '@/app/constants/status';

interface CameraFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function CameraFilterForm({ register, setValue, onSearch }: CameraFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Camera ID - SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="cameraId"
          label="Camera ID"
          placeholder="Search or enter camera ID..."
          dataLoader={searchCameras}
          labelField="cameraId"
          valueField="cameraId"
          allowFreeText={true}
        />
        
        {/* Camera Name - SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="cameraName"
          label="Camera Name"
          placeholder="Search or enter camera name..."
          dataLoader={searchCameras}
          labelField="cameraName"
          valueField="cameraName"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Location - SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="location"
          label="Location"
          placeholder="Search or enter location..."
          dataLoader={searchCameras}
          labelField="location"
          valueField="location"
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
            { id: "all", label: "All", value: "" },
            ...ActiveStatus.map(status => ({
              id: status.value,
              label: status.label,
              value: status.value 
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