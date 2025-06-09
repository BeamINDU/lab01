// src/app/(protected)/report/defect-summary/components/report-defect-filter.tsx
'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchFieldResponsive from '@/app/components/common/SearchField';
import { getProductTypeNameOptions } from "@/app/libs/services/product-type";
import { getDefectTypeNameOptions } from "@/app/libs/services/defect-type";
import { getLotNoOptions } from "@/app/libs/services/report-defect-summary";

interface ReportDefectFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function ReportDefectFilterForm({ register, setValue, onSearch }: ReportDefectFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Lot No - ใช้ข้อมูลจาก report service */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="lotNo"
          label="Lot No"
          placeholder="Search or enter lot number..."
          dataLoader={getLotNoOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
        
        {/* Product Type Name - ใช้ Product Type Options */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="productTypeName"
          label="Product Type Name"
          placeholder="Search product type..."
          dataLoader={getProductTypeNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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