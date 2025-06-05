// src/app/components/common/DateTimeField.tsx
'use client';

import React from 'react';
import { UseFormRegister, UseFormSetValue, Control, Controller } from "react-hook-form";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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
  
  // 🎨 เพิ่มตัวเลือกปรับขนาดตัวอักษร
  fontSize?: 'xs' | 'sm' | 'md' | 'lg';
  compactMode?: boolean;
  
  // Events
  onChange?: (value: Dayjs | null) => void;
  onError?: (error: any) => void;
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
  onError
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

  // 🎨 กำหนดขนาดตัวอักษรตาม prop fontSize
  const getFontSizes = () => {
    switch (fontSize) {
      case 'xs':
        return {
          input: '10px',
          calendarDay: '11px',
          calendarHeader: '13px',
          weekLabel: '9px',
          timeItem: '11px',
          actionButton: '10px'
        };
      case 'sm':
        return {
          input: '12px',
          calendarDay: '13px',
          calendarHeader: '15px',
          weekLabel: '11px',
          timeItem: '13px',
          actionButton: '12px'
        };
      case 'md':
        return {
          input: '14px',
          calendarDay: '15px',
          calendarHeader: '17px',
          weekLabel: '13px',
          timeItem: '15px',
          actionButton: '14px'
        };
      case 'lg':
        return {
          input: '16px',
          calendarDay: '17px',
          calendarHeader: '19px',
          weekLabel: '15px',
          timeItem: '17px',
          actionButton: '16px'
        };
      default:
        return getFontSizes(); // fallback to 'sm'
    }
  };

  // 🎨 กำหนดขนาด Calendar ตาม compactMode
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

  //   สำหรับปรับขนาดตัวอักษร
  const getPopperStyles = () => ({
    sx: {
      // Calendar Days (ตัวเลขวันที่)
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
      // Today's date
      '& .MuiPickersDay-root.MuiPickersDay-today': {
        fontSize: fontSizes.calendarDay,
        fontWeight: '600'
      },
      // Month buttons
      '& .MuiPickersMonth-monthButton': {
        fontSize: fontSizes.calendarDay,
        padding: compactMode ? '6px' : '8px'
      },
      // Year buttons  
      '& .MuiPickersYear-yearButton': {
        fontSize: fontSizes.calendarDay,
        padding: compactMode ? '6px' : '8px'
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
      // Navigation arrows
      '& .MuiPickersArrowSwitcher-button': {
        '& .MuiSvgIcon-root': {
          fontSize: compactMode ? '16px' : '20px'
        }
      },
      // Time picker digits
      '& .MuiMultiSectionDigitalClock-root': {
        '& .MuiMenuItem-root': {
          fontSize: fontSizes.timeItem,
          minHeight: calendarSizes.minHeight,
          paddingTop: compactMode ? '4px' : '6px',
          paddingBottom: compactMode ? '4px' : '6px'
        }
      },
      // Action buttons (CANCEL, OK)
      '& .MuiDialogActions-root': {
        '& .MuiButton-root': {
          fontSize: fontSizes.actionButton,
          padding: compactMode ? '4px 8px' : '6px 12px'
        }
      },
      // Overall popup sizing
      '& .MuiPaper-root': {
        fontSize: fontSizes.calendarDay
      },
      // Clock view (สำหรับ TimePicker)
      '& .MuiClock-root': {
        '& .MuiClockNumber-root': {
          fontSize: fontSizes.timeItem
        }
      }
    }
  });

  // Render DateTimePicker component ตาม variant
  const renderPicker = (field: any) => {
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
              padding: compactMode ? '4px 8px !important' : '6px 12px !important'
            },
            '& .MuiOutlinedInput-root': {
              fontSize: `${fontSizes.input} !important`
            }
          },
          required,
          error: !!field.error
        },
        // 🎨 ใช้ custom popper styles
        popper: getPopperStyles()
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
        <label className="font-semibold text-sm sm:text-base whitespace-nowrap min-w-[140px] sm:min-w-[160px]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* DateTimePicker Container */}
        <div className="w-full min-w-0">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name={fieldName}
              control={control}
              render={({ field, fieldState }) => (
                <div className="w-full">
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

// ======================================================================
// Utility functions สำหรับจัดการ date/time values

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