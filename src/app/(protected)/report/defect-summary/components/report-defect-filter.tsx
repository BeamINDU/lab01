'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchFieldResponsive from '@/app/components/common/SearchField';
import { getProductIdOptions, getProductNameOptions } from "@/app/libs/services/product";
import { getDefectTypeIdOptions, getDefectTypeNameOptions } from "@/app/libs/services/defect-type";
import { getLotNoOptions } from "@/app/libs/services/report-defect-summary";

interface ReportDefectFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function ReportDefectFilterForm({ register, setValue, onSearch }: ReportDefectFilterFormProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[3fr_3fr_3fr_1fr] gap-4">
        {/* Lot No */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="lotNo"
          label="Lot No"
          placeholder="Search lot number..."
          dataLoader={getLotNoOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
        
        {/* Product ID */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="productId"
          label="Product ID"
          placeholder="Search Product ID..."
          dataLoader={getProductIdOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />

        {/* Product Name */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="productName"
          label="Product Name"
          placeholder="Search Product name..."
          dataLoader={getProductNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[3fr_3fr_3fr_1fr] gap-4">
        {/* Defect Type ID */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="defectTypeId"
          label="Defect Type ID"
          placeholder="Search Defect Type ID..."
          dataLoader={getDefectTypeIdOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />

        {/* Defect Type Name */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="defectTypeName"
          label="Defect Type Name"
          placeholder="Search Defect Type Name..."
          dataLoader={getDefectTypeNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
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