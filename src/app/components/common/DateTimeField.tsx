'use client';

import React from 'react';
import { UseFormRegister, UseFormSetValue, Control, Controller } from "react-hook-form";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { X } from 'lucide-react'; 
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';

interface DateTimeFieldProps {
  // Form integration
  control: Control<any>;
  fieldName: string;
  
  // Display
  label: string;
  placeholder?: string;
  className?: string;
  
  // DateTimePicker specific options
  format?: string;
  dateFormat?: string;
  timeFormat?: string;
  variant?: 'datetime' | 'date' | 'time';
  
  // Behavior
  disabled?: boolean;
  required?: boolean;
  ampm?: boolean;
  closeOnSelect?: boolean;
  allowClear?: boolean; 
  timeSteps?: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  };
  
  // Validation
  minDate?: Dayjs | Date | string;
  maxDate?: Dayjs | Date | string;
  minDateTime?: Dayjs | Date | string;
  maxDateTime?: Dayjs | Date | string;
  
  // Styling
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  
  // เพิ่มตัวเลือกปรับขนาดตัวอักษร
  fontSize?: 'xs' | 'sm' | 'md' | 'lg';
  compactMode?: boolean;
  
  // Events
  onChange?: (value: Dayjs | null) => void;
  onError?: (error: any) => void;
  onClear?: () => void; 
}

export default function DateTimeField({
  control,
  fieldName,
  label,
  placeholder,
  className = "",
  format,
  dateFormat = 'YYYY-MM-DD',
  timeFormat = 'HH:mm',
  variant = 'datetime',
  disabled = false,
  required = false,
  ampm = false,
  closeOnSelect = false,
  allowClear = true, 
  timeSteps = { minutes: 1 },
  minDate,
  maxDate,
  minDateTime,
  maxDateTime,
  size = 'small',
  fullWidth = true,
  fontSize = 'sm',
  compactMode = false,
  onChange,
  onError,
  onClear
}: DateTimeFieldProps) {
  
  // กำหนด format ตาม variant
  const getFormat = () => {
    if (format) return format;
    
    switch (variant) {
      case 'date':
        return dateFormat;
      case 'time':
        return timeFormat;
      case 'datetime':
      default:
        return `${dateFormat} ${timeFormat}`;
    }
  };

  // กำหนด placeholder ตาม variant
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (variant) {
      case 'date':
        return dateFormat;
      case 'time':
        return timeFormat;
      case 'datetime':
      default:
        return `${dateFormat} ${timeFormat}`;
    }
  };

  // กำหนดขนาดตัวอักษรตาม prop fontSize
const getFontSizes = () => {
  switch (fontSize) {
    case 'xs':
      return {
        input: '12px',           
        calendarDay: '13px',     
        calendarHeader: '15px',  
        weekLabel: '11px',       
        timeItem: '13px',        
        actionButton: '12px'     
      };
    case 'sm':
      return {
        input: '14px',           
        calendarDay: '14px',     
        calendarHeader: '16px',  
        weekLabel: '12px',       
        timeItem: '14px',        
        actionButton: '13px'     
      };
    case 'md':
      return {
        input: '16px',          
        calendarDay: '16px',     
        calendarHeader: '18px',  
        weekLabel: '14px',       
        timeItem: '16px',        
        actionButton: '15px'     
      };
    case 'lg':
      return {
        input: '18px',         
        calendarDay: '18px',    
        calendarHeader: '20px',  
        weekLabel: '16px',       
        timeItem: '18px',       
        actionButton: '17px'     
      };
    default:
      return getFontSizes(); 
  }
};

  
  const getCalendarSizes = () => {
    if (compactMode) {
      return {
        dayWidth: '28px',
        dayHeight: '28px',
        minHeight: '32px'
      };
    }
    return {
      dayWidth: '36px',
      dayHeight: '36px', 
      minHeight: '40px'
    };
  };

  const fontSizes = getFontSizes();
  const calendarSizes = getCalendarSizes();

  // Style สำหรับ responsive
  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    width: '100%',
    minWidth: 0,
  };

  //  สำหรับปรับขนาดตัวอักษร
