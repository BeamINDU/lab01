'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchFieldResponsive  from '@/app/components/common/SearchField';
import { getProductTypeNameOptions } from '@/app/libs/services/product-type'; 
import { search as searchProducts } from '@/app/libs/services/product';
import { ActiveStatus } from '@/app/constants/status'; // 

interface ProductFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function ProductFilterForm({ register, setValue, onSearch }: ProductFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Product ID */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="productId"
          label="Product ID"
          placeholder="Search or enter product ID..."
          dataLoader={searchProducts}
          labelField="productId"
          valueField="productId"
          allowFreeText={true}
        />
        
        {/* Product Name */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="productName"
          label="Product Name"
          placeholder="Search or enter product name..."
          dataLoader={searchProducts}
          labelField="productName"
          valueField="productName"
          allowFreeText={true}
        />
        
        {/* Product Type */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="productTypeId"
          label="Product Type"
          placeholder="Search product type..."
          // dataLoader={getProductTypeNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Serial No */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="serialNo"
          label="Serial No"
          placeholder="Search or enter serial number..."
          dataLoader={searchProducts}
          labelField="serialNo"
          valueField="serialNo"
          allowFreeText={true}
        />
        
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