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

// functions เพื่อ handle errors
const safeGetProductTypeIdOptions = async () => {
  try {
    const result = await getProductTypeIdOptions();
    console.log('ProductType ID options result:', result);
    

    if (!Array.isArray(result)) {
      console.warn('Expected array but got:', typeof result, result);
      return [];
    }
    
    return result;
  } catch (error) {
    console.error('Failed to load product type IDs:', error);
    return [];
  }
};

const safeGetProductTypeNameOptions = async () => {
  try {
    const result = await getProductTypeNameOptions();
    console.log('ProductType Name options result:', result);
    
    if (!Array.isArray(result)) {
      console.warn('Expected array but got:', typeof result, result);
      return [];
    }
    
    return result;
  } catch (error) {
    console.error('Failed to load product type names:', error);
    return [];
  }
};

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
          placeholder="Search or enter product type ID..."
          dataLoader={safeGetProductTypeIdOptions}
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
          placeholder="Search or enter product type name..."
          dataLoader={safeGetProductTypeNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status */}
        <SearchFieldResponsive 
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