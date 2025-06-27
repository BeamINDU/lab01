'use client';

import { useRef, useState, useEffect } from 'react';
import { CalendarIcon, ChevronDown } from "lucide-react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

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
  const [tempDateFrom, setTempDateFrom] = useState<string | null>(dateFrom || null);
  const [tempDateTo, setTempDateTo] = useState<string | null>(dateTo || null);
  
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  const dateFormat = 'YYYY-MM-DD HH:mm';
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
    { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
    { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => ({ 
    value: (currentYear - i).toString(), 
    label: (currentYear - i).toString() 
  }));

  useEffect(() => setTempDateFrom(dateFrom || null), [dateFrom]);
  useEffect(() => setTempDateTo(dateTo || null), [dateTo]);

  const handleTempDateFromChange = (date: dayjs.Dayjs | null) => {
    const formattedDate = date?.format(dateFormat) || null;
    setTempDateFrom(formattedDate);
    if (formattedDate && tempDateTo && dayjs(formattedDate).isAfter(dayjs(tempDateTo))) {
      setTempDateTo(dayjs(formattedDate).endOf('day').format(dateFormat));
    }
  };

  const handleTempDateToChange = (date: dayjs.Dayjs | null) => {
    setTempDateTo(date?.format(dateFormat) || null);
  };

  const handleDateFromAccept = (date: dayjs.Dayjs | null) => {
    const formattedDate = date?.format(dateFormat) || null;
    onDateFromChange?.(formattedDate);
    if (formattedDate && dateTo && dayjs(formattedDate).isAfter(dayjs(dateTo))) {
      onDateToChange?.(dayjs(formattedDate).endOf('day').format(dateFormat));
    }
  };

  const handleDateToAccept = (date: dayjs.Dayjs | null) => {
    onDateToChange?.(date?.format(dateFormat) || null);
  };

  const textFieldProps = {
    size: "small" as const,
    className: "w-[150px]",
    placeholder: "YYYY-MM-DD HH:mm",
    InputProps: { style: { fontSize: '10px', height: '28px', padding: '0 8px' } },
    inputProps: { style: { fontSize: '10px', padding: '4px 0', textAlign: 'center' as const } },
    sx: {
      backgroundColor: 'white',
      borderRadius: '0.375rem',
      '& input': { fontSize: '10px !important', padding: '4px 8px !important' },
      '& .MuiOutlinedInput-root': { fontSize: '10px !important' }
    }
  };

  const commonPickerProps = {
    format: dateFormat,
    ampm: false,
    timeSteps: { minutes: 1 },
    closeOnSelect: false
  };

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

  const renderDropdown = (
    ref: React.RefObject<HTMLDivElement>,
    show: boolean,
    setShow: (show: boolean) => void,
    options: { value: string; label: string }[],
    selected: string | undefined,
    onChange: ((value: string) => void) | undefined,
    placeholder: string,
    allLabel: string,
    width: string
  ) => (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded bg-violet-600 hover:bg-violet-700 text-white text-xs"
        onClick={() => setShow(!show)}
      >
        <CalendarIcon size={12} />
        <span className={`text-left ${width}`}>
          {selected ? options.find(o => o.value === selected)?.label || selected : placeholder}
        </span>
        <ChevronDown size={12} />
      </button>
      {show && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
          <button
            className="w-full px-3 py-1 text-left hover:bg-gray-100 text-xs whitespace-nowrap"
            onClick={() => { onChange?.(''); setShow(false); }}
          >
            {allLabel}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              className="w-full px-3 py-1 text-left hover:bg-gray-100 text-xs whitespace-nowrap"
              onClick={() => { onChange?.(option.value); setShow(false); }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex items-center gap-1">
          <label className="font-semibold text-xs">From:</label>
          <DateTimePicker
            value={tempDateFrom ? dayjs(tempDateFrom) : null}
            onChange={handleTempDateFromChange}
            onAccept={handleDateFromAccept}
            onClose={() => setTempDateFrom(dateFrom || null)}
            maxDate={tempDateTo ? dayjs(tempDateTo) : undefined}
            slotProps={{ textField: textFieldProps }}
            {...commonPickerProps}
          />
        </div>

        <div className="flex items-center gap-1">
          <label className="font-semibold text-xs">To:</label>
          <DateTimePicker
            value={tempDateTo ? dayjs(tempDateTo) : null}
            onChange={handleTempDateToChange}
            onAccept={handleDateToAccept}
            onClose={() => setTempDateTo(dateTo || null)}
            minDate={tempDateFrom ? dayjs(tempDateFrom) : undefined}
            slotProps={{ textField: textFieldProps }}
            {...commonPickerProps}
          />
        </div>
      </LocalizationProvider>

      {renderDropdown(
        monthDropdownRef, showMonthDropdown, setShowMonthDropdown,
        months, selectedMonth, onMonthChange, 'Month', 'All Months', 'min-w-[50px]'
      )}

      {renderDropdown(
        yearDropdownRef, showYearDropdown, setShowYearDropdown,
        years, selectedYear, onYearChange, 'Year', 'All Years', 'min-w-[40px]'
      )}
    </div>
  );
}