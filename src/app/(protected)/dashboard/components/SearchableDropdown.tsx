import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from "lucide-react";

interface Option {
  id: string;
  name: string;
}

interface SearchableDropdownProps {
  options: Option[];
  selectedValue: string;
  placeholder: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function SearchableDropdown({
  options,
  selectedValue,
  placeholder,
  onSelect,
  disabled = false,
  className = ""
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options and close on outside click
  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.id === selectedValue);
  const displayText = selectedOption?.name || `All ${placeholder}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onSelect?.(value);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="bg-violet-600 text-white px-2 py-1 rounded text-xs flex items-center justify-between gap-1 min-w-[100px] max-w-[140px] h-[28px]"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="truncate text-left flex-1" title={displayText}>
          {displayText}
        </span>
        <ChevronDown 
          size={12} 
          className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-60 overflow-hidden">
          <div className="p-2 border-b">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-violet-500"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-40 overflow-y-auto">
            <button
              onClick={() => handleSelect('')}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                !selectedValue ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
              }`}
            >
              All {placeholder}
            </button>
            
            {filteredOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                  selectedValue === option.id ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
                }`}
              >
                {option.name}
              </button>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}