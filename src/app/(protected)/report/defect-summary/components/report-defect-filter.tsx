// src/app/(protected)/report/defect-summary/components/report-defect-filter.tsx
'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import { getProductTypeOptions } from "@/app/libs/services/product-type";
import { getDefectTypeOptions } from "@/app/libs/services/defect-type";
import { search as searchReportDefects } from "@/app/libs/services/report-defect-summary";

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
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="lotNo"
          label="Lot No"
          placeholder="Search or enter lot number..."
          dataLoader={async () => {
            const reportData = await searchReportDefects();
            return reportData.map(r => ({ lotNo: r.lotNo }));
          }}
          labelField="lotNo"
          valueField="lotNo"
          allowFreeText={true}
        />
        
        {/* Product Type - ใช้ Product Type Options */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productType"
          label="Product Type"
          placeholder="Search product type..."
          dataLoader={async () => {
            const options = await getProductTypeOptions();
            // แปลง SelectOption เป็น format ที่ SearchField ต้องการ
            return options.map(opt => ({
              productType: opt.label
            }));
          }}
          labelField="productType"
          valueField="productType"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Defect Type - ใช้ Defect Type Options */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="defectType"
          label="Defect Type"
          placeholder="Search defect type..."
          dataLoader={async () => {
            const options = await getDefectTypeOptions();
            // แปลง SelectOption เป็น format ที่ SearchField ต้องการ
            return options.map(opt => ({
              defectType: opt.label
            }));
          }}
          labelField="defectType"
          valueField="defectType"
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