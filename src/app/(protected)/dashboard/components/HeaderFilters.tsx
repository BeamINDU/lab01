import { useEffect, useState, useRef } from 'react';
import { CalendarIcon, ChevronDown, Search } from "lucide-react";
import { getProducts, getCameras, getLines, ProductOption, CameraOption, LineOption } from "@/app/lib/services/dashboard";
import { showError } from '@/app/utils/swal';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

interface HeaderFiltersProps {
  selectedProduct?: string;
  selectedCamera?: string;
  selectedLine?: string;
  selectedMonth?: string;
  selectedYear?: string;
  dateFrom?: string;
  dateTo?: string;
  onProductChange?: (productId: string) => void;
  onCameraChange?: (cameraId: string) => void;
  onLineChange?: (lineId: string) => void;
  onMonthChange?: (month: string) => void;
  onYearChange?: (year: string) => void;
  onDateFromChange?: (date: string | null) => void;
  onDateToChange?: (date: string | null) => void;
}

// Custom Searchable Dropdown Component
interface SearchableDropdownProps {
  options: Array<{id: string, name: string}>;
  selectedValue: string;
  placeholder: string;
  onSelect: (value: string) => void;
  loading?: boolean;
}

function SearchableDropdown({ options, selectedValue, placeholder, onSelect, loading }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  useEffect(() => {
    const filtered = options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedOption = options.find(opt => opt.id === selectedValue);
  const displayText = selectedOption ? selectedOption.name : `All ${placeholder}`;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        className="bg-violet-600 text-white px-2 py-1 rounded text-xs mt-1 flex items-center gap-1 min-w-[80px] max-w-[120px]"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <span className="truncate" title={displayText}>{displayText}</span>
            <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !loading && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-violet-500"
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {/* All option */}
            <button
              type="button"
              onClick={() => handleSelect('')}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                selectedValue === '' ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
              }`}
            >
              All {placeholder}
            </button>

            {/* Filtered options */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                    selectedValue === option.id ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
                  }`}
                >
                  {option.name}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-gray-500">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeaderFilters({
  selectedProduct,
  selectedCamera,
  selectedLine,
  selectedMonth,
  selectedYear,
  dateFrom,
  dateTo,
  onProductChange,
  onCameraChange,
  onLineChange,
  onMonthChange,
  onYearChange,
  onDateFromChange,
  onDateToChange
}: HeaderFiltersProps) {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [cameras, setCameras] = useState<CameraOption[]>([]);
  const [lines, setLines] = useState<LineOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  const dateFormat = 'YYYY-MM-DD HH:mm';
  
  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '0.375rem',
  };

  // Generate months
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Generate years (current year - 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load dropdown data on component mount
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        setLoading(true);
        
        // Load all data in parallel
        const [productsData, camerasData, linesData] = await Promise.all([
          getProducts(),
          getCameras(),
          getLines()
        ]);

        setProducts(productsData);
        setCameras(camerasData);
        setLines(linesData);
        
      } catch (error) {
        console.error('Failed to load dropdown data:', error);
        showError('Failed to load filter options');
      } finally {
        setLoading(false);
      }
    };

    loadDropdownData();
  }, []);

  // Convert data to dropdown format
  const productOptions = products.map(p => ({ id: p.productId, name: p.productName }));
  const cameraOptions = cameras.map(c => ({ id: c.cameraId, name: c.cameraName }));
  const lineOptions = lines.map(l => ({ id: l.lineId, name: l.lineName }));

  if (loading) {
    return (
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold mr-4">Dashboard</h1>
          <div className="text-gray-500">Loading filters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      {/* LEFT SECTION */}
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-bold mr-4">Dashboard</h1>

        {/* Product Searchable Dropdown */}
        <SearchableDropdown
          options={productOptions}
          selectedValue={selectedProduct || ''}
          placeholder="Products"
          onSelect={(value) => onProductChange?.(value)}
          loading={loading}
        />

        {/* Camera Searchable Dropdown */}
        <SearchableDropdown
          options={cameraOptions}
          selectedValue={selectedCamera || ''}
          placeholder="Cameras"
          onSelect={(value) => onCameraChange?.(value)}
          loading={loading}
        />

        {/* Line Searchable Dropdown */}
        <SearchableDropdown
          options={lineOptions}
          selectedValue={selectedLine || ''}
          placeholder="Lines"
          onSelect={(value) => onLineChange?.(value)}
          loading={loading}
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Date From */}
          <div className="flex items-center gap-1">
            <label className="font-semibold text-xs">From:</label>
            <DateTimePicker
              value={dateFrom ? dayjs(dateFrom) : null}
              onChange={(date) => onDateFromChange?.(date ? date.format(dateFormat) : null)}
              format={dateFormat}
              ampm={false}
              timeSteps={{ minutes: 1 }}
              closeOnSelect={false}
              minutesStep={1}
              slotProps={{
                textField: {
                  size: "small",
                  className: "w-[150px]",
                  placeholder: "YYYY-MM-DD HH:mm",
                  InputProps: {
                    style: {
                      fontSize: '10px',
                      height: '28px',
                      padding: '0 8px'
                    }
                  },
                  inputProps: {
                    style: {
                      fontSize: '10px',
                      padding: '4px 0',
                      textAlign: 'center' as const
                    }
                  },
                  sx: {
                    ...inputStyle,
                    '& input': {
                      fontSize: '10px !important',
                      padding: '4px 8px !important'
                    },
                    '& .MuiOutlinedInput-root': {
                      fontSize: '10px !important'
                    }
                  }
                }
              }}
            />
          </div>

          {/* Date To */}
          <div className="flex items-center gap-1">
            <label className="font-semibold text-xs">To:</label>
            <DateTimePicker
              value={dateTo ? dayjs(dateTo) : null}
              onChange={(date) => onDateToChange?.(date ? date.format(dateFormat) : null)}
              format={dateFormat}
              ampm={false}
              timeSteps={{ minutes: 1 }}
              closeOnSelect={false}
              minutesStep={1}
              slotProps={{
                textField: {
                  size: "small",
                  className: "w-[150px]",
                  placeholder: "YYYY-MM-DD HH:mm",
                  InputProps: {
                    style: {
                      fontSize: '10px',
                      height: '28px',
                      padding: '0 8px'
                    }
                  },
                  inputProps: {
                    style: {
                      fontSize: '10px',
                      padding: '4px 0',
                      textAlign: 'center' as const
                    }
                  },
                  sx: {
                    ...inputStyle,
                    '& input': {
                      fontSize: '10px !important',
                      padding: '4px 8px !important'
                    },
                    '& .MuiOutlinedInput-root': {
                      fontSize: '10px !important'
                    }
                  }
                }
              }}
            />
          </div>

        </LocalizationProvider>

        {/* Month Dropdown */}
        <div className="relative" ref={monthDropdownRef}>
          <button 
            className="flex items-center bg-violet-600 text-white px-2 py-1 rounded text-xs mt-1"
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
          >
            <CalendarIcon className="w-3 h-3 mr-1" />
            {selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'Month'}
            <ChevronDown size={12} className={`ml-1 transition-transform ${showMonthDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showMonthDropdown && (
            <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="max-h-48 overflow-y-auto">
                <button
                  onClick={() => {
                    onMonthChange?.('');
                    setShowMonthDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                    !selectedMonth ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
                  }`}
                >
                  All Months
                </button>
                {months.map(month => (
                  <button
                    key={month.value}
                    onClick={() => {
                      onMonthChange?.(month.value);
                      setShowMonthDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                      selectedMonth === month.value ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
                    }`}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Year Dropdown */}
        <div className="relative" ref={yearDropdownRef}>
          <button 
            className="flex items-center bg-violet-600 text-white px-2 py-1 rounded text-xs mt-1"
            onClick={() => setShowYearDropdown(!showYearDropdown)}
          >
            <CalendarIcon className="w-3 h-3 mr-1" />
            {selectedYear || 'Year'}
            <ChevronDown size={12} className={`ml-1 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showYearDropdown && (
            <div className="absolute top-full right-0 mt-1 w-24 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="max-h-48 overflow-y-auto">
                <button
                  onClick={() => {
                    onYearChange?.('');
                    setShowYearDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                    !selectedYear ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
                  }`}
                >
                  All Years
                </button>
                {years.map(year => (
                  <button
                    key={year.value}
                    onClick={() => {
                      onYearChange?.(year.value);
                      setShowYearDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                      selectedYear === year.value ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
                    }`}
                  >
                    {year.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}