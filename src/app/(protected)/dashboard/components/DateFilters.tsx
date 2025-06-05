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

  // กำหนด style เฉพาะส่วน Time Picker (ตัวเลขชั่วโมง)
  const getTimePickerStyles = () => ({
    sx: {
      //  เฉพาะ Time picker digits (ตัวเลขชั่วโมง/นาที)
      '& .MuiMultiSectionDigitalClock-root': {
        '& .MuiMenuItem-root': {
          fontSize: '12px',           // ขนาดตัวเลขชั่วโมง/นาที
          minHeight: '40px',          // ความสูงของแต่ละรายการ
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
              },
              //  ใช้ custom time picker styles
              popper: getTimePickerStyles()
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
              },
              //  ใช้ style เดียวกันสำหรับ Date To
              popper: getTimePickerStyles()
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
  );
}