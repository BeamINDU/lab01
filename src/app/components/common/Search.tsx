// src/app/components/common/Search.tsx
'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

// ประเภทข้อมูลสำหรับตัวเลือก
export interface SearchOption {
  id: string;
  label: string;
  value: string;
}

// Props ของ Component
interface GoogleStyleSearchProps {
  // ข้อมูลพื้นฐาน
  options: SearchOption[];           // รายการตัวเลือกทั้งหมด
  value?: string;                   // ค่าที่เลือกอยู่ปัจจุบัน
  placeholder?: string;             // ข้อความ placeholder
  label?: string;                   // ป้ายกำกับ
  
  // การจัดการเหตุการณ์
  onSelect?: (option: SearchOption | null) => void;  // เมื่อเลือกตัวเลือก
  onInputChange?: (inputValue: string) => void;      // เมื่อพิมพ์ใน input
  
  // การปรับแต่งรูปแบบ
  disabled?: boolean;               // ปิดการใช้งาน
  error?: string;                   // ข้อความ error
  className?: string;               // CSS class เพิ่มเติม
  
  // ตัวเลือกการทำงาน
  allowClear?: boolean;             // อนุญาตให้ล้างค่าได้
  showDropdownIcon?: boolean;       // แสดงไอคอน dropdown
  minSearchLength?: number;         // จำนวนตัวอักษรขั้นต่ำในการค้นหา
  maxDisplayItems?: number;         // จำนวนรายการสูงสุดที่แสดง
  
  // สำหรับ React Hook Form
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
  // State สำหรับการทำงานของ Component
  const [isOpen, setIsOpen] = useState(false);           // เปิด/ปิด dropdown
  const [inputValue, setInputValue] = useState('');      // ค่าที่พิมพ์ใน input
  const [filteredOptions, setFilteredOptions] = useState<SearchOption[]>([]); // ตัวเลือกที่กรองแล้ว
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // index ของรายการที่ highlight
  const [selectedOption, setSelectedOption] = useState<SearchOption | null>(null); // ตัวเลือกที่เลือก
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom'); // ตำแหน่ง dropdown
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // เชื่อมต่อ ref กับ parent component
  useImperativeHandle(ref, () => inputRef.current!, []);

  // ค้นหา
  useEffect(() => {
    if (value) {
      const option = options.find(opt => opt.value === value || opt.id === value);
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

  // กรองตัวเลือกตามที่พิมพ์
  useEffect(() => {
    if (inputValue.length >= minSearchLength) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.value.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, maxDisplayItems);
      
      setFilteredOptions(filtered);
      setHighlightedIndex(-1);
    } else {
      setFilteredOptions([]);
    }
  }, [inputValue, options, minSearchLength, maxDisplayItems]);

  // คำนวณตำแหน่ง dropdown
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // ถ้าพื้นที่ด้านล่างไม่พอ และพื้นที่ด้านบนมากกว่า ให้แสดงด้านบน
      if (spaceBelow < 240 && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        // ถ้าไม่มีการเลือกตัวเลือกใดๆ ให้กลับไปใช้ค่าเดิม
        if (!selectedOption && value) {
          setInputValue(value);
        } else if (selectedOption) {
          setInputValue(selectedOption.label);
        }
      }
    };

    // จัดการการ resize หน้าจอ
    const handleResize = () => {
      if (isOpen) {
        // อัพเดทตำแหน่ง dropdown เมื่อมีการ resize
        setTimeout(() => {
          if (containerRef.current) {
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
        }, 100);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen, selectedOption, value]);

  // จัดการการพิมพ์ใน input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    // ถ้าล้างค่าใน input ให้รีเซ็ตการเลือก
    if (newValue === '') {
      setSelectedOption(null);
      onSelect?.(null);
    }
    onInputChange?.(newValue);
  };

  // จัดการการเลือกตัวเลือก
  const handleSelectOption = (option: SearchOption) => {
    setSelectedOption(option);
    setInputValue(option.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect?.(option);
  };

  // จัดการการกดปุ่มคีย์บอร์ด
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (isOpen) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
          
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          }
          break;
          
        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    }
  };

  // ล้างค่าที่เลือก
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    setInputValue('');
    setIsOpen(false);
    onSelect?.(null);
    onInputChange?.('');
    inputRef.current?.focus();
  };

  // เปิด/ปิด dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className={`
        relative flex items-center border rounded-md bg-white
        ${error ? 'border-red-300' : 'border-gray-300'}
        ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'}
        ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        transition-all duration-200
      `}>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            flex-1 px-3 py-2 bg-transparent outline-none text-sm
            ${disabled ? 'cursor-not-allowed text-gray-500' : 'text-gray-900'}
            placeholder:text-gray-500 min-w-0
          `}
          autoComplete="off"
        />

        {/* Clear Button */}
        {allowClear && inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 p-1 mr-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            tabIndex={-1}
          >
            <X size={14} />
          </button>
        )}

        {/* Dropdown Icon */}
        {showDropdownIcon && (
          <button
            type="button"
            onClick={toggleDropdown}
            className={`
              flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            tabIndex={-1}
            disabled={disabled}
          >
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
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
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`
                    w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                    ${index === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                    ${selectedOption?.id === option.id ? 'bg-blue-50 text-blue-700 font-medium' : ''}
                    transition-colors duration-150 break-words
                  `}
                >
                  {/* Highlight ส่วนที่ค้นหา */}
                  <span 
                    className="block"
                    dangerouslySetInnerHTML={{
                      __html: option.label.replace(
                        new RegExp(`(${inputValue})`, 'gi'),
                        '<mark class="bg-yellow-200 px-0">$1</mark>'
                      )
                    }} 
                  />
                </button>
              ))}
            </>
          ) : inputValue.length >= minSearchLength ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No results found for {inputValue}
            </div>
          ) : minSearchLength > 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Please enter at least {minSearchLength} characters
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Start typing to search...
            </div>
          )}
        </div>
      )}
    </div>
  );
});

GoogleStyleSearch.displayName = 'GoogleStyleSearch';

export default GoogleStyleSearch;