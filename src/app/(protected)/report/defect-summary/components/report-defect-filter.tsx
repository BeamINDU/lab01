// src/app/(protected)/report/defect-summary/components/report-defect-filter.tsx
'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import { search as searchReportDefects } from "@/app/lib/services/report-defect-summary";
import { search as searchProductTypes } from "@/app/lib/services/product-type";
import { search as searchDefectTypes } from "@/app/lib/services/defect-type";

interface ReportDefectFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function ReportDefectFilterForm({ register, setValue, onSearch }: ReportDefectFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Lot No */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="lotNo"
          label="Lot No"
          placeholder="Search or enter lot number..."
          dataLoader={searchReportDefects}
          labelField="lotNo"
          valueField="lotNo"
          allowFreeText={true}
        />
        
        {/* Product Type */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productType"
          label="Product Type"
          placeholder="Search or enter product type..."
          dataLoader={async () => {

            const [reportData, productTypes] = await Promise.all([
              searchReportDefects(),
              searchProductTypes()
            ]);
            
            const reportProductTypes = reportData.map(r => ({ productType: r.productType }));
            const masterProductTypes = productTypes.map(p => ({ productType: p.productTypeName }));
            
            return [...reportProductTypes, ...masterProductTypes];
          }}
          labelField="productType"
          valueField="productType"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Defect Type - แปลงจาก input เป็น SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="defectType"
          label="Defect Type"
          placeholder="Search or enter defect type..."
          dataLoader={async () => {
            const [reportData, defectTypes] = await Promise.all([
              searchReportDefects(),
              searchDefectTypes()
            ]);
            
            const reportDefectTypes = reportData.map(r => ({ defectType: r.defectType }));
            const masterDefectTypes = defectTypes.map(d => ({ defectType: d.defectTypeName }));
            
            return [...reportDefectTypes, ...masterDefectTypes];
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