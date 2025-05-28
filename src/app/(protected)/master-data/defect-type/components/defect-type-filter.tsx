'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import { search as searchDefectTypes } from "@/app/lib/services/defect-type";
import { ActiveStatus } from '@/app/lib/constants/status';

interface DefectTypeFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function DefectTypeFilterForm({ register, setValue, onSearch }: DefectTypeFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Defect Type ID - */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="defectTypeId"
          label="Defect Type ID"
          placeholder="Search or enter defect type ID..."
          dataLoader={searchDefectTypes}
          labelField="defectTypeId"
          valueField="defectTypeId"
          allowFreeText={true}
        />
        
        {/* Defect Type Name  */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="defectTypeName"
          label="Defect Type Name"
          placeholder="Search or enter defect type name..."
          dataLoader={searchDefectTypes}
          labelField="defectTypeName"
          valueField="defectTypeName"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status  */}
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
        />
        
        {/* Search Button */}
        <div className="flex items-center justify-start pt-[2px]">
          <button
            type="button"
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