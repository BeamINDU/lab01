'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, Controller, Control } from "react-hook-form";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

interface PlanningFilterFormProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  onSearch: () => void;
}

export default function PlanningFilterForm({ register, control, onSearch }: PlanningFilterFormProps) {
  const dateFormat = 'YYYY-MM-DD HH:mm';
  
  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '0.375rem',  
  };
  
  return (
    <div className="md:col-span-2 space-y-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Date From - Using MUI DateTimePicker with white background */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <label className="font-semibold w-[120px]">Date From</label>
            <Controller
              name="dateFrom"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.format(dateFormat) : null)}
                  format={dateFormat}
                  ampm={false}
                  timeSteps={{ minutes: 1 }}
                  closeOnSelect={false} 
                  minutesStep={1}
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      fullWidth: true,
                      className: "rounded border border-gray-300",
                      placeholder: "YYYY-MM-DD HH:mm",
                      sx: inputStyle
                    } 
                  }}
                />
              )}
            />
          </div>
          
          {/* Date To - Using MUI DateTimePicker with white background */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <label className="font-semibold w-[120px]">Date To</label>
            <Controller
              name="dateTo"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.format(dateFormat) : null)}
                  format={dateFormat}
                  ampm={false}
                  timeSteps={{ minutes: 1 }}
                  closeOnSelect={false} 
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      fullWidth: true,
                      className: "rounded border border-gray-300",
                      placeholder: "YYYY-MM-DD HH:mm",
                      sx: inputStyle 
                    } 
                  }}
                />
              )}
            />
          </div>

        </div>
      </LocalizationProvider>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Plan ID */}
      <div className="grid grid-cols-[100px_1fr] items-center gap-2">
        <label className="font-semibold w-[120px]">Plan ID</label>
        <input
          type="text"
          {...register("planId")}
          className="rounded px-3 py-2 border border-gray-300 w-full"
        />
      </div>
        {/* Product ID */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Product ID</label>
          <input
            type="text"
            {...register("productId")}
            className="rounded px-3 py-2 border border-gray-300 w-full bg-white"
          />
        </div>
        

      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Product ID */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Lot No</label>
          <input
            type="text"
            {...register("lotNo")}
            className="rounded px-3 py-2 border border-gray-300 w-full bg-white"
          />
        </div>
        
          
          {/* Line ID */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <label className="font-semibold w-[120px]">Line ID</label>
            <input
              type="text"
              {...register("lineId")}
              className="rounded px-3 py-2 border border-gray-300 w-full bg-white"
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