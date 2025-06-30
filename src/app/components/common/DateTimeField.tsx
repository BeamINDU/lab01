'use client';

import React from 'react';
import { Control, Controller } from "react-hook-form";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { X } from 'lucide-react'; 
import dayjs, { Dayjs } from 'dayjs';

interface DateTimeFieldProps {
  control: Control<any>;
  fieldName: string;
  label: string;
  placeholder?: string;
  className?: string;
  format?: string;
  variant?: 'datetime' | 'date' | 'time';
  disabled?: boolean;
  required?: boolean;
  ampm?: boolean;
  closeOnSelect?: boolean;
  allowClear?: boolean; 
  timeSteps?: { hours?: number; minutes?: number; seconds?: number; };
  minDate?: Dayjs | Date | string;
  maxDate?: Dayjs | Date | string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  inputFontSize?: string;
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
  variant = 'datetime',
  disabled = false,
  required = false,
  ampm = false,
  closeOnSelect = false,
  allowClear = true, 
  timeSteps = { minutes: 1 },
  minDate,
  maxDate,
  size = 'small',
  fullWidth = true,
  inputFontSize = '14px',
  onChange,
  onError,
  onClear
}: DateTimeFieldProps) {
  

  const getFormat = () => {
    if (format) return format;
    switch (variant) {
      case 'date': return 'YYYY-MM-DD';
      case 'time': return 'HH:mm';
      default: return 'YYYY-MM-DD HH:mm';
    }
  };

  const getPlaceholder = () => placeholder || getFormat();

  const handleClear = (field: any, e: React.MouseEvent) => {
    e.stopPropagation();
    field.onChange(null);
    onClear?.();
    onChange?.(null);
  };

  const renderPicker = (field: any) => {
    const hasValue = field.value && field.value !== '';
    
    const baseProps = {
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
          required,
          error: !!field.error,
          style: {
            fontSize: inputFontSize,
          },
          inputProps: {
            style: {
              fontSize: inputFontSize,
              padding: '8px 12px',
              height: 'auto',
              lineHeight: '1.2'
            }
          },
          InputProps: {
            style: {
              fontSize: inputFontSize,
              minHeight: '40px',
              height: 'auto'
            },
            ...(allowClear && hasValue && !disabled ? {
              endAdornment: (
                <button
                  type="button"
                  onClick={(e) => handleClear(field, e)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  tabIndex={-1}
                  title="Clear date"
                >
                  <X size={12} />
                </button>
              )
            } : {})
          },
          sx: {
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            '& input': {
              fontSize: `${inputFontSize} !important`,
            },
            '& .MuiOutlinedInput-root': {
              fontSize: `${inputFontSize} !important`,
            },
            '& .MuiInputBase-input': {
              fontSize: `${inputFontSize} !important`,
            }
          }
        }
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
            {...baseProps}
            minDate={minDate ? dayjs(minDate) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : undefined}
          />
        );
      case 'time':
        return (
          <TimePicker 
            {...baseProps}
            ampm={ampm}
            timeSteps={timeSteps}
          />
        );
      default:
        return (
          <DateTimePicker 
            {...baseProps}
            minDate={minDate ? dayjs(minDate) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : undefined}
            ampm={ampm}
            timeSteps={timeSteps}
            closeOnSelect={closeOnSelect}
          />
        );
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-start sm:items-center gap-2">
        <label className="font-semibold text-sm sm:text-base whitespace-nowrap min-w-[130px] sm:min-w-[150px]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
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

// Helper functions
export const DateTimeHelpers = {
  parseDate: (value: string | Date | null | undefined): Dayjs | null => {
    return value ? dayjs(value) : null;
  },
  formatDate: (date: Dayjs | Date | string | null, format: string = 'YYYY-MM-DD HH:mm'): string => {
    return date ? dayjs(date).format(format) : '';
  },
  isValidDate: (date: any): boolean => {
    return dayjs(date).isValid();
  },
  toISOString: (date: Dayjs | Date | string | null): string | null => {
    return date ? dayjs(date).toISOString() : null;
  }
};

export type { DateTimeFieldProps };
export { dayjs };
export type { Dayjs };