// src/app/components/common/SearchField.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import GoogleStyleSearch, { SearchOption } from '@/app/components/common/Search';

interface SearchFieldProps {
  // Form integration
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  fieldName: string;
  
  // Display
  label: string;
  placeholder?: string;
  className?: string;
  
  // Data options - เลือกวิธีใดวิธีหนึ่ง
  options?: SearchOption[]; // ส่ง options พร้อมใช้
  dataLoader?: () => Promise<any[]>; // function ดึงข้อมูล
  labelField?: string; // field name สำหรับ label
  valueField?: string; // field name สำหรับ value
  
  // Behavior
  allowFreeText?: boolean;
  disabled?: boolean;
  minSearchLength?: number;
  maxDisplayItems?: number;
  
  // Events
  onSelectionChange?: (value: string, option: SearchOption | null) => void;
}

export default function SearchField({
  register,
  setValue,
  fieldName,
  label,
  placeholder = "Search...",
  className = "",
  options = [],
  dataLoader,
  labelField = 'name',
  valueField = 'id',
  allowFreeText = true,
  disabled = false,
  minSearchLength = 0,
  maxDisplayItems = 10,
  onSelectionChange
}: SearchFieldProps) {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>(options);
  const [loading, setLoading] = useState<boolean>(false);

  // Load data if dataLoader is provided
  useEffect(() => {
    if (dataLoader && !options.length) {
      const loadData = async () => {
        try {
          setLoading(true);
          const data = await dataLoader();
          
          let transformedOptions: SearchOption[] = [];
          
          if (Array.isArray(data) && data.length > 0) {
            // ⭐ แก้ไข: รองรับหลายรูปแบบข้อมูล
            if (typeof data[0] === 'string') {
              // กรณีเป็น array of strings
              transformedOptions = data.map((item, index) => ({
                id: (index + 1).toString(),
                label: item,
                value: item
              }));
            } else if (typeof data[0] === 'object') {
              // กรณีเป็น array of objects
              transformedOptions = data.map((item, index) => ({
                id: item.id || item[valueField] || (index + 1).toString(),
                label: item[labelField] || item.label || item.name || String(item),
                value: item[valueField] || item.value || item.id || item[labelField]
              }));
            }
          }
          
          setSearchOptions(transformedOptions);
        } catch (error) {
          console.error(`Failed to load data for ${fieldName}:`, error);
          setSearchOptions([]);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [dataLoader, labelField, valueField, fieldName, options.length]);

  // Update options when options prop changes
  useEffect(() => {
    if (options.length > 0) {
      setSearchOptions(options);
    }
  }, [options]);

  const handleSelect = (option: SearchOption | null) => {
    const value = option ? option.value : '';
    setSelectedValue(value);
    setValue(fieldName, value);
    onSelectionChange?.(value, option);
  };

  const handleInputChange = (inputValue: string) => {
    if (allowFreeText) {
      const matchedOption = searchOptions.find(opt => 
        opt.label.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (!matchedOption) {
        setSelectedValue(inputValue);
        setValue(fieldName, inputValue);
        onSelectionChange?.(inputValue, null);
      }
    }
  };

  return (
    <div className={`grid grid-cols-[110px_1fr] items-center gap-2 ${className}`}>
      <label className="font-semibold w-[120px]">{label}</label>
      <div className="relative">
        {/* Hidden input for React Hook Form */}
        <input type="hidden" {...register(fieldName)} />
        
        {/* GoogleStyleSearch Component */}
        <GoogleStyleSearch
          options={searchOptions}
          value={selectedValue}
          placeholder={loading ? "Loading..." : placeholder}
          onSelect={handleSelect}
          onInputChange={handleInputChange}
          allowClear={true}
          showDropdownIcon={true}
          minSearchLength={minSearchLength}
          maxDisplayItems={maxDisplayItems}
          disabled={disabled || loading}
          className="w-full"
        />
      </div>
    </div>
  );
}