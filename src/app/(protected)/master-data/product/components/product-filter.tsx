// src/app/(protected)/master-data/product/components/product-filter.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import GoogleStyleSearch, { SearchOption } from '@/app/components/common/Search';
import { getProductTypeOptions } from '@/app/lib/services/product-type'; 

interface ProductFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function ProductFilterForm({ register, setValue, onSearch }: ProductFilterFormProps) {
  // State สำหรับ Product Type search
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  const [productTypeOptions, setProductTypeOptions] = useState<SearchOption[]>([]);
  const [isLoadingProductTypes, setIsLoadingProductTypes] = useState<boolean>(false);

  // โหลดข้อมูล Product Type จาก product-type service
  useEffect(() => {
    const loadProductTypes = async () => {
      try {
        setIsLoadingProductTypes(true);
        const productTypes = await getProductTypeOptions();
        const searchOptions: SearchOption[] = productTypes.map((item, index) => ({
          id: (index + 1).toString(),
          label: item.label,
          value: item.value
        }));
        
        setProductTypeOptions(searchOptions);
      } catch (error) {
        console.error('Failed to load product types:', error);
        // ถ้าเกิด error ให้ใช้ข้อมูล fallback
        setProductTypeOptions([]);
      } finally {
        setIsLoadingProductTypes(false);
      }
    };

    loadProductTypes();
  }, []);

  // จัดการเมื่อเลือก Product Type
  const handleProductTypeSelect = (option: SearchOption | null) => {
    const value = option ? option.value : '';
    setSelectedProductType(value);
    
    // ใช้ setValue จาก React Hook Form เพื่ออัพเดทค่าโดยตรง
    setValue("productType", value);
    
    console.log('Selected Product Type:', value); // Debug log
  };

  // จัดการเมื่อพิมพ์ใน Search Box
  const handleProductTypeInputChange = (inputValue: string) => {
    // ถ้าไม่มีการเลือกตัวเลือกใดๆ และกำลังพิมพ์ ให้เก็บค่าที่พิมพ์
    const matchedOption = productTypeOptions.find(opt => 
      opt.label.toLowerCase() === inputValue.toLowerCase()
    );
    
    if (!matchedOption) {
      setSelectedProductType(inputValue);
      setValue("productType", inputValue);
      console.log('Typed Product Type:', inputValue); // Debug log
    }
  };

  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Product ID */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Product ID</label>
          <input
            type="text"
            {...register("productId")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        
        {/* Product Name */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Product Name</label>
          <input
            type="text"
            {...register("productName")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        
        {/* Product Type - ใSearch Component */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Product Type</label>
          <div className="relative">
            {/* Register กับ React Hook Form */}
            <input
              type="hidden"
              {...register("productType")}
            />
            
            {/* Search Component */}
            <GoogleStyleSearch
              options={productTypeOptions}
              value={selectedProductType}
              placeholder={isLoadingProductTypes ? "Loading..." : "Search product type..."}
              onSelect={handleProductTypeSelect}
              onInputChange={handleProductTypeInputChange}
              allowClear={true}
              showDropdownIcon={true}
              minSearchLength={0}
              maxDisplayItems={8}
              disabled={isLoadingProductTypes}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Serial No */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Serial No</label>
          <input
            type="text"
            {...register("serialNo")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        
        {/* Status */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Status</label>
          <select
            {...register("status", { valueAsNumber: true })}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        
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