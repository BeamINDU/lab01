'use client';

import React, { useState, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, Control, Controller } from "react-hook-form";
import GoogleStyleSearch, { SearchOption } from '@/app/components/common/Search';

interface SearchFieldProps {

  register?: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  control?: Control<any>; 
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
  
  // Layout options
  layout?: 'responsive' | 'modal' | 'inline';
  labelWidth?: string;
  
  //  เพิ่มตัวเลือกให้แสดง error ใน component
  showInternalError?: boolean;
  required?: boolean;
  
  // Events
  onSelectionChange?: (value: string, option: SearchOption | null) => void;
}

export default function SearchField({
  register,
  setValue,
  control,
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
  showInternalError = false, 
  required = false,
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
              setValue?.(fieldName, matchedOption.value);
            } else if (allowFreeText) {
              setSelectedValue(initialValue);
              setValue?.(fieldName, initialValue);
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
          setValue?.(fieldName, matchedOption.value);
        } else if (allowFreeText) {
          setSelectedValue(initialValue);
          setValue?.(fieldName, initialValue);
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
      setValue?.(fieldName, initialValue);
    }
  }, [initialValue, searchOptions, allowFreeText, fieldName, setValue]);

  //  Handlers สำหรับ register() method
  const handleSelect = (option: SearchOption | null) => {
    const value = option ? option.value : '';
    setSelectedValue(value);
    setValue?.(fieldName, value);
    onSelectionChange?.(value, option);
  };

  const handleInputChange = (inputValue: string) => {
    if (allowFreeText) {
      const matchedOption = searchOptions.find(opt => 
        opt.label.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (!matchedOption) {
        setSelectedValue(inputValue);
        setValue?.(fieldName, inputValue);
        onSelectionChange?.(inputValue, null);
      }
    }
  };

  //  เลือก layout ตาม prop
  const renderLayout = () => {
    if (control && showInternalError) {
      const searchFieldWithController = (
        <Controller
          name={fieldName}
          control={control}
          rules={{

          }}
          render={({ field, fieldState }) => {
            const handleControllerSelect = (option: SearchOption | null) => {
              const value = option ? option.value : '';
              field.onChange(value);
              onSelectionChange?.(value, option);
            };

            const handleControllerInputChange = (inputValue: string) => {
              if (allowFreeText) {
                const matchedOption = searchOptions.find(opt => 
                  opt.label.toLowerCase() === inputValue.toLowerCase()
                );
                
                if (!matchedOption) {
                  field.onChange(inputValue);
                  onSelectionChange?.(inputValue, null);
                }
              }
            };

            return (
              <div className="w-full">
                <GoogleStyleSearch
                  options={searchOptions}
                  value={field.value || ''}
                  placeholder={loading ? "Loading..." : placeholder}
                  onSelect={handleControllerSelect}
                  onInputChange={handleControllerInputChange}
                  allowClear={true}
                  showDropdownIcon={true}
                  minSearchLength={minSearchLength}
                  maxDisplayItems={maxDisplayItems}
                  disabled={disabled || loading}
                  className="w-full"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            );
          }}
        />
      );

      switch (layout) {
        case 'modal':
          return (
            <div className="grid grid-cols-[150px_1fr] items-start gap-2">
              <label className="font-normal pt-2 text-sm">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}:
              </label>
              <div className="w-full min-w-0">
                {searchFieldWithController}
              </div>
            </div>
          );

        case 'inline':
          return (
            <div className="flex items-start gap-2">
              <label className="font-semibold whitespace-nowrap pt-2" style={{width: labelWidth}}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}:
              </label>
              <div className="flex-1 min-w-0">
                {searchFieldWithController}
              </div>
            </div>
          );

case 'responsive':
default:
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr] items-start gap-2">
      <label className="font-semibold text-sm sm:text-base whitespace-nowrap min-w-[140px] sm:min-w-[160px] pt-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="w-full min-w-0">
        {searchFieldWithController}
      </div>
    </div>
  );
      }
    }


    const searchComponent = (
      <>
        {register && <input type="hidden" {...register(fieldName)} />}
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
        return (
          <div className="grid grid-cols-[150px_1fr] items-center gap-2">
            <label className="font-normal text-sm">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}:
            </label>
            <div className="w-full min-w-0">
              {searchComponent}
            </div>
          </div>
        );

      case 'inline':
        return (
          <div className="flex items-center gap-2">
            <label className="font-semibold whitespace-nowrap" style={{width: labelWidth}}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}:
            </label>
            <div className="flex-1 min-w-0">
              {searchComponent}
            </div>
          </div>
        );


case 'responsive':
default:
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr] items-start sm:items-center gap-2">
      <label className="font-semibold text-sm sm:text-base whitespace-nowrap min-w-[140px] sm:min-w-[160px]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
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

//  Export convenience components สำหรับการใช้งานแต่ละแบบ
export const SearchFieldModal = (props: Omit<SearchFieldProps, 'layout'>) => (
  <SearchField {...props} layout="modal" />
);

export const SearchFieldInline = (props: Omit<SearchFieldProps, 'layout'>) => (
  <SearchField {...props} layout="inline" />
);

export const SearchFieldResponsive = (props: Omit<SearchFieldProps, 'layout'>) => (
  <SearchField {...props} layout="responsive" />
);
