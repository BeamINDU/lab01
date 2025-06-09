'use client';

import React, { useState, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, Control, Controller } from "react-hook-form";
import GoogleStyleSearch from '@/app/components/common/Search';
import { SelectOption } from "@/app/types/select-option";
import { debounce } from 'lodash';

interface SearchFieldProps {
  register?: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  control?: Control<any>;
  fieldName: string;

  label: string;
  placeholder?: string;
  className?: string;

  options?: SelectOption[];
  dataLoader?: (q: string) => Promise<any[]>;
  labelField?: string;
  valueField?: string;

  allowFreeText?: boolean;
  disabled?: boolean;
  minSearchLength?: number;
  maxDisplayItems?: number;
  initialValue?: string;

  layout?: 'responsive' | 'modal' | 'inline';
  labelWidth?: string;

  showInternalError?: boolean;
  required?: boolean;

  onSelectionChange?: (value: string, option: SelectOption | null) => void;
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
  labelField = 'label',
  valueField = 'value',
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
  const [searchOptions, setSearchOptions] = useState<SelectOption[]>(options);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');


  useEffect(() => {
    if (!dataLoader || !inputValue || inputValue.trim().length < minSearchLength) return;

    const fetchOptions = async () => {
      try {
        setLoading(true);
        const data = await dataLoader(inputValue);

        let transformedOptions: SelectOption[] = [];

        if (Array.isArray(data) && data.length > 0) {
          if (typeof data[0] === 'string') {
            transformedOptions = data.map((item) => ({
              label: item,
              value: item
            }));
          } else if (typeof data[0] === 'object') {
            transformedOptions = data.map((item) => ({
              label: item[labelField] || item.label || String(item),
              value: item[valueField] || item.value || item[labelField]
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

    const debouncedFetch = debounce(fetchOptions, 300);
    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [inputValue, dataLoader, labelField, valueField, fieldName, minSearchLength]);


  useEffect(() => {
    if (options.length > 0) {
      const optionsWithIds = options.map((opt, index) => ({
        ...opt,
        id: opt.value || `opt-${index}-${opt.value}`
      }));
      setSearchOptions(optionsWithIds);

      if (initialValue) {
        const matched = optionsWithIds.find(opt =>
          opt.value === initialValue || opt.label === initialValue
        );
        if (matched) {
          setSelectedValue(matched.value);
          setValue?.(fieldName, matched.value);
        } else if (allowFreeText) {
          setSelectedValue(initialValue);
          setValue?.(fieldName, initialValue);
        }
      }
    }
  }, [options, initialValue, allowFreeText, fieldName, setValue]);

  useEffect(() => {
    if (initialValue !== undefined) {
      setSelectedValue(initialValue);
      setInputValue(initialValue);
      setValue?.(fieldName, initialValue);
    }
  }, [initialValue, allowFreeText, fieldName, setValue]);

  const handleSelect = (option: SelectOption | null) => {
    const value = option ? option.value : '';
    setSelectedValue(value);
    setInputValue(value);
    setValue?.(fieldName, value);
    onSelectionChange?.(value, option);
  };

  const handleInputChange = (input: string) => {
    setInputValue(input);
    if (allowFreeText) {
      const matched = searchOptions.find(opt =>
        opt.label.toLowerCase() === input.toLowerCase()
      );
      if (!matched) {
        setSelectedValue(input);
        setValue?.(fieldName, input);
        onSelectionChange?.(input, null);
      }
    }
  };

  const renderLayout = () => {
    const baseSearch = (
      <>
        {register && <input type="hidden" {...register(fieldName)} />}
        <GoogleStyleSearch
          options={searchOptions}
          value={inputValue}
          placeholder={loading ? "Loading..." : placeholder}
          onSelect={handleSelect}
          onInputChange={(val) => {
            setInputValue(val);
          }}
          allowClear={true}
          showDropdownIcon={true}
          minSearchLength={minSearchLength}
          maxDisplayItems={maxDisplayItems}
          disabled={disabled || loading}
          className="w-full"
        />
      </>
    );

    if (control && showInternalError) {
      return (
        <Controller
          name={fieldName}
          control={control}
          rules={{ required: required ? `${label} is required` : false }}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <GoogleStyleSearch
                {...field}
                value={field.value ?? ''}
                options={searchOptions}
                placeholder={loading ? "Loading..." : placeholder}
                onSelect={(opt) => {
                  const value = opt?.value || '';
                  field.onChange(value);
                  setInputValue(value);
                  onSelectionChange?.(value, opt);
                }}
                onInputChange={(val) => {
                  setInputValue(val);
                  if (allowFreeText) {
                    const matched = searchOptions.find(opt =>
                      opt.label.toLowerCase() === val.toLowerCase()
                    );
                    if (!matched) {
                      field.onChange(val);
                      onSelectionChange?.(val, null);
                    }
                  }
                }}
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
          )}
        />
      );
    }

    const layoutWrapper = (inputElement: React.ReactNode) => {
      switch (layout) {
        case 'modal':
          return (
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal text-sm">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}:
              </label>
              <div className="w-full min-w-0">{inputElement}</div>
            </div>
          );
        case 'inline':
          return (
            <div className="flex items-center gap-2">
              <label className="font-semibold whitespace-nowrap" style={{ width: labelWidth }}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}:
              </label>
              <div className="flex-1 min-w-0">{inputElement}</div>
            </div>
          );
        case 'responsive':
        default:
          return (
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-start sm:items-center gap-2">
              <label className="font-semibold text-sm sm:text-base whitespace-nowrap min-w-[130px] sm:min-w-[150px]">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="w-full min-w-0">{inputElement}</div>
            </div>
          );
      }
    };

    return layoutWrapper(baseSearch);
  };

  return (
    <div className={`w-full ${className}`}>
      {renderLayout()}
    </div>
  );
}

// Convenience exports
export const SearchFieldModal = (props: Omit<SearchFieldProps, 'layout'>) => (
  <SearchField {...props} layout="modal" />
);

export const SearchFieldInline = (props: Omit<SearchFieldProps, 'layout'>) => (
  <SearchField {...props} layout="inline" />
);

export const SearchFieldResponsive = (props: Omit<SearchFieldProps, 'layout'>) => (
  <SearchField {...props} layout="responsive" />
);

export const SearchFieldModalWithController = (props: Omit<SearchFieldProps, 'layout' | 'showInternalError'>) => (
  <SearchField {...props} layout="modal" showInternalError={true} />
);

export const SearchFieldResponsiveWithController = (props: Omit<SearchFieldProps, 'layout' | 'showInternalError'>) => (
  <SearchField {...props} layout="responsive" showInternalError={true} />
);
