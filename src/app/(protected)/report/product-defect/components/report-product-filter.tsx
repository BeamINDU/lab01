'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, Controller, Control } from "react-hook-form";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th'; 

interface ReportProductFilterFormProps {
  register: UseFormRegister<any>;
  control: Control<any>; 
  onSearch: () => void;
}

export default function ReportProductFilterForm({ register, control, onSearch }: ReportProductFilterFormProps) {
  const dateFormat = 'YYYY-MM-DD';
  
  return (
    <div className="md:col-span-2 space-y-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Date From - Using MUI DatePicker */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <label className="font-semibold w-[120px]">Date From</label>
                          <Controller
              name="dateFrom"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.format(dateFormat) : null)}
                  format={dateFormat}
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      fullWidth: true,
                      className: "rounded border border-gray-300",
                      placeholder: "YYYY-MM-DD"
                    } 
                  }}
                />
              )}
            />
          </div>
          
          {/* Date To - Using MUI DatePicker */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <label className="font-semibold w-[120px]">Date To</label>
                          <Controller
              name="dateTo"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.format(dateFormat) : null)}
                  format={dateFormat}
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      fullWidth: true,
                      className: "rounded border border-gray-300",
                      placeholder: "YYYY-MM-DD"
                    } 
                  }}
                />
              )}
            />
          </div>
        </div>
      </LocalizationProvider>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Product Name */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Product Name</label>
          <input
            type="text"
            {...register("productName")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        {/* Defect Type */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Defect Type</label>
          <input
            type="text"
            {...register("defectType")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        {/* Search Button */}
        <div className="flex items-center justify-start pt-[2px]">
          <button
            className="flex items-center gap-1 bg-[#004798] text-white px-4 py-2 rounded hover:bg-blue-900"
            onClick={onSearch}
          >
            Search
            <Search size={16} className="mt-1" />
          </button>
        </div>
      </div>
    </div>
  );
}