// src/app/(protected)/master-data/product-type/components/product-type-filter.tsx
'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import { search as searchProductTypes } from "@/app/lib/services/product-type";

interface ProductTypeFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function ProductTypeFilterForm({ register, setValue, onSearch }: ProductTypeFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Product Type ID - แปลงจาก input เป็น SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productTypeId"
          label="Product Type ID"
          placeholder="Search or enter product type ID..."
          dataLoader={searchProductTypes}
          labelField="productTypeId"
          valueField="productTypeId"
          allowFreeText={true}
        />
        
        {/* Product Type Name - แปลงจาก input เป็น SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productTypeName"
          label="Product Type Name"
          placeholder="Search or enter product type name..."
          dataLoader={searchProductTypes}
          labelField="productTypeName"
          valueField="productTypeName"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status - แปลงจาก select เป็น SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="status"
          label="Status"
          placeholder="Select status..."
          options={[
            { id: "all", label: "All", value: "" },
            { id: "1", label: "Active", value: "1" },
            { id: "2", label: "Inactive", value: "0" }
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