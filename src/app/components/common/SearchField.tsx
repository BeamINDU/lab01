'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [searchOptions, setSearchOptions] = useState<SelectOption[]>(options);
  const [loading, setLoading] = useState<boolean>(false);
  const [controlledValue, setControlledValue] = useState<string>(initialValue || '');
  const loadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>('');
  const isUserTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shouldCallDataLoader = (input: string): boolean => {
    if (!dataLoader) return false;
    

    const trimmedInput = input.trim();
    return trimmedInput.length >= minSearchLength || input.length > 0;
  };

  const debouncedFetchOptions = useRef(
    debounce(async (searchQuery: string) => {
      if (!shouldCallDataLoader(searchQuery)) {
        setSearchOptions(options);
        setLoading(false);
        loadingRef.current = false;
        return;
      }

      if (lastQueryRef.current === searchQuery && !loadingRef.current) {
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      try {
        loadingRef.current = true;
        setLoading(true);
        lastQueryRef.current = searchQuery;
        
        abortControllerRef.current = new AbortController();
        
        const queryToSend = searchQuery.trim() || "";
        
        if (!dataLoader) {
          setSearchOptions(options);
          return;
        }
        
        const rawData = await dataLoader(queryToSend);
        
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const mappedOptions: SelectOption[] = rawData?.map((item: any) => ({
          label: item?.[labelField] || item?.label || String(item || ''),
          value: item?.[valueField] || item?.value || String(item || '')
        })) || [];

        setSearchOptions(mappedOptions);
        
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          console.error('Error fetching options:', error);
          setSearchOptions(options);
        }
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    }, 300)
  ).current;

  const handleInputChange = useCallback((input: string) => {
    isUserTypingRef.current = true;
    setControlledValue(input);


    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isUserTypingRef.current = false;
    }, 1000);


    if (input.trim() === '') {
      setValue?.(fieldName, '');
      onSelectionChange?.('', null);
      

      if (input.length > 0 && dataLoader) {
        debouncedFetchOptions(input);
      } else {
        setSearchOptions(options);
      }
      return;
    }


    if (shouldCallDataLoader(input)) {
      debouncedFetchOptions(input);
    }


    if (allowFreeText) {
      setValue?.(fieldName, input);
      onSelectionChange?.(input, null);
    }
  }, [dataLoader, minSearchLength, allowFreeText, fieldName, setValue, onSelectionChange, options, debouncedFetchOptions]);


  const handleSelect = useCallback((option: SelectOption | null) => {
    isUserTypingRef.current = false;
    
    const value = option ? option.value : '';
    const displayValue = option ? option.label : '';
    
    setControlledValue(displayValue);
    setValue?.(fieldName, value);
    onSelectionChange?.(value, option);
  }, [fieldName, setValue, onSelectionChange]);


  useEffect(() => {
    if (options.length > 0) {
      setSearchOptions(options);
    }
  }, [options]);


  useEffect(() => {
    if (initialValue !== undefined && !isUserTypingRef.current) {
      setControlledValue(initialValue);
      setValue?.(fieldName, initialValue);
    }
  }, [initialValue, fieldName, setValue]);


  useEffect(() => {
    if (dataLoader && searchOptions.length === 0 && options.length === 0) {
      debouncedFetchOptions('');
    }
  }, [dataLoader, searchOptions.length, options.length]);


  useEffect(() => {
    return () => {
      if (debouncedFetchOptions?.cancel) {
        debouncedFetchOptions.cancel();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const renderLayout = () => {
    const baseSearch = (
      <>
        {register && <input type="hidden" {...register(fieldName)} />}
        <GoogleStyleSearch
          options={searchOptions}
          value={controlledValue}
          placeholder={loading ? "Loading..." : placeholder}
          onSelect={handleSelect}
          onInputChange={handleInputChange}
          allowClear={true}
          showDropdownIcon={true}
          minSearchLength={minSearchLength}
          maxDisplayItems={maxDisplayItems}
          disabled={disabled}
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
                value={controlledValue}
                options={searchOptions}
                placeholder={loading ? "Loading..." : placeholder}
                onSelect={(opt) => {
                  const value = opt?.value || '';
                  const displayValue = opt?.label || '';
                  
                  field.onChange(value);
                  setControlledValue(displayValue);
                  onSelectionChange?.(value, opt);
                }}
                onInputChange={(input) => {
                  setControlledValue(input);
                  handleInputChange(input);
                  if (allowFreeText) {
                    field.onChange(input);
                  }
                }}
                allowClear={true}
                showDropdownIcon={true}
                minSearchLength={minSearchLength}
                maxDisplayItems={maxDisplayItems}
                disabled={disabled}
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
              {label !== '' && (
                <label className="font-normal text-sm">
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}:
                </label>
              )}
              <div className="w-full min-w-0">{inputElement}</div>
            </div>
          );
        case 'inline':
          return (
            <div className="flex items-center gap-2">
              {label !== '' && (
                <label className="font-semibold whitespace-nowrap" style={{ width: labelWidth }}>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}:
                </label>
              )}
              <div className="flex-1 min-w-0">{inputElement}</div>
            </div>
          );
        case 'responsive':
        default:
          return (
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-start sm:items-center gap-2">
              {label !== '' && (
                <label className="font-semibold text-sm sm:text-base whitespace-nowrap min-w-[130px] sm:min-w-[150px]">
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}:
                </label>
              )}
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