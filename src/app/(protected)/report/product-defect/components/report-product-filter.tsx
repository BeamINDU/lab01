// src/app/(protected)/report/product-defect/components/report-product-filter.tsx
'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, Control, UseFormSetValue } from "react-hook-form";
import SearchFieldResponsive from '@/app/components/common/SearchField';
import DateTimeField from '@/app/components/common/DateTimeField'; // ✅ ใช้ DateTimeField แทน
import { getProductNameOptions } from "@/app/libs/services/product";
import { getDefectTypeNameOptions } from "@/app/libs/services/defect-type";
import { getCameraIdOptions, getCameraNameOptions } from "@/app/libs/services/camera";

interface ReportProductFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  onSearch: () => void;
}

export default function ReportProductFilterForm({ register, setValue, control, onSearch }: ReportProductFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      {/* Date Range Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* ✅ Date From - ใช้ DateTimeField */}
        <DateTimeField
          control={control}
          fieldName="dateFrom"
          label="Date From"
          placeholder="YYYY-MM-DD HH:mm"
          variant="datetime"
          format="YYYY-MM-DD HH:mm"
          ampm={false}
          timeSteps={{ minutes: 1 }}
          closeOnSelect={false}
          className="w-full"
        />
        
        {/* ✅ Date To - ใช้ DateTimeField */}
        <DateTimeField
          control={control}
          fieldName="dateTo"
          label="Date To"
          placeholder="YYYY-MM-DD HH:mm"
          variant="datetime"
          format="YYYY-MM-DD HH:mm"
          ampm={false}
          timeSteps={{ minutes: 1 }}
          closeOnSelect={false}
          className="w-full"
        />
        
        {/* Camera ID - ใช้ Camera Options */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="cameraId"
          label="Camera ID"
          placeholder="Search camera..."
          dataLoader={getCameraIdOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />
      </div>
      
      {/* Search Fields Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        
        {/* Product Name - ใช้ Product Options */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="productName"
          label="Product Name"
          placeholder="Search product..."
          dataLoader={getProductNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />
        
        {/* Defect Type - ใช้ Defect Type Options */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="defectTypeName"
          label="Defect Type Name"
          placeholder="Search defect type..."
          dataLoader={getDefectTypeNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />
        
        {/* Search Button  */}
        <div className="hidden xl:flex items-center justify-start pt-[2px]">
          <button
            type="button"
            className="flex items-center gap-1 bg-[#004798] text-white px-4 py-2 rounded hover:bg-blue-900 whitespace-nowrap"
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