const getPopperStyles = () => ({
  sx: {
    // Calendar Days
    '& .MuiPickersDay-root': {
      fontSize: fontSizes.calendarDay,
      width: calendarSizes.dayWidth,
      height: calendarSizes.dayHeight,
      minWidth: calendarSizes.dayWidth,
      fontWeight: '500'
    },
    // Selected day
    '& .MuiPickersDay-root.Mui-selected': {
      fontSize: fontSizes.calendarDay,
      fontWeight: 'bold'
    },
    // Header (June 2025)
    '& .MuiPickersCalendarHeader-label': {
      fontSize: fontSizes.calendarHeader,
      fontWeight: '600'
    },
    // Week day labels (S M T W T F S)
    '& .MuiDayCalendar-weekDayLabel': {
      fontSize: fontSizes.weekLabel,
      fontWeight: '500',
      width: calendarSizes.dayWidth,
      height: calendarSizes.dayHeight
    },
    // Time picker digits  
    '& .MuiMultiSectionDigitalClock-root': {
      '& .MuiMenuItem-root': {
        fontSize: fontSizes.timeItem,
        minHeight: calendarSizes.minHeight,
        paddingTop: compactMode ? '4px' : '8px',   
        paddingBottom: compactMode ? '4px' : '8px',
        fontWeight: '400'                        
      },
    },
    // Action buttons
    '& .MuiDialogActions-root': {
      '& .MuiButton-root': {
        fontSize: fontSizes.actionButton,
        padding: compactMode ? '4px 8px' : '8px 16px'  
      }
    }
  }
});

  // ฟังก์ชันสำหรับ clear ค่า
  const handleClear = (field: any, e: React.MouseEvent) => {
    e.stopPropagation();
    field.onChange(null);
    onClear?.();
    onChange?.(null);
  };

  const renderPicker = (field: any) => {
    const hasValue = field.value && field.value !== '';
    
    const commonProps = {
      value: field.value ? dayjs(field.value) : null,
      onChange: (date: Dayjs | null) => {
        const formattedValue = date ? date.format(getFormat()) : null;
        field.onChange(formattedValue);
        onChange?.(date);
      },
      format: getFormat(),
      disabled,
      slotProps: { 
        textField: { 
          size,
          fullWidth,
          placeholder: getPlaceholder(),
          sx: {
            ...inputStyle,
            '& input': {
              fontSize: `${fontSizes.input} !important`,
              padding: compactMode ? '4px 8px !important' : '6px 12px !important',
            },
            '& .MuiOutlinedInput-root': {
              fontSize: `${fontSizes.input} !important`,
              position: 'relative'
            },
            '& .MuiInputAdornment-root': allowClear && hasValue && !disabled ? {
              display: 'none'
            } : undefined
          },
          required,
          error: !!field.error,
          InputProps: allowClear && hasValue && !disabled ? {
            endAdornment: (
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={(e) => handleClear(field, e)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  tabIndex={-1}
                  title="Clear date"
                >
                  <X size={16} />
                </button>
              </div>
            )
          } : undefined
        },
        popper: getPopperStyles(),
        openPickerIcon: allowClear && hasValue && !disabled ? undefined : undefined
      },
      onError: (error: any) => {
        console.error('DateTimePicker error:', error);
        onError?.(error);
      }
    };

    switch (variant) {
      case 'date':
        return (
          <DatePicker
            {...commonProps}
            minDate={minDate ? dayjs(minDate) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : undefined}
          />
        );
        
      case 'time':
        return (
          <TimePicker
            {...commonProps}
            ampm={ampm}
            timeSteps={timeSteps}
          />
        );
        
      case 'datetime':
      default:
        return (
          <DateTimePicker
            {...commonProps}
            ampm={ampm}
            timeSteps={timeSteps}
            closeOnSelect={closeOnSelect}
            minDateTime={minDateTime ? dayjs(minDateTime) : undefined}
            maxDateTime={maxDateTime ? dayjs(maxDateTime) : undefined}
          />
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Responsive Grid Layout */}
       <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr] items-start sm:items-center gap-2">
        {/* Label */}
        <label className="font-semibold text-sm sm:text-base whitespace-nowrap min-w-[4px] sm:min-w-[150px]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* DateTimePicker Container */}
        <div className="w-full min-w-0 relative">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name={fieldName}
              control={control}
              render={({ field, fieldState }) => (
                <div className="w-full relative">
                  {renderPicker(field)}
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
}


export const DateTimeHelpers = {
  // แปลง string เป็น Dayjs object
  parseDate: (value: string | Date | null | undefined): Dayjs | null => {
    if (!value) return null;
    return dayjs(value);
  },

  // แปลง Dayjs เป็น string format ที่ต้องการ
  formatDate: (date: Dayjs | Date | string | null, format: string = 'YYYY-MM-DD HH:mm'): string => {
    if (!date) return '';
    return dayjs(date).format(format);
  },

  // เช็คว่าวันที่ถูกต้องหรือไม่
  isValidDate: (date: any): boolean => {
    return dayjs(date).isValid();
  },

  // สร้าง date range สำหรับ validation
  createDateRange: (startDate: string | Date, endDate: string | Date) => ({
    minDate: dayjs(startDate),
    maxDate: dayjs(endDate)
  }),

  // แปลงเป็น ISO string สำหรับ API
  toISOString: (date: Dayjs | Date | string | null): string | null => {
    if (!date) return null;
    return dayjs(date).toISOString();
  },

  // แปลงเป็น format สำหรับแสดงผล
  toDisplayFormat: (date: Dayjs | Date | string | null, format: string = 'DD/MM/YYYY HH:mm'): string => {
    if (!date) return '';
    return dayjs(date).format(format);
  },

  // เช็ค date range
  isInRange: (date: Dayjs | Date | string, startDate: Dayjs | Date | string, endDate: Dayjs | Date | string): boolean => {
    const checkDate = dayjs(date);
    return checkDate.isAfter(dayjs(startDate)) && checkDate.isBefore(dayjs(endDate));
  },

  // สร้าง preset date values
  presets: {
    now: () => dayjs(),
    today: () => dayjs().startOf('day'),
    tomorrow: () => dayjs().add(1, 'day').startOf('day'),
    yesterday: () => dayjs().subtract(1, 'day').startOf('day'),
    startOfWeek: () => dayjs().startOf('week'),
    endOfWeek: () => dayjs().endOf('week'),
    startOfMonth: () => dayjs().startOf('month'),
    endOfMonth: () => dayjs().endOf('month'),
  }
};


interface DateTimeFieldWithValidationProps extends DateTimeFieldProps {
  rules?: {
    required?: string | boolean;
    min?: string | Date;
    max?: string | Date;
    validate?: (value: string) => boolean | string;
  };
}

export function DateTimeFieldWithValidation({
  rules,
  ...props
}: DateTimeFieldWithValidationProps) {
  return (
    <DateTimeField
      {...props}
    />
  );
}
export type { DateTimeFieldProps };
export { dayjs };
export type { Dayjs };