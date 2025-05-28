// src/app/(protected)/master-data/product/components/product-filter-simple.tsx
'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import { getProductTypeOptions } from '@/app/lib/services/product-type';
import { search as searchProducts } from '@/app/lib/services/product';

interface ProductFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function ProductFilterForm({ register, setValue, onSearch }: ProductFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Product ID - ✅ ใช้งานได้แล้ว */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productId"
          label="Product ID"
          placeholder="Search or enter product ID..."
          dataLoader={searchProducts}
          labelField="productId"    // SearchField รู้จะเอา field ไหนมาแสดง
          valueField="productId"    // และเก็บค่าอะไร
          allowFreeText={true}
        />
        
        {/* Product Name - ✅ ใช้งานได้แล้ว */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productName"
          label="Product Name"
          placeholder="Search or enter product name..."
          dataLoader={searchProducts}
          labelField="productName"  // แสดง productName
          valueField="productName"  // เก็บ productName
          allowFreeText={true}
        />
        
        {/* Product Type - ✅ ใช้งานได้แล้ว */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productType"
          label="Product Type"
          placeholder="Search product type..."
          dataLoader={getProductTypeOptions}
          labelField="label"        // getProductTypeOptions ส่ง { label, value }
          valueField="value"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Serial No - ✅ ใช้งานได้แล้ว */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="serialNo"
          label="Serial No"
          placeholder="Search or enter serial number..."
          dataLoader={searchProducts}
          labelField="serialNo"     // แสดง serialNo
          valueField="serialNo"     // เก็บ serialNo
          allowFreeText={true}
        />
        
        {/* Status - ✅ ใช้งานได้แล้ว */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="status"
          label="Status"
          placeholder="Select status..."
          options={[
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