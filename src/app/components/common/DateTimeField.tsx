// src/app/components/common/DateTimeField.tsx
'use client';

import React, { useEffect } from 'react';
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
  
  // ✅ Layout options (เหมือน SearchField)
  layout?: 'responsive' | 'modal' | 'inline';
  labelWidth?: string;
  
  // ✅ เพิ่ม initialValue support
  initialValue?: string | Date | Dayjs | null;
  
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
  layout = 'responsive', // ✅ default เป็น responsive
  labelWidth = '150px',
  initialValue,
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

  // ✅ Style สำหรับ responsive และ modal
  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    width: '100%',
    minWidth: 0,
  };

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
          sx: inputStyle,
         // required,
          error: !!field.error
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

  // ✅ เลือก layout ตาม prop (เหมือน SearchField)
  const renderLayout = () => {
    const dateTimeComponent = (
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
    );

    switch (layout) {
      case 'modal':
        // ✅ Layout แบบ modal (เหมือนกับ input field อื่นๆ)
        return (
          <div className="grid grid-cols-[160px_1fr] items-center gap-4">
            <label className="font-normal w-32 pr-3">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}:
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
        );

      case 'inline':
        // ✅ Layout แบบ inline
        return (
          <div className="flex items-center gap-4">
            <label className="font-semibold whitespace-nowrap pr-3" style={{width: labelWidth}}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}:
            </label>
            <div className="flex-1 min-w-0">
              {dateTimeComponent}
            </div>
          </div>
        );

      case 'responsive':
      default:
        // ✅ Layout แบบ responsive (สำหรับ filter forms)
        return (
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] lg:grid-cols-[150px_1fr] items-start sm:items-center gap-4">
            <label className="font-semibold text-sm sm:text-base whitespace-nowrap pr-3">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="w-full min-w-0">
              {dateTimeComponent}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {renderLayout()}
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

// ======================================================================
// HOC สำหรับ wrap form field กับ error handling

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
      // เพิ่ม validation rules ถ้ามี
    />
  );
}

// ✅ Export convenience components สำหรับการใช้งานแต่ละแบบ
export const DateTimeFieldModal = (props: Omit<DateTimeFieldProps, 'layout'>) => (
  <DateTimeField {...props} layout="modal" />
);

export const DateTimeFieldInline = (props: Omit<DateTimeFieldProps, 'layout'>) => (
  <DateTimeField {...props} layout="inline" />
);

export const DateTimeFieldResponsive = (props: Omit<DateTimeFieldProps, 'layout'>) => (
  <DateTimeField {...props} layout="responsive" />
);

// ✅ Preset components สำหรับการใช้งานทั่วไป (รองรับ layout)
export const DateFieldModal = (props: Omit<DateTimeFieldProps, 'variant' | 'layout'>) => (
  <DateTimeField {...props} variant="date" layout="modal" />
);

export const TimeFieldModal = (props: Omit<DateTimeFieldProps, 'variant' | 'layout'>) => (
  <DateTimeField {...props} variant="time" layout="modal" />
);

export const DatePickerFieldModal = (props: Omit<DateTimeFieldProps, 'variant' | 'layout'>) => (
  <DateTimeField {...props} variant="datetime" layout="modal" />
);

// ✅ Responsive versions
export const DateFieldResponsive = (props: Omit<DateTimeFieldProps, 'variant' | 'layout'>) => (
  <DateTimeField {...props} variant="date" layout="responsive" />
);

export const TimeFieldResponsive = (props: Omit<DateTimeFieldProps, 'variant' | 'layout'>) => (
  <DateTimeField {...props} variant="time" layout="responsive" />
);

export const DatePickerFieldResponsive = (props: Omit<DateTimeFieldProps, 'variant' | 'layout'>) => (
  <DateTimeField {...props} variant="datetime" layout="responsive" />
);

// ======================================================================
// Type exports สำหรับใช้ใน components อื่น

export type { DateTimeFieldProps };
export { dayjs };
export type { Dayjs };