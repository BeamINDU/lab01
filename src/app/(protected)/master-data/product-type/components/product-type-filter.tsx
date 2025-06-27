'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchFieldResponsive  from '@/app/components/common/SearchField';
import { getProductTypeIdOptions, getProductTypeNameOptions } from "@/app/libs/services/product-type";
import { ActiveStatus } from '@/app/constants/status';

interface ProductTypeFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function ProductTypeFilterForm({ register, setValue, onSearch }: ProductTypeFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Product Type ID */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="productTypeId"
          label="Product Type ID"
          placeholder="Search product type ID..."
          dataLoader={getProductTypeIdOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
        
        {/* Product Type Name */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="productTypeName"
          label="Product Type Name"
          placeholder="Search product type name..."
          dataLoader={getProductTypeNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status  */}
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