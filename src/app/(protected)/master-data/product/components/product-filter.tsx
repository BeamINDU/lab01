'use client';

import { Search } from 'lucide-react'
import { UseFormRegister } from "react-hook-form";
import { useState, useEffect } from 'react';
import GoogleStyleSearch, { SearchOption } from '@/app/components/common/GoogleStyleSearch';

interface ProductFilterFormProps {
  register: UseFormRegister<any>;
  onSearch: () => void;
}

export default function ProductFilterForm({ register, onSearch }: ProductFilterFormProps) {
  // State สำหรับ Product Type search
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  const [productTypeOptions, setProductTypeOptions] = useState<SearchOption[]>([]);

  // โหลดข้อมูล Product Type
  useEffect(() => {
    const mockProductTypes: SearchOption[] = [
      { id: '1', label: 'Bottle', value: 'bottle' },
      { id: '2', label: 'Box', value: 'box' },
      { id: '3', label: 'Can', value: 'can' },
      { id: '4', label: 'Plastic Container', value: 'plastic-container' },
      { id: '5', label: 'Glass Jar', value: 'glass-jar' },
      { id: '6', label: 'Paper Pack', value: 'paper-pack' },
      { id: '7', label: 'Metal Tin', value: 'metal-tin' },
      { id: '8', label: 'Pouch', value: 'pouch' },
    ];
    
    setProductTypeOptions(mockProductTypes);
  }, []);

  // จัดการเมื่อเลือก Product Type
  const handleProductTypeSelect = (option: SearchOption | null) => {
    const value = option ? option.value : '';
    setSelectedProductType(value);
    
    // ปรับปรุงค่าใน React Hook Form
    const event = new Event('change', { bubbles: true });
    const productTypeInput = document.querySelector('input[name="productType"]') as HTMLInputElement;
    if (productTypeInput) {
      productTypeInput.value = value;
      productTypeInput.dispatchEvent(event);
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
        
        {/* Product Type - ใช้ Google Style Search Component */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Product Type</label>
          <div className="relative">
            {/* Hidden input สำหรับ React Hook Form */}
            <input
              type="hidden"
              {...register("productType")}
              value={selectedProductType}
            />
            
            {/* Google Style Search Component */}
            <GoogleStyleSearch
              options={productTypeOptions}
              value={selectedProductType}
              // placeholder="Search product type..."
              onSelect={handleProductTypeSelect}
              allowClear={true}
              showDropdownIcon={true}
              minSearchLength={0}
              maxDisplayItems={8}
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