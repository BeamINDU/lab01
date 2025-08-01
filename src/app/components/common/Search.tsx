'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { SelectOption } from "@/app/types/select-option";

interface GoogleStyleSearchProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  label?: string;
  onSelect?: (option: SelectOption | null) => void;
  onInputChange?: (inputValue: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  allowClear?: boolean;
  showDropdownIcon?: boolean;
  minSearchLength?: number;
  maxDisplayItems?: number;
  name?: string;
}

const GoogleStyleSearch = forwardRef<HTMLInputElement, GoogleStyleSearchProps>(({
  options = [],
  value = '',
  placeholder = 'Search...',
  label,
  onSelect,
  onInputChange,
  disabled = false,
  error,
  className = '',
  allowClear = true,
  showDropdownIcon = true,
  minSearchLength = 0,
  maxDisplayItems = 10,
  name
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current!, []);


  const isEffectivelyEmpty = (input: string): boolean => {
    return !input || input.trim().length === 0;
  };


  const getEffectiveSearchLength = (input: string): number => {
    return input.trim().length;
  };

  // Initialize value
  useEffect(() => {
    if (value) {
      const option = options.find(opt => opt.value === value);
      if (option) {
        setSelectedOption(option);
        setInputValue(option.label);
      } else {
        setInputValue(value);
        setSelectedOption(null);
      }
    } else {
      setSelectedOption(null);
      setInputValue('');
    }
  }, [value, options]);


  useEffect(() => {
    const effectiveLength = getEffectiveSearchLength(inputValue);
    
    if (effectiveLength >= minSearchLength) {
      const trimmedInput = inputValue.trim();
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(trimmedInput.toLowerCase()) ||
        option.value.toLowerCase().includes(trimmedInput.toLowerCase())
      ).slice(0, maxDisplayItems);

      setFilteredOptions(filtered);
      setHighlightedIndex(-1);
    } else {

      setFilteredOptions(options.slice(0, maxDisplayItems));
      setHighlightedIndex(-1);
    }
  }, [inputValue, options, minSearchLength, maxDisplayItems]);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 240 && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        if (!selectedOption && value) {
          setInputValue(value);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption, value]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredOptions, highlightedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setSelectedOption(null);
    onInputChange?.(newValue);
  };

  const handleSelectOption = (option: SelectOption) => {
    setSelectedOption(option);
    setInputValue(option.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect?.(option);
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedOption(null);
    setIsOpen(false);
    onSelect?.(null);
    onInputChange?.('');
    inputRef.current?.focus();
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleIconClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onClick={handleInputClick}
          disabled={disabled}
          className={`
            block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm 
            placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 
            sm:text-sm
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          `}
        />

        {/* Clear Button */}
        {allowClear && inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-8 flex items-center pr-2 hover:text-gray-700"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}

        {/* Dropdown Icon */}
        {showDropdownIcon && (
          <button
            type="button"
            onClick={handleIconClick}
            disabled={disabled}
            className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-700 disabled:cursor-not-allowed"
          >
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className={`
            absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 
            max-h-60 overflow-y-auto
            ${dropdownPosition === 'top' ? 'bottom-full mb-1 mt-0' : 'top-full'}
          `}
          style={{
            minWidth: '200px',
            maxWidth: '90vw'
          }}
        >
          {filteredOptions.length > 0 ? (
            <>
              {filteredOptions.map((option, index) => (
                <button
                  key={`${option.value}_${option.label}_${index}`} 
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`
                    w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                    ${index === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                    ${selectedOption?.value === option.value ? 'bg-blue-50 text-blue-700 font-medium' : ''}
                    transition-colors duration-150 break-words
                  `}
                >

                  <span
                    className="block"
                    dangerouslySetInnerHTML={{
                      __html: option.label.replace(
                        new RegExp(`(${inputValue.trim()})`, 'gi'),
                        '<mark class="bg-yellow-200 px-0">$1</mark>'
                      )
                    }}
                  />
                </button>
              ))}
            </>
          ) : (

            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {isEffectivelyEmpty(inputValue) 
                ? "Start typing to search..." 
                : getEffectiveSearchLength(inputValue) < minSearchLength
                  ? `Please enter at least ${minSearchLength} characters`
                  : `No results found for "${inputValue.trim()}"`
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
});

GoogleStyleSearch.displayName = 'GoogleStyleSearch';

export default GoogleStyleSearch;