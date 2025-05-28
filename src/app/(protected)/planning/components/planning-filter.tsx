// src/app/(protected)/planning/components/planning-filter.tsx
'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, Controller, Control, UseFormSetValue } from "react-hook-form";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import SearchField from '@/app/components/common/SearchField';
import { search as searchPlannings } from "@/app/lib/services/planning";

interface PlanningFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  onSearch: () => void;
}

export default function PlanningFilterForm({ register, setValue, control, onSearch }: PlanningFilterFormProps) {
  const dateFormat = 'YYYY-MM-DD HH:mm';
  
  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '0.375rem',  
  };
  
  return (
    <div className="md:col-span-2 space-y-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Date From */}
          <div className="grid grid-cols-[110px_1fr] items-center gap-2">
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
          
          {/* Date To */}
          <div className="grid grid-cols-[110px_1fr] items-center gap-2">
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
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="planId"
          label="Plan ID"
          placeholder="Search plan ID..."
          dataLoader={searchPlannings}
          labelField="planId"
          valueField="planId"
          allowFreeText={true}
        />
        
        {/* Product ID */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productId"
          label="Product ID"
          placeholder="Search product ID..."
          dataLoader={searchPlannings}
          labelField="productId"
          valueField="productId"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Lot No */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="lotNo"
          label="Lot No"
          placeholder="Search lot number..."
          dataLoader={searchPlannings}
          labelField="lotNo"
          valueField="lotNo"
          allowFreeText={true}
        />
          
        {/* Line ID  */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="lineId"
          label="Line ID"
          placeholder="Search line ID..."
          dataLoader={searchPlannings}
          labelField="lineId"
          valueField="lineId"
          allowFreeText={true}
        />
        
        {/* Search Button */}
        <div className="flex items-center justify-start pt-[2px]">
          <button
            type="button"
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