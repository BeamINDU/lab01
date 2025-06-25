'use client';

import { useRef, useState, useEffect } from 'react';
import { CalendarIcon, ChevronDown } from "lucide-react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

interface DateFiltersProps {
  selectedMonth?: string;
  selectedYear?: string;
  dateFrom?: string;
  dateTo?: string;
  onMonthChange?: (month: string) => void;
  onYearChange?: (year: string) => void;
  onDateFromChange?: (date: string | null) => void;
  onDateToChange?: (date: string | null) => void;
}

export default function DateFilters({
  selectedMonth,
  selectedYear,
  dateFrom,
  dateTo,
  onMonthChange,
  onYearChange,
  onDateFromChange,
  onDateToChange
}: DateFiltersProps) {
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  
  // State สำหรับเก็บค่าชั่วคราวก่อนกด OK
  const [tempDateFrom, setTempDateFrom] = useState<string | null>(dateFrom || null);
  const [tempDateTo, setTempDateTo] = useState<string | null>(dateTo || null);
  
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

  // อัพเดท temp state เมื่อ props เปลี่ยน
  useEffect(() => {
    setTempDateFrom(dateFrom || null);
  }, [dateFrom]);

  useEffect(() => {
    setTempDateTo(dateTo || null);
  }, [dateTo]);

  // Handle date changes (ยังไม่ apply จนกว่าจะกด OK)
  const handleTempDateFromChange = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? date.format(dateFormat) : null;
    setTempDateFrom(formattedDate);
    
    // Auto-adjust To date if From date is after To date
    if (formattedDate && tempDateTo && dayjs(formattedDate).isAfter(dayjs(tempDateTo))) {
      const newToDate = dayjs(formattedDate).endOf('day').format(dateFormat);
      setTempDateTo(newToDate);
    }
  };

  const handleTempDateToChange = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? date.format(dateFormat) : null;
    
    if (formattedDate && tempDateFrom && dayjs(formattedDate).isBefore(dayjs(tempDateFrom))) {
      alert('To Date cannot be earlier than From Date');
      return;
    }
    
    setTempDateTo(formattedDate);
  };

  // Handle OK button in DateTimePicker
  const handleDateFromAccept = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? date.format(dateFormat) : null;
    
    // Apply the change immediately when OK is clicked
    onDateFromChange?.(formattedDate);
    
    // Auto-adjust To date if needed
    if (formattedDate && dateTo && dayjs(formattedDate).isAfter(dayjs(dateTo))) {
      const newToDate = dayjs(formattedDate).endOf('day').format(dateFormat);
      onDateToChange?.(newToDate);
    }
  };

  const handleDateToAccept = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? date.format(dateFormat) : null;
    
    if (formattedDate && dateFrom && dayjs(formattedDate).isBefore(dayjs(dateFrom))) {
      alert('To Date cannot be earlier than From Date');
      return;
    }
    
    // Apply the change immediately when OK is clicked
    onDateToChange?.(formattedDate);
  };

  // Handle Cancel button in DateTimePicker
  const handleDateFromCancel = () => {
    // Reset temp value to original value
    setTempDateFrom(dateFrom || null);
  };

  const handleDateToCancel = () => {
    // Reset temp value to original value
    setTempDateTo(dateTo || null);
  };

  // Style สำหรับ Time Picker
  const getTimePickerStyles = () => ({
    sx: {
      '& .MuiMultiSectionDigitalClock-root': {
        '& .MuiMenuItem-root': {
          fontSize: '12px',
          minHeight: '40px',
          paddingTop: '8px',
          paddingBottom: '8px',
          fontWeight: '500'
        },
      }
    }
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

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Date From */}
        <div className="flex items-center gap-1">
          <label className="font-semibold text-xs">From:</label>
          <DateTimePicker
            value={tempDateFrom ? dayjs(tempDateFrom) : null}
            onChange={handleTempDateFromChange}
            onAccept={handleDateFromAccept}
            onClose={handleDateFromCancel}
            format={dateFormat}
            ampm={false}
            timeSteps={{ minutes: 1 }}
            closeOnSelect={false} // ต้องกด OK ถึงจะปิด
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
              },
              popper: getTimePickerStyles(),
              actionBar: {
                actions: ['cancel', 'accept'], // แสดงปุ่ม Cancel และ OK
              },
            }}
          />
        </div>

        {/* Date To */}
        <div className="flex items-center gap-1">
          <label className="font-semibold text-xs">To:</label>
          <DateTimePicker
            value={tempDateTo ? dayjs(tempDateTo) : null}
            onChange={handleTempDateToChange}
            onAccept={handleDateToAccept}
            onClose={handleDateToCancel}
            format={dateFormat}
            ampm={false}
            timeSteps={{ minutes: 1 }}
            closeOnSelect={false} // ต้องกด OK ถึงจะปิด
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
              },
              popper: getTimePickerStyles(),
              actionBar: {
                actions: ['cancel', 'accept'], // แสดงปุ่ม Cancel และ OK
              },
            }}
          />
        </div>

      </LocalizationProvider>

      {/* Month Dropdown */}
      <div className="relative" ref={monthDropdownRef}>
        <button 
          className="flex items-center justify-between bg-violet-600 text-white px-2 py-1 rounded text-xs min-w-[100px] max-w-[140px] h-[28px]"
          onClick={() => setShowMonthDropdown(!showMonthDropdown)}
        >
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span className="truncate">
              {selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'Month'}
            </span>
          </div>
          <ChevronDown size={12} className={`transition-transform flex-shrink-0 ${showMonthDropdown ? 'rotate-180' : ''}`} />
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
          className="flex items-center justify-between bg-violet-600 text-white px-2 py-1 rounded text-xs min-w-[100px] max-w-[140px] h-[28px]"
          onClick={() => setShowYearDropdown(!showYearDropdown)}
        >
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span className="truncate">
              {selectedYear || 'Year'}
            </span>
          </div>
          <ChevronDown size={12} className={`transition-transform flex-shrink-0 ${showYearDropdown ? 'rotate-180' : ''}`} />
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
  );
}