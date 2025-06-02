// src/app/components/common/SearchField.tsx - เพิ่มรองรับ layout แบบ modal
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
  
  // Data options
  options?: SearchOption[];
  dataLoader?: () => Promise<any[]>;
  labelField?: string;
  valueField?: string;
  
  // Behavior
  allowFreeText?: boolean;
  disabled?: boolean;
  minSearchLength?: number;
  maxDisplayItems?: number;
  initialValue?: string;
  
  // ✅ เพิ่ม layout options
  layout?: 'responsive' | 'modal' | 'inline';
  labelWidth?: string;
  
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
  initialValue,
  layout = 'responsive', 
  labelWidth = '150px',
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
            if (typeof data[0] === 'string') {
              transformedOptions = data.map((item, index) => ({
                id: `string-${index}-${item}`,
                label: item,
                value: item
              }));
            } else if (typeof data[0] === 'object') {
              transformedOptions = data.map((item, index) => ({
                id: item.id || `obj-${index}-${item[valueField] || item.value || item.id || item[labelField]}`,
                label: item[labelField] || item.label || item.name || String(item),
                value: item[valueField] || item.value || item.id || item[labelField]
              }));
            }
          }
          
          setSearchOptions(transformedOptions);

          if (initialValue && transformedOptions.length > 0) {
            const matchedOption = transformedOptions.find(opt => 
              opt.value === initialValue || opt.label === initialValue
            );
            if (matchedOption) {
              setSelectedValue(matchedOption.value);
              setValue(fieldName, matchedOption.value);
            } else if (allowFreeText) {
              setSelectedValue(initialValue);
              setValue(fieldName, initialValue);
            }
          }
        } catch (error) {
          console.error(`Failed to load data for ${fieldName}:`, error);
          setSearchOptions([]);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [dataLoader, labelField, valueField, fieldName, options.length, initialValue, allowFreeText, setValue]);

  useEffect(() => {
    if (options.length > 0) {
      const optionsWithUniqueIds = options.map((opt, index) => ({
        ...opt,
        id: opt.id || `opt-${index}-${opt.value}`
      }));
      setSearchOptions(optionsWithUniqueIds);

      if (initialValue) {
        const matchedOption = optionsWithUniqueIds.find(opt => 
          opt.value === initialValue || opt.label === initialValue
        );
        if (matchedOption) {
          setSelectedValue(matchedOption.value);
          setValue(fieldName, matchedOption.value);
        } else if (allowFreeText) {
          setSelectedValue(initialValue);
          setValue(fieldName, initialValue);
        }
      }
    }
  }, [options, initialValue, allowFreeText, fieldName, setValue]);

  useEffect(() => {
    if (initialValue !== undefined) {
      if (searchOptions.length > 0) {
        const matchedOption = searchOptions.find(opt => 
          opt.value === initialValue || opt.label === initialValue
        );
        if (matchedOption) {
          setSelectedValue(matchedOption.value);
        } else if (allowFreeText) {
          setSelectedValue(initialValue);
        }
      } else {
        setSelectedValue(initialValue);
      }
      setValue(fieldName, initialValue);
    }
  }, [initialValue, searchOptions, allowFreeText, fieldName, setValue]);

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

  //  เลือก layout ตาม prop
  const renderLayout = () => {
    const searchComponent = (
      <>
        <input type="hidden" {...register(fieldName)} />
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
      </>
    );

    switch (layout) {
      case 'modal':
        //  Layout แบบ modal (เหมือนกับ input field อื่นๆ)
        return (
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <label className="font-normal w-32 pr-3">{label}:</label>
            <div className="w-full min-w-0">
              {searchComponent}
            </div>
          </div>
        );

      case 'inline':
        //  Layout แบบ inline (label และ input อยู่บรรทัดเดียวกัน)
        return (
          <div className="flex items-center gap-4">
            <label className="font-semibold whitespace-nowrap pr-3" style={{width: labelWidth}}>
              {label}:
            </label>
            <div className="flex-1 min-w-0">
              {searchComponent}
            </div>
          </div>
        );

      case 'responsive':
      default:
        //  Layout แบบ responsive (สำหรับ filter forms)
        return (
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] lg:grid-cols-[150px_1fr] items-start sm:items-center gap-4">
            <label className="font-semibold text-sm sm:text-base whitespace-nowrap pr-3">
              {label}
            </label>
            <div className="w-full min-w-0">
              {searchComponent}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {renderLayout()}
    </div>
  );
}

// ✅ Export convenience components สำหรับการใช้งานแต่ละแบบ
export const SearchFieldModal = (props: Omit<SearchFieldProps, 'layout'>) => (
  <SearchField {...props} layout="modal" />
);

export const SearchFieldInline = (props: Omit<SearchFieldProps, 'layout'>) => (
  <SearchField {...props} layout="inline" />
);

export const SearchFieldResponsive = (props: Omit<SearchFieldProps, 'layout'>) => (
  <SearchField {...props} layout="responsive" />
);